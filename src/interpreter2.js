const singleCharTokens = new Set("()[]{},:+-/*%?");
const multiCharToken = {
  number: "number",
  property: "property",
  boolean: "boolean",
  not: "not",
  comparison: "comparison",
  equality: "equality",
  string: "string",
  logical: "logical",
  until: "until",
};

const token = (kind, start, end, value) => ({ kind, start, end, value });

const lex = (str) => {
  const getTokens = (start = 0, tokens = []) => {
    if (start === str.length) return tokens;
    const strFromStart = str.slice(start);

    const leadingWhitespace = strFromStart.match(/^\s+/);
    if (leadingWhitespace) {
      const end = start + leadingWhitespace[0].length;
      return getTokens(end, tokens);
    }

    if (singleCharTokens.has(strFromStart[0])) {
      const end = start + 1;
      const singleCharToken = token(
        strFromStart[0],
        start,
        end,
        strFromStart[0]
      );
      return getTokens(end, tokens.concat(singleCharToken));
    }

    const numberMatch = strFromStart.match(/^-?\d+(?:\.\d+)?/);
    if (numberMatch) {
      const end = start + numberMatch[0].length;
      const numberToken = token(
        multiCharToken.number,
        start,
        end,
        numberMatch[0]
      );
      return getTokens(end, tokens.concat(numberToken));
    }
    const booleanMatch = strFromStart.match(/^(?:true|false)/);
    if (booleanMatch) {
      const end = start + booleanMatch[0].length;
      const booleanToken = token(
        multiCharToken.boolean,
        start,
        end,
        booleanMatch[0]
      );
      return getTokens(end, tokens.concat(booleanToken));
    }
    const notMatch = strFromStart.match(/^not/);
    if (notMatch) {
      const end = start + notMatch[0].length;
      const notToken = token(multiCharToken.not, start, end, notMatch[0]);
      return getTokens(end, tokens.concat(notToken));
    }
    const comparisonMatch = strFromStart.match(
      /^(?:less_than|greater_than|no_more_than|at_least)/
    );
    if (comparisonMatch) {
      const end = start + comparisonMatch[0].length;
      const comparisonToken = token(
        multiCharToken.comparison,
        start,
        end,
        comparisonMatch[0]
      );
      return getTokens(end, tokens.concat(comparisonToken));
    }
    const equalityMatch = strFromStart.match(/^(?:is|is_not)/);
    const logicalMatch = strFromStart.match(/^(?:and|or)/);
    if (logicalMatch) {
      const end = start + logicalMatch[0].length;
      const logicalToken = token(
        multiCharToken.logical,
        start,
        end,
        logicalMatch[0]
      );
      return getTokens(end, tokens.concat(logicalToken));
    }
    const untilMatch = strFromStart.match(/^until/);
    if (untilMatch) {
      const end = start + untilMatch[0].length;
      const untilToken = token(multiCharToken.until, start, end, untilMatch[0]);
      return getTokens(end, tokens.concat(untilToken));
    }
    const propertyMatch = strFromStart.match(/^[a-zA-Z]\w*(?:\.[a-zA-Z]\w*)*/);
    if (propertyMatch) {
      const end = start + propertyMatch[0].length;
      const propertyToken = token(
        multiCharToken.property,
        start,
        end,
        propertyMatch[0]
      );
      return getTokens(end, tokens.concat(propertyToken));
    }
    const stringMatch = strFromStart.match(/^'.*?'/);
    if (stringMatch) {
      const end = start + stringMatch[0].length;
      const stringToken = token(
        multiCharToken.string,
        start,
        end,
        stringMatch[0].slice(1, -1)
      );
      return getTokens(end, tokens.concat(stringToken));
    }

    console.error(`Unexpected token: ${strFromStart}`);
  };

  return getTokens();
};

const commaSeparateSections = (tokens) => {
  const sections = [[]];
  for (const token of tokens) {
    if (token.kind === ",") {
      sections.push([]);
    } else {
      sections[sections.length - 1].push(token);
    }
  }
  return sections;
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
      .slice(prevCommaIndex, i)
      .find((t) => t.kind === "?");
    return !questionBetweenCommaAndColon;
  });

const parseObjectLiteral = (tokens) => {
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

      const getValue = parse(el, obj, attrName, sectionTokens)[0];
      return () => [propName, getValue()];
    }
    if (colonIndex === 0) {
      console.error("FOUND COLON AT BEGINNING OF SECTION");
      return () => [];
    }
    if (colonIndex === 1) {
      const propName = sectionTokens[0].value;
      const tokensAfterColon = sectionTokens.slice(2);
      const getValue = parse(el, obj, attrName, tokensAfterColon)[0];
      return () => [propName, getValue()];
    }

    const getPropName = parse(
      el,
      obj,
      attrName,
      sectionTokens.slice(0, colonIndex)
    )[0];

    const getValue = parse(
      el,
      obj,
      attrName,
      sectionTokens.slice(colonIndex)
    )[0];
    return () => [getPropName(), getValue()];
  });
  return () => Object.fromEntries(getKeyValuePairs.map((fn) => fn()));
};

const parseTernary = (tokens) => {
  const questionIndex = tokens.findIndex((token) => token.kind === "?");
  const left = parseTokens(tokens.slice(0, questionIndex))[0];
  const colonIndex = tokens.findIndex((token) => token.kind === ":");
  const middle = parseTokens(tokens.slice(questionIndex + 1, colonIndex))[0];
  const right = parseTokens(tokens.slice(colonIndex + 1))[0];
  return () => (left() ? middle() : right());
};

const parsePrimary = (tokens) => {
  const [token, ...remainder] = tokens;
  switch (token.kind) {
    case multiCharToken.number:
      const numberStringVal = token.value;
      return [() => Number(numberStringVal), remainder];
    case "(":
      const rightParenthesisIndex = remainder.findIndex((t) => t.kind === ")");
      const tokensBetweenParentheses = remainder.slice(
        0,
        rightParenthesisIndex
      );
      const getInnerValue = parseTokens(tokensBetweenParentheses);
      const tokensAfterParentheses = remainder.slice(rightParenthesisIndex + 1);
      return [getInnerValue, tokensAfterParentheses];
    default:
      console.error(`Parser failed on ${tokens.map((t) => t.value).join(" ")}`);
      return [() => undefined, remainder];
  }
};

const parseLogical = (tokens) => {
  const [left, afterLeft] = parsePrimary(tokens);
  console.log("AFTER PRIMARY", afterLeft.map((t) => t.value).join(" "));
  if (afterLeft.length === 0) return [left, afterLeft];
  const [operator, ...rightTokens] = afterLeft;
  if (operator.kind !== multiCharToken.logical) return [left, afterLeft];
  const [right, remainder] = parsePrimary(rightTokens);
  if (operator.value === "and") return [() => left() && right(), remainder];
  return [() => left() || right(), remainder];
};

const parseEquality = (tokens) => {
  const [left, afterLeft] = parseLogical(tokens);
  console.log("AFTER LOGICAL", afterLeft.map((t) => t.value).join(" "));
  if (afterLeft.length === 0) return [left, afterLeft];
  const [operator, ...rightTokens] = afterLeft;
  if (operator.kind !== multiCharToken.comparison) return [left, afterLeft];
  const [right, remainder] = parseLogical(rightTokens);
  if (operator.value === "is")
    return [() => Object.is(left(), right()), remainder];
  return [() => !Object.is(left(), right()), remainder];
};

const parseComparison = (tokens) => {
  const [left, afterLeft] = parseEquality(tokens);
  console.log("AFTER EQUALITY", afterLeft.map((t) => t.value).join(" "));
  if (afterLeft.length === 0) return [left, afterLeft];
  const [operator, ...rightTokens] = afterLeft;
  console.log(operator, operator.kind === multiCharToken.comparison);
  if (operator.kind !== multiCharToken.comparison) return [left, afterLeft];
  const [right, remainder] = parseEquality(rightTokens);
  const getCompareFn = () => {
    switch (operator.value) {
      case "less_than":
        return () => left() < right();
      case "no_more_than":
        return () => left() <= right();
      case "at_least":
        return () => left() >= right();
      case "greater_than":
        return () => left() > right();
    }
    return [getCompareFn(), remainder];
  };
};

const parseMultiplicative = (tokens) => {
  const [left, afterLeft] = parseComparison(tokens);
  console.log("AFTER COMPARE", afterLeft.map((t) => t.value).join(" "));
  if (afterLeft.length === 0) return [left, afterLeft];
  const [operator, ...rightTokens] = afterLeft;
  if (operator.kind !== "*" && operator.kind !== "/") return [left, afterLeft];
  const [right, remainder] = parseMultiplicative(rightTokens);
  console.log(remainder);
  if (operator.kind === "*") return [() => left() * right(), remainder];
  return [() => left() / right(), remainder];
};

const parseAdditive = (tokens) => {
  const [left, afterLeft] = parseMultiplicative(tokens);
  console.log("AFTER MULT LEFT", afterLeft.map((t) => t.value).join(" "));
  if (afterLeft.length === 0) return left;
  const [operator, ...rightTokens] = afterLeft;
  if (operator.kind !== "+" && operator.kind !== "-") {
    console.error(
      `Parsed reaching additive expression with no tokens on the right`
    );
    return left;
  }
  const [right, remainder] = parseMultiplicative(rightTokens);
  if (remainder.length)
    console.error(
      `Parser reached additive expression with remaining tokens: ${tokens
        .map((t) => t.value)
        .join(" ")}`
    );
  if (operator.kind === "+") return () => left() + right();
  return () => left() - right();
};

const parseTokens = (tokens) => {
  console.log(`Parsing ${tokens.map((t) => t.value).join(" ")}`);
  if (hasColonOutsideTernaryAndParentheses(tokens))
    return parseObjectLiteral(tokens);
  if (firstIndexOutsideParentheses(tokens, ",") > -1)
    return commaSeparateSections(tokens).map((section) =>
      parseTokens(section)[0]()
    );
  if (firstIndexOutsideParentheses(tokens, "?") > -1)
    return parseTernary(tokens);
  return parseAdditive(tokens);
};

const interpret = (str) => {
  const tokens = lex(str);
  const fn = parseTokens(tokens);
  return fn;
};

const testStatement = "2 * (3 + 4) / 7 - (5)";
const fn = interpret(testStatement);
console.log(fn());
