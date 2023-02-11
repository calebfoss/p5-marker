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

const tokenOfKindOutsideParentheses = (token, kind, prevTokens) => {
  if (token.kind !== kind) return false;
  const [leftParentheses, rightParentheses] = prevTokens.reduce(
    ([leftParentheses, rightParentheses], prevToken) => {
      if (prevToken.kind === "(")
        return [leftParentheses + 1, rightParentheses];
      if (prevToken.kind === ")")
        return [leftParentheses, rightParentheses + 1];
      return [leftParentheses, rightParentheses];
    },
    [0, 0]
  );
  return leftParentheses === rightParentheses;
};

const firstIndexOutsideParentheses = (tokens, kind) =>
  tokens.findIndex((token, i) =>
    tokenOfKindOutsideParentheses(token, kind, tokens.slice(0, i))
  );

const hasColonOutsideTernaryAndParentheses = (tokens) =>
  tokens.some((token, i) => {
    const prevTokens = tokens.slice(0, i);
    if (!tokenOfKindOutsideParentheses(token, ":", prevTokens)) return false;
    const prevCommaIndex = tokens.findLastIndex((t) =>
      tokenOfKindOutsideParentheses(t, ",", prevTokens)
    );
    const questionBetweenCommaAndColon = tokens
      .slice(Math.max(prevCommaIndex, 0), i)
      .find((t) => t.kind === "?");
    return !questionBetweenCommaAndColon;
  });

export const parse = (element, attrName, fullListOfTokens) => {
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

  const ternary = (tokens) => {
    const questionIndex = tokens.findIndex((token) => token.kind === "?");
    const left = parseTokens(tokens.slice(0, questionIndex));
    const colonIndex = tokens.findIndex((token) => token.kind === ":");
    const middle = parseTokens(tokens.slice(questionIndex + 1, colonIndex));
    const right = parseTokens(tokens.slice(colonIndex + 1));
    return () => (left() ? middle() : right());
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

  const primary = (tokens) => {
    const [token, ...remainder] = tokens;
    switch (token.kind) {
      case tokenKind.string:
        return [() => token.value, remainder];
      case tokenKind.number:
        const numberStringVal = token.value;
        return [() => Number(numberStringVal), remainder];
      case tokenKind.boolean:
        const booleanValue = token.value === "true";
        return [() => booleanValue, remainder];
      case tokenKind.until:
        return [() => !parseTokens(remainder)(), []];
      case "(":
        return parentheses(remainder);
      default:
        console.error(
          `Parser failed on ${tokens.map((t) => t.value).join(" ")}`
        );
        return [() => undefined, remainder];
    }
  };

  const logical = (tokens) => {
    const [left, afterLeft] = primary(tokens);
    console.log("AFTER PRIMARY", afterLeft.map((t) => t.value).join(" "));
    if (afterLeft.length === 0) return [left, afterLeft];
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.logical) return [left, afterLeft];
    const right = parseTokens(rightTokens);
    if (operator.value === "and") return [() => left() && right(), []];
    return [() => left() || right(), []];
  };

  const equality = (tokens) => {
    const [left, afterLeft] = logical(tokens);
    console.log("AFTER LOGICAL", afterLeft.map((t) => t.value).join(" "));
    if (afterLeft.length === 0) return [left, afterLeft];
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.equality) return [left, afterLeft];
    const right = parseTokens(rightTokens);
    if (operator.value === "is") return [() => Object.is(left(), right()), []];
    return [() => !Object.is(left(), right()), []];
  };

  const comparison = (tokens) => {
    const [left, afterLeft] = equality(tokens);
    console.log("AFTER EQUALITY", afterLeft.map((t) => t.value).join(" "));
    if (afterLeft.length === 0) return [left, afterLeft];
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.comparison) return [left, afterLeft];
    const right = parseTokens(rightTokens);
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
    return [getCompareFn(), []];
  };

  const multiplicative = (tokens) => {
    const [left, afterLeft] = comparison(tokens);
    console.log("AFTER COMPARE", afterLeft.map((t) => t.value).join(" "));
    if (afterLeft.length === 0) return [left, afterLeft];
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.multiplicative) return [left, afterLeft];
    const [right, remainder] = multiplicative(rightTokens);
    if (operator.value === "*") return [() => left() * right(), remainder];
    return [() => left() / right(), remainder];
  };

  const additive = (tokens) => {
    const [left, afterLeft] = multiplicative(tokens);
    console.log("AFTER MULT LEFT", afterLeft.map((t) => t.value).join(" "));
    if (afterLeft.length === 0) return left;
    const [operator, ...rightTokens] = afterLeft;
    if (operator.kind !== tokenKind.additive) {
      console.error(
        `Parsed reaching additive expression with no tokens on the right`
      );
      return left;
    }
    if (rightTokens.length > 1)
      console.error(
        `Parser reached additive expression with remaining tokens: ${rightTokens
          .slice(1)
          .map((t) => t.value)
          .join(" ")}`,
        rightTokens.slice(1)
      );
    const right = additive(rightTokens);
    if (operator.value === "+") return () => left() + right();
    return () => left() - right();
  };

  const parseTokens = (tokens) => {
    console.log(`Parsing ${tokens.map((t) => t.value).join(" ")}`);
    if (hasColonOutsideTernaryAndParentheses(tokens))
      return objectLiteral(tokens);
    /*
    If this is a comma-separated list, return a function that returns
    the values of each of the sections in an array.
    */
    if (firstIndexOutsideParentheses(tokens, ",") > -1)
      return () =>
        commaSeparateSections(tokens).map((section) => parseTokens(section)());
    if (firstIndexOutsideParentheses(tokens, "?") > -1) return ternary(tokens);
    return additive(tokens);
  };
  return parseTokens(fullListOfTokens);
};