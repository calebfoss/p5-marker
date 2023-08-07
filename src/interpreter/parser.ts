import { Base } from "../elements/base";
import {
  AdditiveOperator,
  AdditiveToken,
  BooleanToken,
  ColonToken,
  CommaToken,
  ComparisonOperator,
  ComparisonToken,
  DotToken,
  EqualityOperator,
  EqualityToken,
  IdentifierToken,
  LiteralToken,
  LogicalOperator,
  LogicalToken,
  MultiplicativeOperator,
  MultiplicativeToken,
  NotToken,
  NumberToken,
  ParenthesisToken,
  PunctuatorToken,
  QuestionToken,
  SquareBracketToken,
  StringToken,
  Token,
} from "./tokens";

type Tokens = Token[];

function fn<L extends Function, R extends any[]>(
  getFunction: () => L,
  getArguments: () => R
) {
  return () => getFunction()(...getArguments());
}

function member<L, R>(getLeft: () => L, getRight: () => R) {
  return () => {
    const left = getLeft();
    const right = getRight();
    return getLeft()[getRight() as keyof L];
  };
}

function array<O extends object>(
  getOwner: () => O,
  tokensBetweenBrackets: Tokens
) {
  const commaSeparatedSections = [[]];
  for (const token of tokensBetweenBrackets) {
    if (token instanceof CommaToken) commaSeparatedSections.push([]);
    else commaSeparatedSections[commaSeparatedSections.length - 1].push(token);
  }
  const expressions = commaSeparatedSections.map((section) =>
    parseExpression(getOwner, section)
  );
  return () => expressions.map((expression) => expression());
}

function not<R>(getRight: () => R) {
  return () => !getRight();
}

function multiplicative<L, R>(
  getLeft: () => L,
  operator: MultiplicativeOperator,
  getRight: () => R
) {
  if (typeof getLeft() !== "number")
    throw new Error(
      `Left hand side of ${operator} is of type ${typeof getLeft()}, but it must be a number`
    );
  if (typeof getRight() !== "number")
    throw new Error(
      `Right hand side of ${operator} is of type ${typeof getLeft()}, but it must be a number`
    );
  const getLeftAsNumber = getLeft as () => number;
  const getRightAsNumber = getRight as () => number;
  switch (operator) {
    case "*":
      return () => getLeftAsNumber() * getRightAsNumber();
    case "/":
      return () => getLeftAsNumber() / getRightAsNumber();
    case "%":
      return () => getLeftAsNumber() % getRightAsNumber();
  }
}

function additive<L, R>(
  getLeft: () => L,
  operator: AdditiveOperator,
  getRight: () => R
) {
  if (operator === "+") return () => (getLeft() as any) + getRight();
  return () => (getLeft() as any) - (getRight() as any);
}

function comparison<L, R>(
  getLeft: () => L,
  operator: ComparisonOperator,
  getRight: () => R
): () => boolean {
  const getLeftAsNumber = getLeft as () => number;
  const getRightAsNumber = getRight as () => number;
  switch (operator) {
    case "less than":
      return () => getLeftAsNumber() < getRightAsNumber();
    case "no more than":
      return () => getLeftAsNumber() <= getRightAsNumber();
    case "greater than":
      return () => getLeftAsNumber() > getRightAsNumber();
    case "at least":
      return () => getLeftAsNumber() >= getRightAsNumber();
  }
}

function equality<L, R>(
  getLeft: () => L,
  operator: EqualityOperator,
  getRight: () => R
): () => boolean {
  if (operator === "is") return () => Object.is(getLeft(), getRight());
  return () => !Object.is(getLeft(), getRight());
}

function logical<L, R>(
  getLeft: () => L,
  operator: LogicalOperator,
  getRight: () => R
) {
  switch (operator) {
    case "and":
      return () => getLeft() && getRight();
    case "or":
      return () => getLeft() || getRight();
  }
}

function identity<T>(value: T) {
  return () => value;
}

function ternary<L, C, R>(
  getLeft: () => L,
  getCenter: () => C,
  getRight: () => R
) {
  return () => (getLeft() ? getCenter() : getRight());
}

function leftRight<V, Obj extends object, Op>(
  getOwner: () => Obj,
  tokens: Tokens,
  operator: Op,
  operatorIndex: number,
  expressionFunction: <L, R>(
    getLeft: () => L,
    operator: Op,
    getRight: () => R
  ) => () => V
) {
  const getLeft = parseExpression(getOwner, tokens.slice(0, operatorIndex));
  const getRight = parseExpression(getOwner, tokens.slice(operatorIndex + 1));
  return expressionFunction(getLeft, operator, getRight);
}

function shallowFindIndex(
  tokens: Tokens,
  callback: (token: Token) => boolean,
  first = true
) {
  let parenthesisDepth = 0;
  let squareBracketDepth = 0;
  const wrappedCallback = (token: Token) => {
    const zeroDepthBefore = parenthesisDepth === 0 && squareBracketDepth === 0;
    switch (token.value) {
      case "(":
        parenthesisDepth++;
        break;
      case "[":
        squareBracketDepth++;
        break;
      case ")":
        parenthesisDepth--;
        break;
      case "]":
        squareBracketDepth--;
        break;
    }
    if (zeroDepthBefore || (parenthesisDepth === 0 && squareBracketDepth === 0))
      return callback(token);
    return false;
  };
  if (first) return tokens.findIndex(wrappedCallback);
  return tokens.findLastIndex(wrappedCallback);
}

function indexOfClass<C extends typeof PunctuatorToken>(
  tokens: Tokens,
  tokenClass: C,
  first = true
): [number, InstanceType<C>] {
  const index = shallowFindIndex(
    tokens,
    (token) => token instanceof tokenClass,
    first
  );
  return [index, tokens[index] as InstanceType<C>];
}

function createBaseGetter<O extends object>(getOwner: () => O, token: Token) {
  if (token instanceof LiteralToken) return identity(token.value);
  if (token instanceof IdentifierToken) {
    const propertyName = (token as IdentifierToken).value;
    const findProperty = <O2 extends object>(owner: O2) => {
      if (propertyName in owner) return owner[propertyName];
      if (propertyName in owner.constructor)
        return owner.constructor[propertyName];
      if (owner instanceof Base && owner.parent instanceof Base)
        return findProperty(owner.parent);
      throw new Error(`Couldn't find ${propertyName}`);
    };
    return () => findProperty(getOwner());
  }
  throw new Error(`Unexpected token: ${token.value}`);
}

export function parseExpression<O extends object>(
  getOwner: () => O,
  tokens: Tokens
): () => unknown {
  const [questionIndex] = indexOfClass(tokens, QuestionToken);
  if (questionIndex > -1) {
    const [colonIndex] = indexOfClass(tokens, ColonToken, false);
    if (colonIndex === -1)
      throw new Error("Found ? without : to complete ternary expression.");
    if (colonIndex < questionIndex)
      throw new Error(
        "Found ? without a : following it to complete ternary expression"
      );
    const getLeft = parseExpression(getOwner, tokens.slice(0, questionIndex));
    const getCenter = parseExpression(
      getOwner,
      tokens.slice(questionIndex + 1, colonIndex)
    );
    const getRight = parseExpression(getOwner, tokens.slice(colonIndex + 1));
    return ternary(getLeft, getCenter, getRight);
  }

  const [logicalIndex, logicalToken] = indexOfClass(tokens, LogicalToken);
  if (logicalIndex > -1)
    return leftRight(
      getOwner,
      tokens,
      logicalToken.value,
      logicalIndex,
      logical
    );

  const [equalityIndex, equalityToken] = indexOfClass(tokens, EqualityToken);
  if (equalityIndex > -1)
    return leftRight(
      getOwner,
      tokens,
      equalityToken.value,
      equalityIndex,
      equality
    );

  const [comparisonIndex, comparisonToken] = indexOfClass(
    tokens,
    ComparisonToken
  );
  if (comparisonIndex > -1)
    return leftRight(
      getOwner,
      tokens,
      comparisonToken.value,
      comparisonIndex,
      comparison
    );

  const [additiveIndex, additiveToken] = indexOfClass(tokens, AdditiveToken);
  if (additiveIndex > -1)
    return leftRight(
      getOwner,
      tokens,
      additiveToken.value,
      additiveIndex,
      additive
    );

  const [multiplicativeIndex, multiplicativeToken] = indexOfClass(
    tokens,
    MultiplicativeToken
  );
  if (multiplicativeIndex > -1)
    return leftRight(
      getOwner,
      tokens,
      multiplicativeToken.value,
      multiplicativeIndex,
      multiplicative
    );

  // exponential would go here

  const [notIndex] = indexOfClass(tokens, NotToken);
  if (notIndex === 0)
    return not(parseExpression(getOwner, tokens.slice(notIndex + 1)));
  if (notIndex > 0)
    throw new Error("Found 'not' operator in the middle of an expression.");

  const [dotIndex] = indexOfClass(tokens, DotToken);
  if (dotIndex > -1) {
    const getLeft = parseExpression(getOwner, tokens.slice(0, dotIndex));
    const getRight = identity(tokens[dotIndex + 1].value);
    return member(getLeft, getRight);
  }

  const leftParenthesisIndex = shallowFindIndex(
    tokens,
    (token) => token.value === "("
  );
  if (leftParenthesisIndex > -1) {
    const rightParenthesisIndex = shallowFindIndex(
      tokens,
      (token) => token.value === ")"
    );
    if (rightParenthesisIndex === -1)
      throw new Error("Found '(' without matching ')'");
    if (rightParenthesisIndex < leftParenthesisIndex)
      throw new Error("Found ')' before '('");
    if (rightParenthesisIndex < tokens.length - 1)
      throw new Error(
        `Found unexpected tokens: ${tokens
          .slice(rightParenthesisIndex + 1)
          .join(" ")}`
      );
    if (leftParenthesisIndex > 0) {
      const getFn = parseExpression(
        getOwner,
        tokens.slice(0, leftParenthesisIndex)
      );
      const getArgs = array(
        getOwner,
        tokens.slice(leftParenthesisIndex + 1, rightParenthesisIndex)
      );
      return fn(getFn as () => Function, getArgs);
    }
    return parseExpression(
      getOwner,
      tokens.slice(leftParenthesisIndex + 1, rightParenthesisIndex)
    );
  }

  const leftBracketIndex = shallowFindIndex(
    tokens,
    (token) => token.value === "["
  );
  if (leftBracketIndex > -1) {
    const rightBracketIndex = shallowFindIndex(
      tokens,
      (token) => token.value === "]"
    );
    if (rightBracketIndex === -1)
      throw new Error("Found '[' without matching ']'");
    if (rightBracketIndex < leftBracketIndex)
      throw new Error("Found ']' before '['");
    if (leftBracketIndex > 0) {
      const getLeft = parseExpression(
        getOwner,
        tokens.slice(0, leftBracketIndex)
      );
      const getRight = parseExpression(
        getLeft as () => object,
        tokens.slice(leftBracketIndex, rightBracketIndex - 1)
      );
      return member(getLeft, getRight);
    } else if (rightBracketIndex < tokens.length - 1)
      throw new Error(
        `Unexpected tokens: ${tokens
          .slice(rightBracketIndex + 1)
          .map((t) => t.value)
          .join(" ")}`
      );
    return array(
      getOwner,
      tokens.slice(leftBracketIndex + 1, rightBracketIndex)
    );
  }

  const [token, ...remainder] = tokens;
  if (remainder.length)
    throw new Error(
      `Unexpected token(s): ${remainder.map((t) => t.value).join(" ")}`
    );
  return createBaseGetter(getOwner, token);
}

function parseAttributeName(
  getOwner: () => object,
  tokens: Tokens
): [() => object, () => PropertyKey] {
  const [lastToken] = tokens.slice(-1);
  if (lastToken instanceof IdentifierToken) {
    const previousTokens = tokens.slice(0, -1);
    const getPropertyKey = () => lastToken.value;
    if (previousTokens.length === 0) return [getOwner, getPropertyKey];
    const [secondToLastToken] = previousTokens.slice(-1);
    if (!(secondToLastToken instanceof DotToken))
      throw new Error(`Unexpected token ${secondToLastToken.value}`);
    const getPropertyOwner = parseExpression(
      getOwner,
      previousTokens.slice(0, -1)
    );
    return [getPropertyOwner as () => object, getPropertyKey];
  }
  if (lastToken instanceof PunctuatorToken && lastToken.value === "]") {
    const leftBracketIndex = shallowFindIndex(
      tokens,
      (token) => token.value === "[",
      false
    );
    if (leftBracketIndex < 0) throw new Error(`Found ] without matching [`);
    if (leftBracketIndex === 0) {
      const getPropertyKey = parseExpression(getOwner, tokens.slice(1, -1));
      return [getOwner, getPropertyKey as () => PropertyKey];
    }
    const getPropertyOwner = parseExpression(
      getOwner,
      tokens.slice(0, leftBracketIndex)
    ) as () => object;
    const getPropertyKey = parseExpression(
      getPropertyOwner as () => object,
      tokens.slice(leftBracketIndex + 1, -1)
    ) as () => PropertyKey;
    return [getPropertyOwner, getPropertyKey];
  }
  throw new Error(
    `Attribute names must end with a property key, but this name ends with ${lastToken.value}`
  );
}

export function parseAttribute(
  nameTokens: Tokens,
  valueTokens: Tokens,
  nameReference: object,
  valueReference: object
): [() => object, () => PropertyKey, () => any] {
  const [getOwner, getPropertyKey] = parseAttributeName(
    identity(nameReference),
    nameTokens
  );
  const getValue = parseExpression(identity(valueReference), valueTokens);
  return [getOwner, getPropertyKey, getValue];
}
