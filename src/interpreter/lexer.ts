import {
  Token,
  IdentifierToken,
  CommaToken,
  ParenthesisToken,
  SquareBracketToken,
  NumberToken,
  AdditiveToken,
  AdditiveOperators,
  CommaValue,
  ParenthesisValues,
  SquareBracketValues,
  MultiplicativeOperators,
  MultiplicativeToken,
  BooleanToken,
  BooleanValues,
  NotValues,
  NotToken,
  matchComparison,
  ComparisonToken,
  matchEquality,
  EqualityToken,
  LogicalOperators,
  LogicalToken,
  StringToken,
  DotValue,
  DotToken,
  QuestionValue,
  QuestionToken,
  ColonToken,
  ColonValue,
} from "./tokens";

export const lex = (str: string): Token[] => {
  const getTokens = (start = 0, tokens = [] as Token[]) => {
    if (start === str.length) return tokens;
    const stringFromStart = str.slice(start);

    const leadingWhitespace = stringFromStart.match(/^\s+/);
    if (leadingWhitespace) {
      const end = start + leadingWhitespace[0].length;
      return getTokens(end, tokens);
    }

    const [firstCharacter] = stringFromStart;

    switch (firstCharacter) {
      case CommaValue: {
        const end = start + 1;
        const commaToken = new CommaToken(start, end, firstCharacter);
        return getTokens(end, tokens.concat(commaToken));
      }
      case DotValue: {
        const end = start + 1;
        const dotToken = new DotToken(start, end, firstCharacter);
        return getTokens(end, tokens.concat(dotToken));
      }
      case QuestionValue: {
        const end = start + 1;
        const questionToken = new QuestionToken(start, end, firstCharacter);
        return getTokens(end, tokens.concat(questionToken));
      }
      case ColonValue: {
        const end = start + 1;
        const colonToken = new ColonToken(start, end, firstCharacter);
        return getTokens(end, tokens.concat(colonToken));
      }
    }

    const parenthesisMatch = ParenthesisValues.find(
      (value) => firstCharacter === value
    );
    if (parenthesisMatch) {
      const end = start + parenthesisMatch.length;
      const parenthesisToken = new ParenthesisToken(
        start,
        end,
        parenthesisMatch
      );
      return getTokens(end, tokens.concat(parenthesisToken));
    }

    const squareBracketMatch = SquareBracketValues.find(
      (value) => value === firstCharacter
    );
    if (squareBracketMatch) {
      const end = start + squareBracketMatch.length;
      const squareBracketToken = new SquareBracketToken(
        start,
        end,
        squareBracketMatch
      );
      return getTokens(end, tokens.concat(squareBracketToken));
    }

    const numberMatch = stringFromStart.match(/^\d+(?:\.\d+)?/);
    if (numberMatch) {
      const end = start + numberMatch[0].length;
      const numberToken = new NumberToken(start, end, numberMatch[0]);
      return getTokens(end, tokens.concat(numberToken));
    }
    const additiveMatch = AdditiveOperators.find(
      (operator) => firstCharacter === operator
    );
    if (additiveMatch) {
      const end = start + additiveMatch.length;
      const additiveToken = new AdditiveToken(start, end, additiveMatch);
      return getTokens(end, tokens.concat(additiveToken));
    }

    const multiplicativeMatch = MultiplicativeOperators.find(
      (operator) => operator === firstCharacter
    );
    if (multiplicativeMatch) {
      const end = start + multiplicativeMatch[0].length;
      const multiplicativeToken = new MultiplicativeToken(
        start,
        end,
        multiplicativeMatch
      );
      return getTokens(end, tokens.concat(multiplicativeToken));
    }

    const booleanMatch = BooleanValues.find(
      (value) => value === stringFromStart.slice(0, value.length)
    );
    if (booleanMatch) {
      const end = start + booleanMatch.length;
      const booleanToken = new BooleanToken(start, end, booleanMatch);
      return getTokens(end, tokens.concat(booleanToken));
    }

    const notMatch = NotValues.find(
      (value) => value === stringFromStart.slice(0, value.length)
    );
    if (notMatch) {
      const end = start + notMatch.length;
      const notToken = new NotToken(start, end, notMatch);
      return getTokens(end, tokens.concat(notToken));
    }
    const comparisonMatch = matchComparison(stringFromStart);
    if (comparisonMatch) {
      const end = start + comparisonMatch[1];
      const comparisonToken = new ComparisonToken(
        start,
        end,
        comparisonMatch[0]
      );
      return getTokens(end, tokens.concat(comparisonToken));
    }
    const equalityMatch = matchEquality(stringFromStart);
    if (equalityMatch) {
      const end = start + equalityMatch.length;
      const equalityToken = new EqualityToken(start, end, equalityMatch);
      return getTokens(end, tokens.concat(equalityToken));
    }
    const logicalMatch = LogicalOperators.find(
      (operator) => operator === stringFromStart.slice(0, operator.length)
    );
    if (logicalMatch) {
      const end = start + logicalMatch.length;
      const logicalToken = new LogicalToken(start, end, logicalMatch);
      return getTokens(end, tokens.concat(logicalToken));
    }

    const identifierMatch = stringFromStart.match(/^[a-zA-Z]\w*/);
    if (identifierMatch) {
      const end = start + identifierMatch[0].length;
      const identifierToken = new IdentifierToken(
        start,
        end,
        identifierMatch[0]
      );
      return getTokens(end, tokens.concat(identifierToken));
    }
    const stringMatch = stringFromStart.match(/^('|")((?:[^\\]|\\.)*?)\1/);
    if (stringMatch) {
      const end = start + stringMatch[0].length;
      const stringToken = new StringToken(
        start,
        end,
        stringMatch[0].slice(1, -1)
      );
      return getTokens(end, tokens.concat(stringToken));
    }
    throw new Error(`Unexpected token: ${stringFromStart}`);
  };

  return getTokens();
};
