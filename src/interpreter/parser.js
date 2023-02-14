import { tokenKind } from "./lexer.js";

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
  const objectLiteral = (tokens) => {
    const sections = commaSeparateSections(tokens);
    const getKeyValuePairs = sections.map((sectionTokens, i) => {
      const colonIndex = sectionTokens.findIndex((token) => token.kind === ":");
      if (colonIndex < 0) {
        if (sectionTokens.length > 1)
          console.error(
            "Couldn't figure out what to do with these:",
            sectionTokens
          );
        const propName = sectionTokens[0].value;

        const getValue = parseTokens(sectionTokens);
        return () => [propName, getValue()];
      }
      if (colonIndex === 0) {
        console.error("FOUND COLON AT BEGINNING OF SECTION");
        return () => [];
      }
      if (colonIndex === 1) {
        const propName = sectionTokens[0].value;
        const tokensAfterColon = sectionTokens.slice(2);
        const getValue = parseTokens(tokensAfterColon);
        return () => [propName, getValue()];
      }

      const getPropName = parseTokens(sectionTokens.slice(0, colonIndex));

      const getValue = parseTokens(sectionTokens.slice(colonIndex));

      return () => [getPropName(), getValue()];
    });
    return () => Object.fromEntries(getKeyValuePairs.map((fn) => fn()));
  };

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
    const getInnerValue = parseTokens(tokensBetweenParentheses);
    const tokensAfterParentheses = tokensAfterLeftParenthesis.slice(
      rightParenthesisIndex + 1
    );
    return [getInnerValue, tokensAfterParentheses];
  };

  const property = (propertyToken, remainingTokens) => {
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
      if (propName in element.pInst) {
        return [
          () =>
            typeof element.pInst[propName] === "function"
              ? element.pInst[propName].bind(element.pInst)
              : element.pInst[propName],
          remainingTokens,
        ];
      }
      console.error(
        `On ${element.tagName}'s ${attrName}, couldn't find ${propName}`
      );
    }
    return [
      () =>
        typeof obj[propName] === "function"
          ? obj[propName].bind(obj)
          : obj[propName],
      remainingTokens,
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
        return [() => !parseTokens(remainder)(), []];
      case tokenKind.property:
        return property(token, remainder);
      case "(":
        return parentheses(remainder);
      default:
        console.error(
          `Parser failed on ${tokens.map((t) => t.value).join(" ")}`
        );
        return [() => undefined, remainder];
    }
  };

  const member = (tokens) => {
    const [left, afterLeft] = primary(tokens);
    if (debug)
      console.log("AFTER PRIMARY", afterLeft.map((t) => t.value).join(" "));
    const getPropertyMember = (left, afterLeft) => {
      if (afterLeft.length === 0) return [left, afterLeft];
      const [nextToken, ...afterNextToken] = afterLeft;
      if (nextToken.kind !== tokenKind.member) return [left, afterLeft];
      const memberName = nextToken.value;
      const nextLeft = () => left()[memberName];
      return getPropertyMember(nextLeft, afterNextToken);
    };
    return getPropertyMember(left, afterLeft);
  };

  const call = (tokens) => {
    const [left, afterLeft] = member(tokens);
    if (debug)
      console.log("AFTER MEMBER", afterLeft.map((t) => t.value).join(" "));
    if (afterLeft.length === 0) return [left, afterLeft];
    const [nextToken, ...afterNextToken] = afterLeft;
    if (nextToken.kind !== "(") return [left, afterLeft];
    const [getInnerParentheses, tokensAfterParentheses] =
      parentheses(afterNextToken);
    return [
      () => {
        const isFunction = typeof left() === "function";
        const innerParentheses = getInnerParentheses();
        const args = Array.isArray(innerParentheses)
          ? innerParentheses
          : [innerParentheses];
        if (isFunction) return left()(...args);
        return args.reduce((p, arg) => p[arg], left());
      },
      tokensAfterParentheses,
    ];
  };

  const not = (tokens) => {
    if (tokens[0].kind !== tokenKind.not) return call(tokens);
    if (debug)
      console.log("AFTER CALL", afterLeft.map((t) => t.value).join(" "));
    const [right, remainder] = call(tokens.slice(1));
    return [() => !right(), remainder];
  };

  const multiplicative = (tokens) => {
    const [left, afterLeft] = not(tokens);
    if (debug)
      console.log("AFTER NOT", afterLeft.map((t) => t.value).join(" "));
    if (afterLeft.length === 0) return [left, afterLeft];
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
    if (afterLeft.length === 0) return [left, afterLeft];
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
    if (afterLeft.length === 0) return [left, afterLeft];
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
    if (afterLeft.length === 0) return [left, afterLeft];
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
    if (afterLeft.length === 0) return [left, afterLeft];
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
    if (afterLeft.length === 0) return [left, afterLeft];
    const [nextToken, ...afterNextToken] = afterLeft;
    if (nextToken.kind !== "?") return [left, afterLeft];
    const colonIndex = afterNextToken.findIndex((token) => token.kind === ":");
    const [middle, afterMiddle] = logical(afterNextToken.slice(0, colonIndex));
    if (afterMiddle.length)
      console.error(
        `Found unexpected tokens in the middle of a ternary operation '${afterMiddle
          .map((t) => t.value)
          .join(" ")}'`
      );
    const [right, afterRight] = logical(afterNextToken.slice(colonIndex + 1));
    return [() => (left() ? middle() : right()), afterRight];
  };

  const list = (tokens, beforeLeftExpressions = []) => {
    const [left, afterLeft] = ternary(tokens);
    if (debug)
      console.log(
        "AFTER TERNARY LEFT",
        afterLeft.map((t) => t.value).join(" ")
      );
    if (afterLeft.length === 0) {
      if (beforeLeftExpressions.length === 0) return [left, afterLeft];
      const allExpressions = beforeLeftExpressions.concat(left);
      return [() => allExpressions.map((exp) => exp()), afterLeft];
    }
    const [nextToken, ...afterNextToken] = afterLeft;
    if (nextToken.kind !== ",") {
      console.error(
        `On ${
          element.tagName
        }'s ${attrName}, reached end of expression and found remaining tokens: ${afterLeft
          .map((t) => t.value)
          .join(" ")}`
      );
      return [left, afterLeft];
    }
    const [right, allTokensAfterRight] = ternary(afterNextToken);
    if (debug)
      console.log(
        "AFTER TERNARY RIGHT",
        allTokensAfterRight.map((t) => t.value).join(" ")
      );
    const allExpressions = beforeLeftExpressions.concat(left, right);
    if (allTokensAfterRight.length === 0)
      return [() => allExpressions.map((exp) => exp()), []];
    const [firstTokenAfterRight, ...remainder] = allTokensAfterRight;
    if (firstTokenAfterRight.kind !== ",") {
      console.error(
        `On ${
          element.tagName
        }'s ${attrName}, reached end of expression and found remaining tokens: ${afterRight
          .map((t) => t.value)
          .join(" ")}`
      );
      return [left, afterLeft];
    }
    return list(remainder, allExpressions);
  };

  const parseTokens = (tokens) => {
    if (debug)
      console.log(
        `On ${element.tagName}'s ${attrName}, parsing ${tokens
          .map((t) => t.value)
          .join(" ")}`
      );
    if (tokens.length === 0) return () => {};
    if (hasColonOutsideTernaryAndParentheses(tokens))
      return objectLiteral(tokens);
    const [expressionFunction, remainder] = list(tokens);
    return expressionFunction;
  };
  return parseTokens(fullListOfTokens);
};
