import { Base, markerObject } from "../elements/base";
import { tokenKind, endToken } from "./lexer";

const isArray = (tokens: Token[], parenthesesDepth = 0) => {
  const [token, ...remainder] = tokens;
  if (typeof token === "undefined") return false;
  switch (token.kind) {
    case "(":
      return isArray(remainder, parenthesesDepth + 1);
    case ")":
      return isArray(remainder, parenthesesDepth - 1);
    case ",":
      if (parenthesesDepth === 0) return true;
    default:
      return isArray(remainder, parenthesesDepth);
  }
};

const commaSeparateSections = (
  tokens: Token[],
  parenthesesDepth = 0,
  squareBracketDepth = 0,
  curlyBracketDepth = 0,
  sections = [[]] as Token[][]
): Token[][] => {
  const [token, ...remainder] = tokens;
  if (typeof token === "undefined") return sections;
  const lastSectionIndex = sections.length - 1;
  const lastSectionConcatenated = sections[lastSectionIndex].concat(token);
  const sectionsConcatenated = [
    ...sections.slice(0, lastSectionIndex),
    lastSectionConcatenated,
  ];
  switch (token.kind) {
    case "(":
      return commaSeparateSections(
        remainder,
        parenthesesDepth + 1,
        squareBracketDepth,
        curlyBracketDepth,
        sectionsConcatenated
      );
    case ")":
      return commaSeparateSections(
        remainder,
        parenthesesDepth - 1,
        squareBracketDepth,
        curlyBracketDepth,
        sectionsConcatenated
      );
    case "[":
      return commaSeparateSections(
        remainder,
        parenthesesDepth,
        squareBracketDepth + 1,
        curlyBracketDepth,
        sectionsConcatenated
      );
    case "]":
      return commaSeparateSections(
        remainder,
        parenthesesDepth,
        squareBracketDepth - 1,
        curlyBracketDepth,
        sectionsConcatenated
      );
    case "{":
      return commaSeparateSections(
        remainder,
        parenthesesDepth,
        squareBracketDepth,
        curlyBracketDepth + 1,
        sectionsConcatenated
      );
    case "}":
      return commaSeparateSections(
        remainder,
        parenthesesDepth,
        squareBracketDepth,
        curlyBracketDepth - 1,
        sectionsConcatenated
      );
    case ",":
      if (
        parenthesesDepth === 0 &&
        squareBracketDepth === 0 &&
        curlyBracketDepth === 0
      )
        return commaSeparateSections(
          remainder,
          parenthesesDepth,
          squareBracketDepth,
          curlyBracketDepth,
          sections.concat([[]])
        );
    default:
      return commaSeparateSections(
        remainder,
        parenthesesDepth,
        squareBracketDepth,
        curlyBracketDepth,
        sectionsConcatenated
      );
  }
};

const getRightTokenIndex = (
  tokens: Token[],
  leftTokenKind: "(" | "[",
  index = 0,
  depth = 0
): number => {
  const rightTokenKind = leftTokenKind === "(" ? ")" : "]";
  const [token, ...remainder] = tokens;
  if (token.kind === leftTokenKind)
    return getRightTokenIndex(remainder, leftTokenKind, index + 1, depth + 1);
  if (token.kind !== rightTokenKind)
    return getRightTokenIndex(remainder, leftTokenKind, index + 1, depth);
  if (depth === 0) return index;
  return getRightTokenIndex(remainder, leftTokenKind, index + 1, depth - 1);
};

export function parse<T extends object>(
  element: Base,
  attrName: string,
  attrNameTokens: Token[],
  attrValTokens: Token[],
  debug?: boolean
): [
  action: InterpreterAction,
  getProperty: () => ObjectProperty<T>,
  getValue: () => T
];
export function parse<T>(
  element: Base,
  attrName: string,
  attrNameTokens: Token[],
  attrValTokens: Token[],
  debug = false
): [
  action: InterpreterAction,
  getProperty: () => Property<T>,
  getValue: () => T
] {
  const [firstNameToken, ...remainingNameTokens] = attrNameTokens;
  const action = ((): InterpreterAction => {
    switch (firstNameToken.value) {
      case "repeat":
      case "change":
      case "each":
        return firstNameToken.value;
      default:
        if (element[firstNameToken.value] instanceof Base) return "change";
        return "get";
    }
  })();

  const member = (
    getObj: () => MarkerObject<object>,
    getPreviousMemberName: () => string,
    afterPreviousMember: Token[]
  ): [() => MarkerObject<object>, () => string, Token[]] => {
    const [nextToken, ...remainder] = afterPreviousMember;
    if (nextToken.kind !== tokenKind.member)
      return [getObj, getPreviousMemberName, afterPreviousMember];
    return member(
      () => getObj()[getPreviousMemberName()],
      () => nextToken.value,
      remainder
    );
  };

  const computedMember = (
    getBaseObj: () => MarkerObject<object>,
    getBaseMember: () => string,
    afterPreviousMember: Token[]
  ): [() => MarkerObject<object>, () => string, Token[]] => {
    const [getObj, getNextMemberName, afterNextMember] = member(
      getBaseObj,
      getBaseMember,
      afterPreviousMember
    );
    const [nextToken, ...afterNext] = afterNextMember;
    if (nextToken.kind !== "[")
      return [getObj, getNextMemberName, afterNextMember];
    const rightSquareBracketIndex = getRightTokenIndex(afterNext, "[");
    const tokensBetweenBrackets = afterNext.slice(0, rightSquareBracketIndex);
    const getComputedMemberName = parseExpression(tokensBetweenBrackets);
    const tokensAfterBrackets = afterNext.slice(rightSquareBracketIndex + 1);
    return computedMember(
      () => getObj()[getNextMemberName()],
      getComputedMemberName,
      tokensAfterBrackets
    );
  };

  const parentheses = (
    tokensAfterLeftParenthesis: Token[]
  ): [() => any, Token[]] => {
    const rightParenthesisIndex = getRightTokenIndex(
      tokensAfterLeftParenthesis,
      "("
    );
    if (rightParenthesisIndex < 0) {
      console.error(
        "Found a left parenthesis ( without a matching right parenthesis )"
      );
      return [() => {}, tokensAfterLeftParenthesis];
    }
    const tokensBetweenParentheses = tokensAfterLeftParenthesis.slice(
      0,
      rightParenthesisIndex
    );
    const getInnerValue = parseExpression(tokensBetweenParentheses);
    const tokensAfterParentheses = tokensAfterLeftParenthesis.slice(
      rightParenthesisIndex + 1
    );
    return [getInnerValue, tokensAfterParentheses];
  };

  const objectLiteral = (tokensBetweenBrackets: Token[]) => {
    if (debug) console.log("OBJECT LITERAL");
    const sections = commaSeparateSections(tokensBetweenBrackets);
    const keyValuePairs = sections.map((sectionTokens, i) => {
      const colonIndex = sectionTokens.findIndex((token) => token.kind === ":");
      if (colonIndex < 0) {
        if (sectionTokens.length > 1)
          console.error(
            "Couldn't figure out what to do with these:",
            sectionTokens
          );
        const propName = sectionTokens[0].value;
        const getValue = parseExpression(sectionTokens);
        return () => [propName, getValue()];
      }
      if (colonIndex === 0) {
        console.error("FOUND COLON AT BEGINNING OF SECTION");
        return () => [];
      }
      if (colonIndex === 1) {
        const propName = sectionTokens[0].value;
        const tokensAfterColon = sectionTokens.slice(2);
        const getValue = parseExpression(tokensAfterColon);
        return () => [propName, getValue()];
      }
      const getPropName = parseExpression(sectionTokens.slice(0, colonIndex));
      const getValue = parseExpression(sectionTokens.slice(colonIndex));
      return () => [getPropName(), getValue()];
    });
    return () => Object.fromEntries(keyValuePairs.map((fn) => fn()));
  };

  const array = (tokensBetweenBrackets: Token[]) => {
    const sections = commaSeparateSections(tokensBetweenBrackets);
    const getSectionExpressions = sections.map((s) => parseExpression(s));
    const getArray = () => getSectionExpressions.map((s) => s());
    return getArray;
  };

  const call = (
    getBaseObj: () => any,
    firstMemberName: string,
    afterFirstMember: Token[]
  ): [() => any, Token[]] => {
    const [getObj, getLastMemberName, afterLastMember] = computedMember(
      getBaseObj,
      () => firstMemberName,
      afterFirstMember
    );
    if (debug)
      console.log(
        `AFTER computed member, member name: ${getLastMemberName()} remaining tokens ${afterLastMember
          .map((t) => t.value)
          .join(" ")}`
      );
    const [nextToken, ...afterNextToken] = afterLastMember;
    if (nextToken.kind !== "(")
      return [() => getObj()[getLastMemberName()], afterLastMember];
    const rightParenthesisIndex = getRightTokenIndex(afterNextToken, "(");
    const getArguments = array(afterNextToken.slice(0, rightParenthesisIndex));
    const tokensAfterParentheses = afterNextToken.slice(
      rightParenthesisIndex + 1
    );
    return [
      () => getObj()[getLastMemberName()](...getArguments()),
      tokensAfterParentheses,
    ];
  };

  const getObjectWithProperty = (
    propertyToken: Token
  ): [() => HTMLElement, string] => {
    const propertyName = propertyToken.value;
    const findAttributeInParent = (el: HTMLElement): HTMLElement => {
      if (el.parentElement === null) {
        throw new Error(
          `${element.tagName}'s ${attrName} is referencing ${propertyName}, ` +
            `but this attribute could not be found on a parent element.`
        );
      }
      if (propertyName in el.parentElement) return el.parentElement;
      return findAttributeInParent(el.parentElement);
    };
    if (action === "get")
      return [() => findAttributeInParent(element), propertyName];
    return [
      () =>
        propertyName in element ? element : findAttributeInParent(element),
      propertyName,
    ];
  };

  const property = (
    propertyToken: Token,
    remainder: Token[]
  ): [() => any, Token[]] => {
    const [getObj, memberName] = getObjectWithProperty(propertyToken);
    if (debug)
      console.log(
        `AFTER getObjectWithProperty propName: ${memberName} remaining tokens: ${remainder
          .map((t) => t.value)
          .join(" ")}`
      );
    return call(getObj, memberName, remainder);
  };

  const primary = (tokens: Token[]): [() => any, Token[]] => {
    const [token, ...remainder] = tokens;
    switch (token.kind) {
      case tokenKind.string:
      case tokenKind.constant:
        return [() => token.value, remainder];
      case tokenKind.number:
        const numberStringVal = token.value;
        return [() => Number(numberStringVal), remainder];
      case tokenKind.boolean:
        const booleanValue = token.value === "true";
        return [() => booleanValue, remainder];
      case tokenKind.not:
      case tokenKind.until:
        const rightOfNot = parseExpression(remainder.slice(0, -1));
        return [() => !rightOfNot(), remainder.slice(-1)];
      case tokenKind.property:
        return property(token, remainder);
      case "(":
        return parentheses(remainder);
      case "[":
        const rightSquareBracketIndex = getRightTokenIndex(remainder, "[");
        if (rightSquareBracketIndex < 0)
          console.error(
            `On ${element.tagName}'s ${attrName}, found a [ left square bracket without matching right square bracket]`
          );
        const getArray = array(remainder.slice(0, rightSquareBracketIndex));
        const tokensAfterArray = remainder.slice(rightSquareBracketIndex + 1);
        const [nextToken, ...afterNext] = tokensAfterArray;
        if (nextToken.kind !== "[") return [getArray, tokensAfterArray];
        const nextRightIndex = getRightTokenIndex(afterNext, "[");
        const tokensBetweenNextBrackets = afterNext.slice(0, nextRightIndex);
        const tokensAfterNextBrackets = afterNext.slice(nextRightIndex + 1);
        const [getObject, getMemberName, afterComputedMember] = computedMember(
          () => markerObject(getArray()),
          parseExpression(tokensBetweenNextBrackets),
          tokensAfterNextBrackets
        );
        return [() => getObject[getMemberName()], afterComputedMember];

      case "{":
        const rightCurlyBracketIndex = remainder.findIndex(
          (t) => t.kind === "}"
        );
        if (rightCurlyBracketIndex < 0)
          console.error(
            `On ${element.tagName}'s ${attrName}, found a { left curly bracket without matching right curly bracket}`
          );
        return [
          objectLiteral(remainder.slice(0, rightCurlyBracketIndex)),
          remainder.slice(rightCurlyBracketIndex + 1),
        ];
      case tokenKind.additive:
        return [() => 0, tokens];
      default:
        console.error(
          `Parser failed on ${tokens.map((t) => t.value).join(" ")}`
        );
        return [() => undefined, remainder];
    }
  };

  const multiplicative = (tokens: Token[]) => {
    const [left, afterLeft] = primary(tokens);
    if (debug)
      console.log("AFTER PRIMARY", afterLeft.map((t) => t.value).join(" "));
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.multiplicative) return [left, afterLeft];
    const [right, remainder] = multiplicative(rightTokens);
    if (operator.value === "*") return [() => left() * right(), remainder];
    if (operator.value === "%") return [() => left() % right(), remainder];
    return [() => left() / right(), remainder];
  };

  const additive = (tokens: Token[]) => {
    const [left, afterLeft] = multiplicative(tokens);
    if (debug)
      console.log("AFTER MULT LEFT", afterLeft.map((t) => t.value).join(" "));
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.additive) return [left, afterLeft];
    const [right, remainder] = additive(rightTokens);
    if (operator.value === "+") return [() => left() + right(), remainder];
    return [() => left() - right(), remainder];
  };

  const comparison = (tokens: Token[]) => {
    const [left, afterLeft] = additive(tokens);
    if (debug)
      console.log("AFTER ADDITIVE", afterLeft.map((t) => t.value).join(" "));
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.comparison) return [left, afterLeft];
    const [right, remainder] = comparison(rightTokens);
    const getCompareFn = () => {
      switch (operator.value) {
        case "less than":
          return () => left() < right();
        case "no more than":
          return () => left() <= right();
        case "at least":
          return () => left() >= right();
        case "greater than":
          return () => left() > right();
        default:
          console.error(
            `On ${element.tagName}'s ${attrName}, comparison token was found with value '${operator.value}', but this value could not be matched with a function.`
          );
      }
    };
    return [getCompareFn(), remainder];
  };

  const equality = (tokens: Token[]) => {
    const [left, afterLeft] = comparison(tokens);
    if (debug)
      console.log("AFTER COMPARE", afterLeft.map((t) => t.value).join(" "));
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.equality) return [left, afterLeft];
    const [right, remainder] = equality(rightTokens);
    if (operator.value === "is")
      return [() => Object.is(left(), right()), remainder];
    return [() => !Object.is(left(), right()), remainder];
  };

  const logical = (tokens: Token[]) => {
    const [left, afterLeft] = equality(tokens);
    if (debug)
      console.log("AFTER EQUALITY", afterLeft.map((t) => t.value).join(" "));
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.logical) return [left, afterLeft];
    const [right, remainder] = logical(rightTokens);
    if (operator.value === "and") return [() => left() && right(), remainder];
    return [() => left() || right(), remainder];
  };

  const ternary = (tokens: Token[]) => {
    const [left, afterLeft] = logical(tokens);
    if (debug)
      console.log("AFTER LOGICAL", afterLeft.map((t) => t.value).join(" "));
    const [nextToken, ...afterNextToken] = afterLeft;
    if (nextToken.kind !== "?") return [left, afterLeft];
    const colonIndex = afterNextToken.findIndex((token) => token.kind === ":");
    const middle = parseExpression(afterNextToken.slice(0, colonIndex));
    const [right, afterRight] = ternary(afterNextToken.slice(colonIndex + 1));
    return [() => (left() ? middle() : right()), afterRight];
  };

  const end = (tokens: Token[]) => {
    if (tokens[0].kind === tokenKind.end) return () => {};
    const [getExpression, afterExpression] = ternary(tokens);
    if (
      afterExpression.length === 0 ||
      (afterExpression.length === 1 &&
        afterExpression[0].kind !== tokenKind.end)
    )
      throw new Error(
        `On ${element.tagName}'s ${attrName}, reached end of expression without an end token`
      );
    if (afterExpression.length > 1)
      throw new Error(
        `On ${
          element.tagName
        }'s ${attrName}, reached end of expression and found remaining tokens: ${afterExpression
          .map((t) => t.value)
          .join(" ")}`
      );
    return getExpression;
  };
  const parseExpression = (tokens: Token[]): (() => any) => {
    if (debug)
      console.log(
        `%cParsing ${tokens.map((t) => t.value).join(" ")}`,
        "background: yellow; color: black; padding: 10px;"
      );
    return end(tokens.concat(endToken));
  };

  const getValue = parseExpression(attrValTokens);

  const [baseMember, remainder] = (() => {
    switch (action) {
      case "change": {
        const [nextToken, ...remainder] =
          firstNameToken.value === "change"
            ? remainingNameTokens
            : attrNameTokens;
        return [nextToken.value, remainder];
      }
      case "each": {
        const [nextToken, ...remainder] = remainingNameTokens;
        return [nextToken.value, remainder];
      }
      default:
        return [firstNameToken.value, remainingNameTokens];
    }
  })();
  const [getOwner, getMemberName, afterComputedMember] = computedMember(
    () => element,
    () => baseMember,
    remainder.concat(endToken)
  );
  if (afterComputedMember.length > 1)
    throw new Error(
      `Failed to parse ${element.tagName}'s ${attrName} at ${afterComputedMember
        .map((t) => t.value)
        .join()}`
    );
  return [action, () => getOwner().propertyManager[getMemberName()], getValue];
}
