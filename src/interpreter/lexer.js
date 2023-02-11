const singleCharTokens = new Set("()[]{},:/*%?");
export const tokenKind = {
  number: "number",
  property: "property",
  boolean: "boolean",
  additive: "additive",
  not: "not",
  comparison: "comparison",
  equality: "equality",
  string: "string",
  logical: "logical",
  until: "until",
};

const token = (kind, start, end, value) => ({ kind, start, end, value });

export const lex = (str) => {
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
      const numberToken = token(tokenKind.number, start, end, numberMatch[0]);
      return getTokens(end, tokens.concat(numberToken));
    }
    const additiveMatch = strFromStart.match(/^[+-]/);
    if (additiveMatch) {
      const end = start + additiveMatch[0].length;
      const addToken = token(tokenKind.additive, start, end, additiveMatch[0]);
      return getTokens(end, tokens.concat(addToken));
    }
    const booleanMatch = strFromStart.match(/^(?:true|false)/);
    if (booleanMatch) {
      const end = start + booleanMatch[0].length;
      const booleanToken = token(
        tokenKind.boolean,
        start,
        end,
        booleanMatch[0]
      );
      return getTokens(end, tokens.concat(booleanToken));
    }
    const notMatch = strFromStart.match(/^not/);
    if (notMatch) {
      const end = start + notMatch[0].length;
      const notToken = token(tokenKind.not, start, end, notMatch[0]);
      return getTokens(end, tokens.concat(notToken));
    }
    const comparisonMatch = strFromStart.match(
      /^(?:(?:is\s)?\s*less\s+than|(?:is\s)?\s*greater\s+than|(?:is\s)?\s*no\s+more\s+than|(?:is\s)?\s*at\s+least)/
    );
    if (comparisonMatch) {
      const end = start + comparisonMatch[0].length;
      //  Remove "is" at beginning and replace multiple spaces with single
      const val = comparisonMatch[0].replace(/is\s+/, "").replace(/\s+/g, " ");
      const comparisonToken = token(tokenKind.comparison, start, end, val);
      return getTokens(end, tokens.concat(comparisonToken));
    }
    const equalityMatch = strFromStart.match(/^(?:is\s+not|is)/);
    if (equalityMatch) {
      const end = start + equalityMatch[0].length;
      const equalityToken = token(
        tokenKind.equality,
        start,
        end,
        equalityMatch[0]
      );
      return getTokens(end, tokens.concat(equalityToken));
    }
    const logicalMatch = strFromStart.match(/^(?:and|or)/);
    if (logicalMatch) {
      const end = start + logicalMatch[0].length;
      const logicalToken = token(
        tokenKind.logical,
        start,
        end,
        logicalMatch[0]
      );
      return getTokens(end, tokens.concat(logicalToken));
    }
    const untilMatch = strFromStart.match(/^until/);
    if (untilMatch) {
      const end = start + untilMatch[0].length;
      const untilToken = token(tokenKind.until, start, end, untilMatch[0]);
      return getTokens(end, tokens.concat(untilToken));
    }
    const propertyMatch = strFromStart.match(/^[a-zA-Z]\w*(?:\.[a-zA-Z]\w*)*/);
    if (propertyMatch) {
      const end = start + propertyMatch[0].length;
      const propertyToken = token(
        tokenKind.property,
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
        tokenKind.string,
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
