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

function objectOrFunction<O extends object | (() => object)>(
  getOwner: () => object,
  getObject: () => O,
  tokens: Tokens
) {
  if (tokens.length === 0) return getObject;
  const [nextToken, ...remainder] = tokens;
  if (nextToken instanceof DotToken)
    return parseExpression(getObject, remainder);
  if (nextToken instanceof SquareBracketToken && nextToken.value === "[") {
    const rightBracketIndex = shallowFindIndex(
      tokens,
      (token) => token.value === "]"
    );
    const getPropertyKey = parseExpression(
      getObject,
      tokens.slice(1, rightBracketIndex)
    ) as () => PropertyKey;
    const getProperty = () => getObject()[getPropertyKey()];
    return objectOrFunction(
      getOwner,
      getProperty,
      tokens.slice(rightBracketIndex + 1)
    );
  } else if (nextToken instanceof ParenthesisToken && nextToken.value === "(") {
    const rightParenthesisIndex = shallowFindIndex(
      tokens,
      (token) => token.value === ")"
    );
    const getArguments = array(
      getOwner,
      tokens.slice(1, rightParenthesisIndex)
    );
    const getReturnValue = () => (getObject() as Function)(...getArguments());
    return objectOrFunction(
      getOwner,
      getReturnValue,
      tokens.slice(rightParenthesisIndex + 1)
    );
  }
  throw new Error(`Unexpected token: ${nextToken.value}`);
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
    switch (token.value) {
      case "(":
        if (
          parenthesisDepth === 0 &&
          squareBracketDepth === 0 &&
          callback(token)
        )
          return true;
        parenthesisDepth++;
        return false;
      case "[":
        if (
          parenthesisDepth === 0 &&
          squareBracketDepth === 0 &&
          callback(token)
        )
          return true;
        squareBracketDepth++;
        return false;
      case ")":
        parenthesisDepth--;
        break;
      case "]":
        squareBracketDepth--;
        break;
    }
    if (parenthesisDepth !== 0 || squareBracketDepth !== 0) return false;
    return callback(token);
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

  const leftBracketIndex = shallowFindIndex(
    tokens,
    (token) => token.value === "["
  );

  if (leftBracketIndex === 0) {
    const rightBracketIndex = shallowFindIndex(
      tokens,
      (token) => token.value === "]"
    );
    if (rightBracketIndex === -1)
      throw new Error("Found '[' without matching ']'");
    if (rightBracketIndex < leftBracketIndex)
      throw new Error("Found ']' before '['");
    const getArray = array(
      getOwner,
      tokens.slice(leftBracketIndex + 1, rightBracketIndex)
    );
    return objectOrFunction(
      getOwner,
      getArray,
      tokens.slice(rightBracketIndex + 1)
    );
  }

  const leftParenthesisIndex = shallowFindIndex(
    tokens,
    (token) => token.value === "("
  );
  if (leftParenthesisIndex === 0) {
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
    return parseExpression(
      getOwner,
      tokens.slice(leftParenthesisIndex + 1, rightParenthesisIndex)
    );
  }

  const [firstToken, ...remainder] = tokens;
  const getBase = createBaseGetter(getOwner, firstToken);
  if (remainder.length === 0) return getBase;
  return objectOrFunction(getOwner, getBase, remainder);
}

function parseAttributeName(
  getOwner: () => object,
  tokens: Tokens
): [() => object, () => PropertyKey] {
  const [firstToken, ...remainder] = tokens;
  if (firstToken instanceof IdentifierToken) {
    const getPropertyKey = identity(firstToken.value);
    if (remainder.length === 0) return [getOwner, identity(firstToken.value)];
    else {
      const getProperty = () => getOwner()[getPropertyKey()];
      return parseAttributeName(getProperty, remainder);
    }
  } else if (firstToken instanceof DotToken) {
    return parseAttributeName(getOwner, remainder);
  } else if (firstToken instanceof SquareBracketToken) {
    const rightBracketIndex = shallowFindIndex(
      tokens,
      (token) => token instanceof SquareBracketToken && token.value === "]"
    );
    const getPropertyKey = parseExpression(
      getOwner,
      tokens.slice(1, rightBracketIndex)
    ) as () => PropertyKey;
    if (rightBracketIndex === tokens.length - 1)
      return [getOwner, getPropertyKey];
    else
      return parseAttributeName(
        () => getOwner()[getPropertyKey()],
        tokens.slice(rightBracketIndex + 1)
      );
  }
  throw new Error(
    `Attribute names must start with the name of a property, but this name starts with ${firstToken.value}`
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
