const singleCharTokens = new Set("()[]{},:+-/*%?");
export const multiCharToken = {
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
    if (equalityMatch) {
      const end = start + equalityMatch[0].length;
      const equalityToken = token(
        multiCharToken.equality,
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
