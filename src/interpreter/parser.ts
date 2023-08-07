import { Base } from "../elements/base";
import {
  AdditiveOperator,
  AdditiveToken,
  BooleanToken,
  ColonToken,
  CommaToken,
  ComparisonOperator,
  ComparisonToken,
  CurlyBracketToken,
  DegreeToken,
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

function obj() {}

function objectLiteral<O extends object>(
  getOwner: () => O,
  tokensBetweenBrackets: Tokens
) {
  const sections = commaSeparatedSections(tokensBetweenBrackets);
  const getKeyValuePairs = sections.map((section) => {
    const [colonIndex] = findTokenOfClass(section, ColonToken);
    const getPropertyName = (() => {
      const tokensBeforeColon = section.slice(0, colonIndex);
      if (tokensBeforeColon.length === 0)
        throw new Error("Found ':' without preceding property key");
      if (tokensBeforeColon.length === 1) {
        const [keyToken] = tokensBeforeColon;
        if (!(keyToken instanceof IdentifierToken))
          throw new Error(`Unexpected token: ${keyToken.value}`);
        return identity(keyToken.value);
      }
      const [firstToken] = section;
      const tokenBeforeColon = section[colonIndex - 1];
      if (
        !(firstToken instanceof SquareBracketToken && firstToken.value === "[")
      )
        throw new Error(`Unexpected token: ${firstToken.value}`);
      if (
        !(
          tokenBeforeColon instanceof SquareBracketToken &&
          tokenBeforeColon.value === "]"
        )
      )
        throw new Error(`Unexpected token: ${tokenBeforeColon.value}`);
      return parseExpression(getOwner, section.slice(1, colonIndex));
    })();
    const getValue = parseExpression(getOwner, section.slice(colonIndex + 1));
    return [getPropertyName, getValue];
  });
  return () =>
    Object.fromEntries(
      getKeyValuePairs.map(([getKey, getValue]) => [getKey(), getValue()])
    );
}

function array<O extends object>(
  getOwner: () => O,
  tokensBetweenBrackets: Tokens
) {
  const sections = commaSeparatedSections(tokensBetweenBrackets);
  const expressions = sections.map((section) =>
    parseExpression(getOwner, section)
  );
  return () => expressions.map((expression) => expression());
}

function value<O extends object>(
  getOwner: () => O,
  tokens: Tokens,
  leftBracketIndex: number,
  rightBracketIndex: number
) {
  //  Array
  if (leftBracketIndex === 0) {
    if (rightBracketIndex < tokens.length - 1)
      throw new Error(
        `Unexpected tokens: ${tokens
          .slice(rightBracketIndex + 1)
          .map((t) => t.value)
          .join(" ")}`
      );
    const getArray = array(
      getOwner,
      tokens.slice(leftBracketIndex + 1, rightBracketIndex)
    );
    return parseExpression(getArray, tokens.slice(rightBracketIndex + 1));
  }

  //  Object literal
  const leftCurlyBracketIndex = shallowFindIndex(
    tokens,
    (token) => token instanceof CurlyBracketToken && token.value === "{"
  );
  if (leftCurlyBracketIndex > -1) {
    const rightCurlyBracketIndex = shallowFindIndex(
      tokens,
      (token) => token instanceof CurlyBracketToken && token.value === "}",
      false
    );
    if (rightCurlyBracketIndex === -1)
      throw new Error("Found '{' without matching '}'");
    if (rightCurlyBracketIndex < leftCurlyBracketIndex)
      throw new Error("Found '}' before '{'");
    if (rightCurlyBracketIndex < tokens.length - 1)
      throw new Error(
        `Found unexpected tokens: ${tokens.map((t) => t.value).join(" ")}`
      );
    return objectLiteral(
      getOwner,
      tokens.slice(leftCurlyBracketIndex + 1, rightCurlyBracketIndex)
    );
  }

  const [token, ...remainder] = tokens;
  if (remainder.length)
    throw new Error(
      `Unexpected token(s): ${remainder.map((t) => t.value).join(" ")}`
    );

  //  Literal - boolean, number, or string
  if (token instanceof LiteralToken) return identity(token.value);

  //  Property
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

function fnCall<L extends Function, R extends any[]>(
  getFunction: () => L,
  getArguments: () => R
) {
  return () => getFunction()(...getArguments());
}

function commaSeparatedSections(tokens: Tokens) {
  const sections: Token[][] = [[]];
  for (const token of tokens) {
    if (token instanceof CommaToken) sections.push([]);
    else sections[sections.length - 1].push(token);
  }
  return sections;
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
  let curlyBracketDepth = 0;
  const wrappedCallback = (token: Token) => {
    const zeroDepthBefore =
      parenthesisDepth === 0 &&
      squareBracketDepth === 0 &&
      curlyBracketDepth === 0;
    if (token instanceof PunctuatorToken)
      switch (token.value) {
        case "(":
          parenthesisDepth++;
          break;
        case "[":
          squareBracketDepth++;
          break;
        case "{":
          curlyBracketDepth++;
          break;
        case ")":
          parenthesisDepth--;
          break;
        case "]":
          squareBracketDepth--;
          break;
        case "}":
          curlyBracketDepth--;
          break;
      }
    if (zeroDepthBefore || (parenthesisDepth === 0 && squareBracketDepth === 0))
      return callback(token);
    return false;
  };
  if (first) return tokens.findIndex(wrappedCallback);
  return tokens.findLastIndex(wrappedCallback);
}

function findTokenOfClass<C extends typeof PunctuatorToken>(
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

function parseExpression<O extends object>(
  getOwner: () => O,
  tokens: Tokens
): () => unknown {
  if (tokens.length === 0) return getOwner;

  //  2 - Conditional (ternary) operator
  const [questionIndex] = findTokenOfClass(tokens, QuestionToken);
  if (questionIndex > -1) {
    const [colonIndex] = findTokenOfClass(tokens, ColonToken, false);
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

  //  3 - Logical OR
  const orIndex = shallowFindIndex(
    tokens,
    (token) => token instanceof LogicalToken && token.value === "or"
  );
  if (orIndex > -1)
    return leftRight(getOwner, tokens, tokens[orIndex].value, orIndex, logical);

  //  4 - Logical AND
  const andIndex = shallowFindIndex(
    tokens,
    (token) => token instanceof LogicalToken && token.value === "and"
  );
  if (andIndex > -1)
    return leftRight(
      getOwner,
      tokens,
      tokens[andIndex].value,
      andIndex,
      logical
    );

  //  8 - Equality, Inequality
  const [equalityIndex, equalityToken] = findTokenOfClass(
    tokens,
    EqualityToken
  );
  if (equalityIndex > -1)
    return leftRight(
      getOwner,
      tokens,
      equalityToken.value,
      equalityIndex,
      equality
    );

  //  9 - Comparison
  const [comparisonIndex, comparisonToken] = findTokenOfClass(
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

  //  11 - Additive
  const [additiveIndex, additiveToken] = findTokenOfClass(
    tokens,
    AdditiveToken
  );
  if (additiveIndex > -1)
    return leftRight(
      getOwner,
      tokens,
      additiveToken.value,
      additiveIndex,
      additive
    );

  //  12 - Multiplicative
  const [multiplicativeIndex, multiplicativeToken] = findTokenOfClass(
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

  //  14 - Logical NOT
  const [notIndex] = findTokenOfClass(tokens, NotToken);
  if (notIndex === 0)
    return not(parseExpression(getOwner, tokens.slice(notIndex + 1)));
  if (notIndex > 0)
    throw new Error("Found 'not' operator in the middle of an expression.");

  const leftParenthesisIndex = shallowFindIndex(
    tokens,
    (token) => token.value === "("
  );
  const rightParenthesisIndex = shallowFindIndex(
    tokens,
    (token) => token.value === ")"
  );
  if (leftParenthesisIndex > -1) {
    if (rightParenthesisIndex === -1)
      throw new Error("Found '(' without matching ')'");
    if (rightParenthesisIndex < leftParenthesisIndex)
      throw new Error("Found ')' before '('");
  }

  //  17.1 - Function call
  const [degreeIndex] = findTokenOfClass(tokens, DegreeToken);
  if (degreeIndex > -1) {
    const getArgument = parseExpression(getOwner, tokens.slice(0, degreeIndex));
    return () => (Math.PI / 180) * (getArgument() as number);
  }
  if (leftParenthesisIndex > 0) {
    const getFn = parseExpression(
      getOwner,
      tokens.slice(0, leftParenthesisIndex)
    );
    const getArgs = array(
      getOwner,
      tokens.slice(leftParenthesisIndex + 1, rightParenthesisIndex)
    );
    return parseExpression(
      fnCall(getFn as () => Function, getArgs),
      tokens.slice(rightParenthesisIndex + 1)
    );
  }

  const leftBracketIndex = shallowFindIndex(
    tokens,
    (token) => token.value === "["
  );
  const rightBracketIndex = shallowFindIndex(
    tokens,
    (token) => token.value === "]"
  );
  if (leftBracketIndex > -1) {
    if (rightBracketIndex === -1)
      throw new Error("Found '[' without matching ']'");
    if (rightBracketIndex < leftBracketIndex)
      throw new Error("Found ']' before '['");
  }

  //  17.2 - Computed member access
  if (leftBracketIndex > 0) {
    const getObject = parseExpression(
      getOwner,
      tokens.slice(0, leftBracketIndex)
    ) as () => object;
    const getPropertyKey = parseExpression(
      getOwner,
      tokens.slice(leftBracketIndex + 1, rightBracketIndex)
    ) as () => PropertyKey;
    const getProperty = () => getObject()[getPropertyKey()];
    return parseExpression(getProperty, tokens.slice(rightBracketIndex + 1));
  }

  //  17.3 - Member access
  const [dotIndex] = findTokenOfClass(tokens, DotToken);
  if (dotIndex > -1) {
    const getObject = parseExpression(
      getOwner,
      tokens.slice(0, dotIndex)
    ) as () => object;
    const identifierToken = tokens[dotIndex + 1];
    if (!(identifierToken instanceof IdentifierToken))
      throw new Error(
        `Found unexpected token after '.': ${identifierToken.value}`
      );
    const propertyKey = identifierToken.value;
    const getProperty = () => getObject()[propertyKey];
    return parseExpression(getProperty, tokens.slice(dotIndex + 2));
  }

  //  18  - Grouping
  if (leftParenthesisIndex === 0) {
    if (rightParenthesisIndex < tokens.length - 1)
      throw new Error(
        `Found unexpected tokens: ${tokens
          .slice(rightParenthesisIndex + 1)
          .map((t) => t.value)
          .join(" ")}`
      );
    return parseExpression(
      getOwner,
      tokens.slice(leftParenthesisIndex + 1, rightParenthesisIndex)
    );
  }

  return value(getOwner, tokens, leftBracketIndex, rightBracketIndex);
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
