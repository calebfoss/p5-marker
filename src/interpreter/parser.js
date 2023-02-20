import { tokenKind, endToken } from "./lexer.js";

const isArray = (tokens, parenthesesDepth = 0) => {
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
  tokens,
  parenthesesDepth = 0,
  squareBracketDepth = 0,
  curlyBracketDepth = 0,
  sections = [[]]
) => {
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

const hasColonOutsideTernaryAndParentheses = (tokens) => {
  const sections = commaSeparateSections(tokens);
  for (const section of sections) {
    const colonIndex = section.findIndex((token) => token.kind === ":");
    if (colonIndex === -1) continue;
    const questionIndex = section.findIndex((token) => token.kind === "?");
    if (questionIndex === -1 || colonIndex < questionIndex) return true;
  }
  return false;
};

const getRightParenthesisIndex = (tokens, index = 0, depth = 0) => {
  const [token, ...remainder] = tokens;
  if (token.kind === "(")
    return getRightParenthesisIndex(remainder, index + 1, depth + 1);
  if (token.kind !== ")")
    return getRightParenthesisIndex(remainder, index + 1, depth);
  if (depth === 0) return index;
  return getRightParenthesisIndex(remainder, index + 1, depth - 1);
};

export const parse = (element, attrName, fullListOfTokens, debug = false) => {
  const parentheses = (tokensAfterLeftParenthesis) => {
    const rightParenthesisIndex = getRightParenthesisIndex(
      tokensAfterLeftParenthesis
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
    const getInnerValue = parseAndAutoEnclose(tokensBetweenParentheses);
    const tokensAfterParentheses = tokensAfterLeftParenthesis.slice(
      rightParenthesisIndex + 1
    );
    return [getInnerValue, tokensAfterParentheses];
  };

  const objectLiteral = (tokensBetweenBrackets) => {
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
      const getValue = parseAndAutoEnclose(sectionTokens.slice(colonIndex));
      return () => [getPropName(), getValue()];
    });
    return () => Object.fromEntries(keyValuePairs.map((fn) => fn()));
  };

  const array = (tokensBetweenBrackets) => {
    const sections = commaSeparateSections(tokensBetweenBrackets);
    const getSectionExpressions = sections.map((s) => parseExpression(s));
    const getArray = () => getSectionExpressions.map((s) => s());
    return getArray;
  };

  const getObjectWithProperty = (propertyToken) => {
    const propName = propertyToken.value;
    const obj =
      element instanceof HTMLCanvasElement ||
      attrName === "repeat" ||
      attrName === "change" ||
      propName === "above_sibling" ||
      propName === "parent" ||
      propName === "canvas" ||
      propName === "above_siblings_off"
        ? element
        : element.parentElement;
    if (propName in obj === false) {
      if (propName in element.pInst) return [() => element.pInst, propName];
      console.error(
        `On ${element.tagName}'s ${attrName}, couldn't find ${propName}`
      );
    }
    return [() => obj, propName];
  };

  const member = (getObj, getPreviousMemberName, afterPreviousMember) => {
    const [nextToken, ...remainder] = afterPreviousMember;
    if (nextToken.kind !== tokenKind.member)
      return [getObj, getPreviousMemberName, afterPreviousMember];
    return member(
      () => getObj()[getPreviousMemberName()],
      () => nextToken.value,
      remainder
    );
  };

  const computedMember = (getBaseObj, firstMemberName, afterPreviousMember) => {
    const getFirstMemberName = () => firstMemberName;
    const [getObj, getNextMemberName, afterNextMember] = member(
      getBaseObj,
      getFirstMemberName,
      afterPreviousMember
    );
    if (debug)
      console.log(
        `AFTER member, member name: ${getNextMemberName()} remaining tokens ${afterNextMember
          .map((t) => t.value)
          .join(" ")}`
      );
    const [nextToken, ...afterNext] = afterNextMember;
    if (nextToken.kind !== "[")
      return [getObj, getNextMemberName, afterNextMember];
    const rightSquareBracketIndex = afterNext.findIndex((t) => t.kind === "]");
    const tokensBetweenBrackets = afterNext.slice(0, rightSquareBracketIndex);
    const getComputedMemberName = parseExpression(tokensBetweenBrackets);
    const tokensAfterBrackets = afterNext.slice(rightSquareBracketIndex + 1);
    return member(
      () => getObj()[getNextMemberName()],
      getComputedMemberName,
      tokensAfterBrackets
    );
  };

  const call = (getBaseObj, firstMemberName, afterFirstMember) => {
    const [getObj, getLastMemberName, afterLastMember] = computedMember(
      getBaseObj,
      firstMemberName,
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
    const rightParenthesisIndex = getRightParenthesisIndex(afterNextToken);
    afterNextToken.findIndex((t) => t.kind === ")");
    const getArguments = array(afterNextToken.slice(0, rightParenthesisIndex));
    const tokensAfterParentheses = afterNextToken.slice(
      rightParenthesisIndex + 1
    );
    return [
      () => getObj()[getLastMemberName()](...getArguments()),
      tokensAfterParentheses,
    ];
  };

  const property = (propertyToken, remainder) => {
    const [getObj, memberName] = getObjectWithProperty(propertyToken);
    if (debug)
      console.log(
        `AFTER getObjectWithProperty propName: ${memberName} remaining tokens: ${remainder
          .map((t) => t.value)
          .join(" ")}`
      );
    return call(getObj, memberName, remainder);
  };

  const primary = (tokens) => {
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
        const rightSquareBracketIndex = remainder.findIndex(
          (t) => t.kind === "]"
        );
        if (rightSquareBracketIndex < 0)
          console.error(
            `On ${element.tagName}'s ${attrName}, found a [ left square bracket without matching right square bracket]`
          );
        return [
          array(remainder.slice(0, rightSquareBracketIndex)),
          remainder.slice(rightSquareBracketIndex + 1),
        ];
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

  const multiplicative = (tokens) => {
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

  const additive = (tokens) => {
    const [left, afterLeft] = multiplicative(tokens);
    if (debug)
      console.log("AFTER MULT LEFT", afterLeft.map((t) => t.value).join(" "));
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.additive) return [left, afterLeft];
    const [right, remainder] = additive(rightTokens);
    if (operator.value === "+") return [() => left() + right(), remainder];
    return [() => left() - right(), remainder];
  };

  const comparison = (tokens) => {
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

  const equality = (tokens) => {
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

  const logical = (tokens) => {
    const [left, afterLeft] = equality(tokens);
    if (debug)
      console.log("AFTER EQUALITY", afterLeft.map((t) => t.value).join(" "));
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.logical) return [left, afterLeft];
    const [right, remainder] = logical(rightTokens);
    if (operator.value === "and") return [() => left() && right(), remainder];
    return [() => left() || right(), remainder];
  };

  const ternary = (tokens) => {
    const [left, afterLeft] = logical(tokens);
    if (debug)
      console.log("AFTER LOGICAL", afterLeft.map((t) => t.value).join(" "));
    const [nextToken, ...afterNextToken] = afterLeft;
    if (nextToken.kind !== "?") return [left, afterLeft];
    const colonIndex = afterNextToken.findIndex((token) => token.kind === ":");
    const middle = parseAndAutoEnclose(afterNextToken.slice(0, colonIndex));
    const [right, afterRight] = ternary(afterNextToken.slice(colonIndex + 1));
    return [() => (left() ? middle() : right()), afterRight];
  };

  const end = (tokens) => {
    if (tokens[0].kind === tokenKind.end) return () => {};
    const [getExpression, afterExpression] = ternary(tokens);
    if (
      afterExpression.length === 0 ||
      (afterExpression.length === 1 &&
        afterExpression[0].kind !== tokenKind.end)
    )
      console.error(
        `On ${element.tagName}'s ${attrName}, reached end of expression without an end token`
      );
    else if (afterExpression.length > 1)
      console.error(
        `On ${
          element.tagName
        }'s ${attrName}, reached end of expression and found remaining tokens: ${afterExpression
          .map((t) => t.value)
          .join(" ")}`
      );
    return getExpression;
  };
  const parseExpression = (tokens) => {
    if (debug)
      console.log(
        `%cParsing ${tokens.map((t) => t.value).join(" ")}`,
        "background: yellow; color: black; padding: 10px;"
      );
    return end(tokens.concat(endToken));
  };
  const parseAndAutoEnclose = (tokens) => {
    if (debug)
      console.log(
        `%cAuto enclosing ${tokens.map((t) => t.value).join(" ")}`,
        "background: lightblue; color: black; padding: 10px;"
      );
    if (hasColonOutsideTernaryAndParentheses(tokens))
      return objectLiteral(tokens);
    if (isArray(tokens)) return array(tokens);
    return parseExpression(tokens);
  };
  return parseAndAutoEnclose(fullListOfTokens);
};
