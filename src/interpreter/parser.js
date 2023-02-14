import { tokenKind, endToken } from "./lexer.js";

const commaSeparateSections = (
  tokens,
  parenthesesDepth = 0,
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
        sectionsConcatenated
      );
    case ")":
      return commaSeparateSections(
        remainder,
        parenthesesDepth - 1,
        sectionsConcatenated
      );
    case ",":
      if (parenthesesDepth === 0)
        return commaSeparateSections(
          remainder,
          parenthesesDepth,
          sections.concat([[]])
        );
    default:
      return commaSeparateSections(
        remainder,
        parenthesesDepth,
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

export const parse = (element, attrName, fullListOfTokens, debug = false) => {
  const parentheses = (tokensAfterLeftParenthesis) => {
    const getRightParenthesisIndex = (tks, index = 0, depth = 0) => {
      const [t, ...r] = tks;
      if (t.kind === "(")
        return getRightParenthesisIndex(r, index + 1, depth + 1);
      if (t.kind !== ")") return getRightParenthesisIndex(r, index + 1, depth);
      if (depth === 0) return index;
      return getRightParenthesisIndex(r, index + 1, depth - 1);
    };
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
    const getInnerValue = parseExpression(tokensBetweenParentheses);
    const tokensAfterParentheses = tokensAfterLeftParenthesis.slice(
      rightParenthesisIndex + 1
    );
    return [getInnerValue, tokensAfterParentheses];
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

  const property = (propertyToken, tokensAfterProperty) => {
    const [getBaseObj, propName] = getObjectWithProperty(propertyToken);
    if (debug)
      console.log(
        `AFTER getObjectWithProperty propName: ${propName} remaining tokens: ${tokensAfterProperty
          .map((t) => t.value)
          .join(" ")}`
      );
    return [getBaseObj, propName, tokensAfterProperty];
  };

  const member = (propertyToken, tokensAfterProperty) => {
    const [getBaseObj, firstMember, tokensAfterFirstMember] = property(
      propertyToken,
      tokensAfterProperty
    );
    if (debug)
      console.log(
        `AFTER property, first member: ${firstMember} remainder: ${tokensAfterProperty
          .map((t) => t.value)
          .join(" ")}`
      );
    const getObjFromMemberChain = (
      getObj,
      lastMemberName,
      tokensAfterLastMember
    ) => {
      const [nextToken, ...remainder] = tokensAfterLastMember;
      if (nextToken.kind !== tokenKind.member)
        return [getObj, lastMemberName, tokensAfterLastMember];
      const getObjWithLastMember = () => getObj()[lastMemberName];
      const nextMember = nextToken.value;
      return getObjFromMemberChain(getObjWithLastMember, nextMember, remainder);
    };
    return getObjFromMemberChain(
      getBaseObj,
      firstMember,
      tokensAfterFirstMember
    );
  };

  const call = (propertyToken, tokensAfterProperty) => {
    const [getObj, memberName, afterMember] = member(
      propertyToken,
      tokensAfterProperty
    );
    const [nextToken, ...afterNextToken] = afterMember;
    if (debug)
      console.log(
        `AFTER member, member name: ${memberName} remaining tokens ${afterMember
          .map((t) => t.value)
          .join(" ")}`
      );
    if (nextToken.kind !== "(")
      return [() => getObj()[memberName], afterMember];
    const [getInnerParentheses, tokensAfterParentheses] =
      parentheses(afterNextToken);
    return [
      () => {
        const isFunction = typeof getObj()[memberName] === "function";
        const innerParentheses = getInnerParentheses();
        const args = Array.isArray(innerParentheses)
          ? innerParentheses
          : [innerParentheses];
        if (isFunction) return getObj()[memberName](...args);
        return args.reduce((p, arg) => p[arg], getObj()[memberName]);
      },
      tokensAfterParentheses,
    ];
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
      case tokenKind.until:
        const [rightOfNot, afterRightOfNot] = objectLiteral(remainder);
        return [() => !rightOfNot(), afterRightOfNot];
      case tokenKind.property:
        return call(token, remainder);
      case "(":
        return parentheses(remainder);
      default:
        console.error(
          `Parser failed on ${tokens.map((t) => t.value).join(" ")}`
        );
        return [() => undefined, remainder];
    }
  };

  const not = (tokens) => {
    if (tokens[0].kind !== tokenKind.not) return primary(tokens);
    const afterNot = tokens.slice(1);
    if (debug)
      console.log("AFTER PRIMARY", afterNot.map((t) => t.value).join(" "));
    const [right, remainder] = primary(afterNot);
    return [() => !right(), remainder];
  };

  const multiplicative = (tokens) => {
    const [left, afterLeft] = not(tokens);
    if (debug)
      console.log("AFTER NOT", afterLeft.map((t) => t.value).join(" "));
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.multiplicative) return [left, afterLeft];
    const [right, remainder] = not(rightTokens);
    if (operator.value === "*") return [() => left() * right(), remainder];
    return [() => left() / right(), remainder];
  };

  const additive = (tokens) => {
    const [firstToken] = tokens;
    const [left, afterLeft] =
      firstToken.kind === tokenKind.additive && firstToken.value === "-"
        ? [() => 0, tokens]
        : multiplicative(tokens);
    if (debug)
      console.log("AFTER MULT LEFT", afterLeft.map((t) => t.value).join(" "));
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.additive) return [left, afterLeft];
    const [right, remainder] = multiplicative(rightTokens);
    if (operator.value === "+") return [() => left() + right(), remainder];
    return [() => left() - right(), remainder];
  };

  const comparison = (tokens) => {
    const [left, afterLeft] = additive(tokens);
    if (debug)
      console.log("AFTER ADDITIVE", afterLeft.map((t) => t.value).join(" "));
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.comparison) return [left, afterLeft];
    const [right, remainder] = additive(rightTokens);
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
    const [right, remainder] = comparison(rightTokens);
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
    const [right, remainder] = equality(rightTokens);
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
    const middle = parseExpression(afterNextToken.slice(0, colonIndex));
    const [right, afterRight] = ternary(afterNextToken.slice(colonIndex + 1));
    return [() => (left() ? middle() : right()), afterRight];
  };

  const list = (tokens, beforeLeftExpressions = []) => {
    const [left, afterLeft] = ternary(tokens);
    if (debug)
      console.log(
        "AFTER TERNARY LEFT",
        afterLeft.map((t) => t.value).join(" ")
      );
    const [nextToken, ...afterNextToken] = afterLeft;
    if (nextToken.kind === ",")
      return list(afterNextToken, beforeLeftExpressions.concat(left));
    if (beforeLeftExpressions.length === 0) return [left, afterLeft];
    const allExpressions = beforeLeftExpressions.concat(left);
    return [() => allExpressions.map((exp) => exp()), afterLeft];
  };

  const objectLiteral = (tokens) => {
    if (hasColonOutsideTernaryAndParentheses(tokens) === false)
      return list(tokens);
    console.log("OBJECT LITERAL");
    const beforeEnd = tokens.slice(0, -1);
    const remainder = tokens.slice(-1);
    if (remainder[0].kind !== tokenKind.end)
      console.error(
        `On ${element.tagName}'s ${attrName}, found a token at the end that is not an end token`,
        end
      );
    const sections = commaSeparateSections(beforeEnd);
    const getKeyValuePairs = sections.map((sectionTokens, i) => {
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
    return [
      () => Object.fromEntries(getKeyValuePairs.map((fn) => fn())),
      remainder,
    ];
  };

  const end = (tokens) => {
    const [left, afterLeft] = objectLiteral(tokens);
    if (
      afterLeft.length === 0 ||
      (afterLeft.length === 1 && afterLeft[0].kind !== tokenKind.end)
    )
      console.error(
        `On ${element.tagName}'s ${attrName}, reached end of expression without an end token`
      );
    else if (afterLeft.length > 1)
      console.error(
        `On ${
          element.tagName
        }'s ${attrName}, reached end of expression and found remaining tokens: ${afterLeft
          .map((t) => t.value)
          .join(" ")}`
      );
    return left;
  };

  const parseExpression = (tokens) => {
    if (debug)
      console.log(
        `On ${element.tagName}'s ${attrName}, parsing ${tokens
          .map((t) => t.value)
          .join(" ")}`
      );
    return end(tokens.concat(endToken));
  };
  return parseExpression(fullListOfTokens);
};
