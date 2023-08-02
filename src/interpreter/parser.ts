import { MarkerElement } from "../elements/base";
import {
  AdditiveOperator,
  IdentifierToken,
  LiteralToken,
  LogicalOperator,
  MultiplicativeOperator,
  PunctuatorCategory,
  PunctuatorToken,
  Token,
  TokenKind,
} from "./languageTypes";

type Tokens = Token[];

function member<O extends object>(
  getObject: () => O,
  getPropertyKey: () => keyof O
) {
  return () => getObject()[getPropertyKey()];
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
  operator: string,
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
  operator: string,
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

function leftRight<V>(
  element: MarkerElement,
  tokens: Tokens,
  operator: string,
  operatorIndex: number,
  expressionFunction: <L, R>(
    getLeft: () => L,
    operator: string,
    getRight: () => R
  ) => () => V
): () => V {
  const getLeft = parseExpression(element, tokens.slice(0, operatorIndex));
  const getRight = parseExpression(element, tokens.slice(operatorIndex + 1));
  return expressionFunction(getLeft, operator, getRight);
}

function shallowFindIndex(
  tokens: Tokens,
  callback: (token: Token) => boolean,
  first = true
) {
  let parenthesisDepth = 0;
  let bracketDepth = 0;
  const wrappedCallback = (token: Token) => {
    const callbackValue = callback(token);
    if (token.kind === "punctuator")
      switch ((token as PunctuatorToken<any>).value) {
        case "(":
          parenthesisDepth++;
          break;
        case ")":
          parenthesisDepth--;
          break;
        case "[":
          bracketDepth++;
          break;
        case "]":
          bracketDepth--;
          break;
      }
    if (parenthesisDepth > 0 || bracketDepth > 0) return false;
    return callbackValue;
  };
  if (first) return tokens.findIndex(wrappedCallback);
  return tokens.findLastIndex(wrappedCallback);
}

function indexOfPunctuator<C extends PunctuatorCategory>(
  tokens: Tokens,
  category: C,
  first = true
): [number, PunctuatorToken<C> | null] {
  const index = shallowFindIndex(
    tokens,
    (token) =>
      token.kind === "punctuator" &&
      (token as PunctuatorToken<any>).category === category,
    first
  );
  return [index, index > -1 ? (tokens[index] as PunctuatorToken<C>) : null];
}

function parseExpression(
  element: MarkerElement,
  tokens: Tokens,
  returnPropertyReference: true
): [() => object, () => PropertyKey];
function parseExpression(
  element: MarkerElement,
  tokens: Tokens,
  returnPropertyReference: false
): () => unknown;
function parseExpression(
  element: MarkerElement,
  tokens: Tokens,
  returnPropertyReference = false
) {
  const [questionIndex] = indexOfPunctuator(tokens, "question");
  if (questionIndex > -1) {
    const [colonIndex] = indexOfPunctuator(tokens, "colon", false);
    if (colonIndex === -1)
      throw new Error("Found ? without : to complete ternary expression.");
    if (colonIndex < questionIndex)
      throw new Error(
        "Found ? without a : following it to complete ternary expression"
      );
    const getLeft = parseExpression(element, tokens.slice(0, questionIndex));
    const getCenter = parseExpression(
      element,
      tokens.slice(questionIndex + 1, colonIndex)
    );
    const getRight = parseExpression(element, tokens.slice(colonIndex + 1));
    return ternary(getLeft, getCenter, getRight);
  }

  const [logicalIndex, logicalToken] = indexOfPunctuator(tokens, "logical");
  if (logicalIndex > -1)
    return leftRight(
      element,
      tokens,
      logicalToken.value,
      logicalIndex,
      logical
    );

  const [equalityIndex, equalityToken] = indexOfPunctuator(tokens, "equality");
  if (equalityIndex > -1)
    return leftRight(
      element,
      tokens,
      equalityToken.value,
      equalityIndex,
      equality
    );

  const [comparisonIndex, comparisonToken] = indexOfPunctuator(
    tokens,
    "comparison"
  );
  if (comparisonIndex > -1)
    return leftRight(
      element,
      tokens,
      comparisonToken.value,
      comparisonIndex,
      comparison
    );

  const [additiveIndex, additiveToken] = indexOfPunctuator(tokens, "additive");
  if (additiveIndex > -1)
    return leftRight(
      element,
      tokens,
      additiveToken.value,
      additiveIndex,
      additive
    );

  const [multiplicativeIndex, multiplicativeToken] = indexOfPunctuator(
    tokens,
    "multiplicative"
  );
  if (multiplicativeIndex > -1)
    return leftRight(
      element,
      tokens,
      multiplicativeToken.value,
      multiplicativeIndex,
      multiplicative
    );

  // exponential would go here

  const [notIndex] = indexOfPunctuator(tokens, "not");
  if (notIndex === 0)
    return not(parseExpression(element, tokens.slice(notIndex + 1)));
  if (notIndex > 0)
    throw new Error("Found 'not' operator in the middle of an expression.");

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

    //  Array
    if (leftBracketIndex === 0) {
      const commaSeparatedSections = tokens
        .slice(leftBracketIndex + 1, rightBracketIndex)
        .reduce((sections: Token[][], token) => {
          if (
            token.kind === "punctuator" &&
            (token as PunctuatorToken<any>).category === "comma"
          )
            return sections.concat([]);
          return sections
            .slice(0, -1)
            .concat(sections.slice(-1)[0].concat(token));
        }, []);
      const expressions = commaSeparatedSections.map((section) =>
        parseExpression(element, section)
      );
      return () => expressions.map((expression) => expression());
    }
    const getKey = parseExpression(
      element,
      tokens.slice(leftBracketIndex + 1, rightBracketIndex)
    ) as () => PropertyKey;
    const getObject = parseExpression(
      element,
      tokens.slice(0, leftBracketIndex)
    ) as () => { [key in ReturnType<typeof getKey>]: any };
    return member(getObject, getKey);
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
  }

  const [firstToken, ...remainder] = tokens;

  const getBase = (() => {
    switch (firstToken.kind as TokenKind) {
      case "literal": {
        return identity(firstToken.value);
      }
      case "identifier": {
        const propertyName = (firstToken as IdentifierToken).value;
        const findProperty = (element: MarkerElement) => {
          if (propertyName in element) return element[propertyName];
          if (element.parent instanceof MarkerElement)
            return findProperty(element.parent);
          throw new Error(`Couldn't find ${propertyName}`);
        };
        return () => findProperty(element);
      }
      default:
        throw new Error(`Unexpected token: ${firstToken}`);
    }
  })();
  if (remainder.length === 0) return getBase;
}

export function parseAttribute(
  element: MarkerElement,
  nameTokens: Tokens,
  valueTokens: Tokens
) {
  const evaluateName = parseExpression(element, nameTokens);
  if (!(element.parent instanceof MarkerElement))
    throw new Error("Parent isn't a marker element");
  const evaluateValue = parseExpression(element.parent, valueTokens);
  return [evaluateName, evaluateValue];
}
