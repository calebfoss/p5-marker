export class Token {
  start: number;
  end: number;
  value: unknown;
  constructor(start: number, end: number, value: any) {
    this.start = start;
    this.end = end;
    this.value = value;
  }
}

export class IdentifierToken extends Token {
  declare value: string;
  constructor(start: number, end: number, value: string) {
    super(start, end, value);
  }
}

export class LiteralToken extends Token {}

export class StringToken extends LiteralToken {
  declare value: string;
  constructor(start: number, end: number, value: string) {
    super(start, end, value);
  }
}

export const BooleanValues = ["true", "false"] as const;
export type BooleanValue = (typeof BooleanValues)[number];
export class BooleanToken extends LiteralToken {
  declare value: boolean;
  raw: string;
  constructor(start: number, end: number, raw: BooleanValue) {
    const value = raw === "true";
    super(start, end, value);
    this.raw = raw;
  }
}

export class NumberToken extends LiteralToken {
  declare value: number;
  raw: string;
  constructor(start: number, end: number, raw: string) {
    const value = Number(raw);
    if (Number.isNaN(value))
      throw new Error(
        `Token '${raw}' was lexed as a number but parses as not a number (NaN).`
      );
    super(start, end, value);
    this.raw = raw;
  }
}

export class PunctuatorToken extends Token {}

export const AdditiveOperators = ["+", "-"] as const;
export type AdditiveOperator = (typeof AdditiveOperators)[number];
export class AdditiveToken extends PunctuatorToken {
  declare value: AdditiveOperator;
  constructor(start: number, end: number, value: AdditiveOperator) {
    super(start, end, value);
  }
}

const ComparisonOperators = {
  less_than: ["<", "less than"],
  less_than_or_equal: ["<=", "no more than"],
  greater_than: [">", "greater than"],
  great_than_or_equal: [">=", "at least"],
} as const;
export type ComparisonOperator =
  (typeof ComparisonOperators)[keyof typeof ComparisonOperators][number];
export function matchComparison(str: string): [ComparisonOperator, number] {
  for (const versions of Object.values(ComparisonOperators)) {
    for (const version of versions) {
      let versionCharIndex = 0;
      for (
        let stringCharIndex = 0;
        stringCharIndex < str.length;
        stringCharIndex++
      ) {
        const strChar = str.charAt(stringCharIndex);
        if (strChar === version.charAt(versionCharIndex)) {
          versionCharIndex++;
          if (versionCharIndex === version.length)
            return [version, stringCharIndex + 1];
        } else if (
          strChar.match(/\s/) === null &&
          strChar !== "is".charAt(stringCharIndex)
        )
          break;
      }
    }
  }
  return null;
}
export class ComparisonToken extends PunctuatorToken {
  declare value: ComparisonOperator;
  constructor(start: number, end: number, value: ComparisonOperator) {
    super(start, end, value);
  }
}

export const EqualityOperators = { not_equal: "is not", equal: "is" } as const;
export function matchEquality(str: string) {
  const operators = Object.values(EqualityOperators).sort(
    (a, b) => b.length - a.length
  );
  for (const operator of operators) {
    let operatorCharIndex = 0;
    for (
      let stringCharIndex = 0;
      stringCharIndex < str.length;
      stringCharIndex++
    ) {
      if (str.charAt(stringCharIndex) === operator.charAt(operatorCharIndex)) {
        operatorCharIndex++;
        if (operatorCharIndex === operator.length) return operator;
      } else if (str.charAt(stringCharIndex).match(/\s/) === null) break;
    }
  }
}
export type EqualityOperator =
  (typeof EqualityOperators)[keyof typeof EqualityOperators];
export class EqualityToken extends PunctuatorToken {
  declare value: EqualityOperator;
  constructor(start: number, end: number, value: EqualityOperator) {
    super(start, end, value);
  }
}

export const LogicalOperators = ["and", "or"] as const;
export type LogicalOperator = (typeof LogicalOperators)[number];
export class LogicalToken extends PunctuatorToken {
  declare value: LogicalOperator;
  constructor(start: number, end: number, value: LogicalOperator) {
    super(start, end, value);
  }
}

export const MultiplicativeOperators = ["*", "/", "%"] as const;
export type MultiplicativeOperator = (typeof MultiplicativeOperators)[number];
export class MultiplicativeToken extends PunctuatorToken {
  declare value: MultiplicativeOperator;
  constructor(start: number, end: number, value: MultiplicativeOperator) {
    super(start, end, value);
  }
}

export const NotValues = ["not", "until"] as const;
export type NotValue = (typeof NotValues)[number];
export class NotToken extends PunctuatorToken {
  declare value: NotValue;
  constructor(start: number, end: number, value: NotValue) {
    super(start, end, value);
  }
}

export const ParenthesisValues = ["(", ")"] as const;
export type ParenthesisValue = (typeof ParenthesisValues)[number];
export class ParenthesisToken extends PunctuatorToken {
  declare value: ParenthesisValue;
  constructor(start: number, end: number, value: ParenthesisValue) {
    super(start, end, value);
  }
}

export const SquareBracketValues = ["[", "]"] as const;
export type SquareBracketValue = (typeof SquareBracketValues)[number];
export class SquareBracketToken extends PunctuatorToken {
  declare value: SquareBracketValue;
  constructor(start: number, end: number, value: SquareBracketValue) {
    super(start, end, value);
  }
}

export const ColonValue = ":";
export class ColonToken extends PunctuatorToken {
  declare value: typeof ColonValue;
  constructor(start: number, end: number, value: typeof ColonValue) {
    super(start, end, value);
  }
}

export const CommaValue = ",";
export class CommaToken extends PunctuatorToken {
  declare value: typeof CommaValue;
  constructor(start: number, end: number, value: typeof CommaValue) {
    super(start, end, value);
  }
}

export const QuestionValue = "?";
export class QuestionToken extends PunctuatorToken {
  declare value: typeof QuestionValue;
  constructor(start: number, end: number, value: typeof QuestionValue) {
    super(start, end, value);
  }
}

export const DotValue = ".";
export class DotToken extends PunctuatorToken {
  declare value: typeof DotValue;
  constructor(start: number, end: number, value: typeof DotValue) {
    super(start, end, value);
  }
}
