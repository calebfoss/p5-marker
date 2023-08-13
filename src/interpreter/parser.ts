import { MarkerElement } from "../elements/base";
import {
  AdditiveOperator,
  AdditiveToken,
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
  PunctuatorToken,
  QuestionToken,
  SquareBracketToken,
  Token,
} from "./tokens";

type Tokens = Token[];

function getProperty<O extends object>(owner: O, propertyKey: PropertyKey) {
  if (propertyKey in owner) {
    if (typeof owner[propertyKey] === "function")
      return owner[propertyKey].bind(owner);
    return owner[propertyKey];
  }
  if (propertyKey in MarkerElement) return MarkerElement[propertyKey];
  if (
    owner instanceof MarkerElement &&
    owner.parentElement instanceof MarkerElement
  )
    return getProperty(owner.parentElement, propertyKey);
  throw new Error(`Couldn't find ${propertyKey.toString()}`);
}

function objectLiteral(
  tokensBetweenBrackets: Tokens,
  parse: (tokens: Tokens) => ReturnType<typeof parseExpression>
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
      return parse(section.slice(1, colonIndex));
    })();
    const getValue = parse(section.slice(colonIndex + 1));
    return [getPropertyName, getValue];
  });
  return () =>
    Object.fromEntries(
      getKeyValuePairs.map(([getKey, getValue]) => [getKey(), getValue()])
    );
}

function array(
  tokensBetweenBrackets: Tokens,
  parse: (tokens: Tokens) => ReturnType<typeof parseExpression>
) {
  const sections = commaSeparatedSections(tokensBetweenBrackets);
  if (sections.length === 1 && sections[0].length === 0) return identity([]);
  const expressions = sections.map((section) => {
    if (section.length === 0)
      throw new Error("Found array element with missing value");
    return parse(section);
  });
  return () => expressions.map((expression) => expression());
}

function value<O extends object>(
  getOwner: () => O,
  tokens: Tokens,
  leftBracketIndex: number,
  rightBracketIndex: number,
  depth: number
) {
  const parseAtCurrentDepth = (tokens: Tokens) =>
    parseExpression(getOwner, tokens, depth);
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
      tokens.slice(leftBracketIndex + 1, rightBracketIndex),
      parseAtCurrentDepth
    );
    return parseExpression(
      getArray,
      tokens.slice(rightBracketIndex + 1),
      depth + 1
    );
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
      tokens.slice(leftCurlyBracketIndex + 1, rightCurlyBracketIndex),
      parseAtCurrentDepth
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
    return () => getProperty(getOwner(), propertyName);
  }
  throw new Error(`Unexpected token: ${token.value}`);
}

function fnCall<L extends Function, R extends any[]>(
  getFunction: () => L,
  getArguments: () => R
) {
  return () => getFunction()(...getArguments());
}

function commaSeparatedSections(tokens: Tokens, sections: Token[][] = []) {
  const [commaIndex] = findTokenOfClass(tokens, CommaToken);
  if (commaIndex === -1) return sections.concat([tokens]);
  return commaSeparatedSections(
    tokens.slice(commaIndex + 1),
    sections.concat([tokens.slice(0, commaIndex)])
  );
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

function leftRight<V, Op>(
  tokens: Tokens,
  operator: Op,
  operatorIndex: number,
  parse: (tokens: Tokens) => ReturnType<typeof parseExpression>,
  expressionFunction: <L, R>(
    getLeft: () => L,
    operator: Op,
    getRight: () => R
  ) => () => V
) {
  const getLeft = parse(tokens.slice(0, operatorIndex));
  const getRight = parse(tokens.slice(operatorIndex + 1));
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
  tokens: Tokens,
  depth: number
): () => unknown {
  if (tokens.length === 0) return getOwner;
  const parseAtCurrentDepth = (tokens: Tokens) =>
    parseExpression(getOwner, tokens, depth);

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
    const getLeft = parseExpression(
      getOwner,
      tokens.slice(0, questionIndex),
      depth
    );
    const getCenter = parseExpression(
      getOwner,
      tokens.slice(questionIndex + 1, colonIndex),
      depth
    );
    const getRight = parseExpression(
      getOwner,
      tokens.slice(colonIndex + 1),
      depth
    );
    return ternary(getLeft, getCenter, getRight);
  }

  //  3 - Logical OR
  const orIndex = shallowFindIndex(
    tokens,
    (token) => token instanceof LogicalToken && token.value === "or"
  );
  if (orIndex > -1)
    return leftRight(
      tokens,
      tokens[orIndex].value,
      orIndex,
      parseAtCurrentDepth,
      logical
    );

  //  4 - Logical AND
  const andIndex = shallowFindIndex(
    tokens,
    (token) => token instanceof LogicalToken && token.value === "and"
  );
  if (andIndex > -1)
    return leftRight(
      tokens,
      tokens[andIndex].value,
      andIndex,
      parseAtCurrentDepth,
      logical
    );

  //  8 - Equality, Inequality
  const [equalityIndex, equalityToken] = findTokenOfClass(
    tokens,
    EqualityToken
  );
  if (equalityIndex > -1)
    return leftRight(
      tokens,
      equalityToken.value,
      equalityIndex,
      parseAtCurrentDepth,
      equality
    );

  //  9 - Comparison
  const [comparisonIndex, comparisonToken] = findTokenOfClass(
    tokens,
    ComparisonToken
  );
  if (comparisonIndex > -1)
    return leftRight(
      tokens,
      comparisonToken.value,
      comparisonIndex,
      parseAtCurrentDepth,
      comparison
    );

  //  11 - Additive
  const [additiveIndex, additiveToken] = findTokenOfClass(
    tokens,
    AdditiveToken
  );
  if (additiveIndex > -1) {
    if (additiveIndex === 0)
      return additive(
        identity(0),
        additiveToken.value,
        parseAtCurrentDepth(tokens.slice(additiveIndex + 1))
      );
    return leftRight(
      tokens,
      additiveToken.value,
      additiveIndex,
      parseAtCurrentDepth,
      additive
    );
  }

  //  12 - Multiplicative
  const [multiplicativeIndex, multiplicativeToken] = findTokenOfClass(
    tokens,
    MultiplicativeToken
  );
  if (multiplicativeIndex > -1)
    return leftRight(
      tokens,
      multiplicativeToken.value,
      multiplicativeIndex,
      parseAtCurrentDepth,
      multiplicative
    );

  // exponential would go here

  //  14 - Logical NOT
  const [notIndex] = findTokenOfClass(tokens, NotToken);
  if (notIndex === 0)
    return not(parseExpression(getOwner, tokens.slice(notIndex + 1), depth));
  if (notIndex > 0)
    throw new Error("Found 'not' operator in the middle of an expression.");

  const leftParenthesisIndex = shallowFindIndex(
    tokens,
    (token) => token.value === "("
  );
  const rightParenthesisIndex = shallowFindIndex(
    tokens,
    (token) => token.value === ")",
    false
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
    const getArgument = parseAtCurrentDepth(tokens.slice(0, degreeIndex));
    return () => (Math.PI / 180) * (getArgument() as number);
  }
  if (leftParenthesisIndex > 0) {
    const getFn = parseAtCurrentDepth(
      tokens.slice(0, leftParenthesisIndex)
    ) as () => Function;
    const getArgs = array(
      tokens.slice(leftParenthesisIndex + 1, rightParenthesisIndex),
      parseAtCurrentDepth
    );
    const getReturnValue = fnCall(getFn as () => Function, getArgs);
    return parseExpression(
      getReturnValue,
      tokens.slice(rightParenthesisIndex + 1),
      depth + 1
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
  if (leftBracketIndex > 0 || (leftBracketIndex === 0 && depth > 0)) {
    const getObject =
      leftBracketIndex === 0
        ? getOwner
        : (parseAtCurrentDepth(
            tokens.slice(0, leftBracketIndex)
          ) as () => object);
    const getPropertyKey = parseAtCurrentDepth(
      tokens.slice(leftBracketIndex + 1, rightBracketIndex)
    ) as () => PropertyKey;
    const getProp = () => {
      const obj = getObject();
      const propertyKey = getPropertyKey();
      return getProperty(obj, propertyKey);
    };
    return parseExpression(
      getProp,
      tokens.slice(rightBracketIndex + 1),
      depth + 1
    );
  }

  //  17.3 - Member access
  const [dotIndex] = findTokenOfClass(tokens, DotToken);
  if (dotIndex > -1) {
    const getObject = parseAtCurrentDepth(
      tokens.slice(0, dotIndex)
    ) as () => object;
    const identifierToken = tokens[dotIndex + 1];
    if (!(identifierToken instanceof IdentifierToken))
      throw new Error(
        `Found unexpected token after '.': ${identifierToken.value}`
      );
    const propertyKey = identifierToken.value;
    const getProp = () => {
      const obj = getObject();
      return getProperty(obj, propertyKey);
    };
    return parseExpression(getProp, tokens.slice(dotIndex + 2), depth + 1);
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
    return parseAtCurrentDepth(
      tokens.slice(leftParenthesisIndex + 1, rightParenthesisIndex)
    );
  }

  return value(getOwner, tokens, leftBracketIndex, rightBracketIndex, depth);
}

function parseAttributeName(
  assignTo: object,
  getValuesFrom: object,
  tokens: Tokens
): [() => object, () => PropertyKey] {
  const [lastToken] = tokens.slice(-1);
  if (lastToken instanceof IdentifierToken) {
    const previousTokens = tokens.slice(0, -1);
    const getPropertyKey = () => lastToken.value;
    if (previousTokens.length === 0)
      return [identity(assignTo), getPropertyKey];
    const [secondToLastToken] = previousTokens.slice(-1);
    if (!(secondToLastToken instanceof DotToken))
      throw new Error(`Unexpected token ${secondToLastToken.value}`);
    const getPropertyOwner = parseExpression(
      identity(assignTo),
      previousTokens.slice(0, -1),
      0
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
      const getPropertyKey = parseExpression(
        identity(getValuesFrom),
        tokens.slice(1, -1),
        0
      );
      return [identity(assignTo), getPropertyKey as () => PropertyKey];
    }
    const getPropertyOwner = parseExpression(
      identity(assignTo),
      tokens.slice(0, leftBracketIndex),
      0
    ) as () => object;
    const getPropertyKey = parseExpression(
      identity(getValuesFrom),
      tokens.slice(leftBracketIndex + 1, -1),
      0
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
  assignTo: object,
  getValuesFrom: object
): [() => object, () => PropertyKey, () => any] {
  const [getOwner, getPropertyKey] = parseAttributeName(
    assignTo,
    getValuesFrom,
    nameTokens
  );
  const getValue = parseExpression(identity(getValuesFrom), valueTokens, 0);
  return [getOwner, getPropertyKey, getValue];
}
