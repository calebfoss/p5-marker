import {
  Token,
  ParenthesisValue,
  SquareBracketValue,
  AdditiveOperator,
  MultiplicativeOperator,
  NotValue,
  ComparisonOperator,
  EqualityOperator,
  LogicalOperator,
  IdentifierToken,
  LiteralToken,
  PunctuatorToken,
} from "./languageTypes";

export const lex = (str: string) => {
  const getTokens = (start = 0, tokens = [] as Token[]) => {
    if (start === str.length) return tokens;
    const strFromStart = str.slice(start);

    const leadingWhitespace = strFromStart.match(/^\s+/);
    if (leadingWhitespace) {
      const end = start + leadingWhitespace[0].length;
      return getTokens(end, tokens);
    }

    const commaMatch = strFromStart[0] === ",";
    if (commaMatch) {
      const end = start + 1;
      const commaToken: PunctuatorToken<"comma"> = {
        kind: "punctuator",
        category: "comma",
        start,
        end,
        value: ",",
      };
      return getTokens(end, tokens.concat(commaToken));
    }

    const parenthesisMatch = strFromStart.match(/^\(|\)/);
    if (parenthesisMatch) {
      const end = start + 1;
      const parenthesisToken: PunctuatorToken<"parenthesis"> = {
        kind: "punctuator",
        category: "parenthesis",
        start,
        end,
        value: parenthesisMatch[0] as ParenthesisValue,
      };
      return getTokens(end, tokens.concat(parenthesisToken));
    }

    const squareBracketMatch = strFromStart.match(/^\[|\]/);
    if (squareBracketMatch) {
      const end = start + 1;
      const squareBracketToken: PunctuatorToken<"square_bracket"> = {
        kind: "punctuator",
        category: "square_bracket",
        start,
        end,
        value: squareBracketMatch[0] as SquareBracketValue,
      };
      return getTokens(end, tokens.concat(squareBracketToken));
    }

    const numberMatch = strFromStart.match(/^\d+(?:\.\d+)?/);
    const value = Number(numberMatch[0]);
    if (Number.isNaN(value)) throw new Error(`${numberMatch} is not a number`);
    if (numberMatch) {
      const end = start + numberMatch[0].length;
      const numberToken: LiteralToken<"number"> = {
        kind: "literal",
        type: "number",
        start,
        end,
        raw: numberMatch[0],
        value,
      };
      return getTokens(end, tokens.concat(numberToken));
    }
    const additiveMatch = strFromStart.match(/^[+-]/);
    if (additiveMatch) {
      const end = start + additiveMatch[0].length;
      const additiveToken: PunctuatorToken<"additive"> = {
        kind: "punctuator",
        category: "additive",
        start,
        end,
        value: additiveMatch[0] as AdditiveOperator,
      };
      return getTokens(end, tokens.concat(additiveToken));
    }
    const multiplicativeMatch = strFromStart.match(/^[*\/%]/);
    if (multiplicativeMatch) {
      const end = start + multiplicativeMatch[0].length;
      const multiplicativeToken: PunctuatorToken<"multiplicative"> = {
        kind: "punctuator",
        category: "multiplicative",
        start,
        end,
        value: multiplicativeMatch[0] as MultiplicativeOperator,
      };
      return getTokens(end, tokens.concat(multiplicativeToken));
    }
    const booleanMatch = strFromStart.match(/^(?:true|false)/);
    if (booleanMatch) {
      const end = start + booleanMatch[0].length;
      const booleanToken: LiteralToken<"boolean"> = {
        kind: "literal",
        start,
        end,
        raw: booleanMatch[0],
        type: "boolean",
        value: booleanMatch[0] === "true",
      };
      return getTokens(end, tokens.concat(booleanToken));
    }
    const notMatch = strFromStart.match(/^not|until/);
    if (notMatch) {
      const end = start + notMatch[0].length;
      const notToken: PunctuatorToken<"not"> = {
        kind: "punctuator",
        category: "not",
        start,
        end,
        value: notMatch[0] as NotValue,
      };
      return getTokens(end, tokens.concat(notToken));
    }
    const comparisonMatch = strFromStart.match(
      /^(?:(?:is\s)?\s*less\s+than|(?:is\s)?\s*greater\s+than|(?:is\s)?\s*no\s+more\s+than|(?:is\s)?\s*at\s+least)/
    );
    if (comparisonMatch) {
      const end = start + comparisonMatch[0].length;
      //  Remove "is" at beginning and replace multiple spaces with single
      const operator = comparisonMatch[0]
        .replace(/is\s+/, "")
        .replace(/\s+/g, " ") as ComparisonOperator;
      const comparisonToken: PunctuatorToken<"comparison"> = {
        kind: "punctuator",
        category: "comparison",
        start,
        end,
        value: operator,
      };
      return getTokens(end, tokens.concat(comparisonToken));
    }
    const equalityMatch = strFromStart.match(/^(?:is\s+not|is)/);
    if (equalityMatch) {
      const end = start + equalityMatch[0].length;
      const equalityToken: PunctuatorToken<"equality"> = {
        kind: "punctuator",
        category: "equality",
        start,
        end,
        value: equalityMatch[0] as EqualityOperator,
      };
      return getTokens(end, tokens.concat(equalityToken));
    }
    const logicalMatch = strFromStart.match(/^(?:and|or)/);
    if (logicalMatch) {
      const end = start + logicalMatch[0].length;
      const logicalToken: PunctuatorToken<"logical"> = {
        kind: "punctuator",
        category: "logical",
        start,
        end,
        value: logicalMatch[0] as LogicalOperator,
      };
      return getTokens(end, tokens.concat(logicalToken));
    }

    const identifierMatch = strFromStart.match(/^[a-zA-Z]\w*/);
    if (identifierMatch) {
      const end = start + identifierMatch[0].length;
      const identifierToken: IdentifierToken = {
        kind: "identifier",
        start,
        end,
        value: identifierMatch[0],
      };
      return getTokens(end, tokens.concat(identifierToken));
    }
    const stringMatch = strFromStart.match(/^('|")((?:[^\\]|\\.)*?)\1/);
    if (stringMatch) {
      const end = start + stringMatch[0].length;
      const stringToken: LiteralToken<"string"> = {
        kind: "literal",
        type: "string",
        start,
        end,
        value: stringMatch[2],
      };
      return getTokens(end, tokens.concat(stringToken));
    }
    console.error(`Unexpected token: ${strFromStart}`);
  };

  return getTokens();
};
