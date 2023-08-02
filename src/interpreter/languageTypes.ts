export const TokenKind = {
  identifier: "identifier",
  literal: "literal",
  punctuator: "punctuator",
} as const;
export type TokenKind = (typeof TokenKind)[keyof typeof TokenKind];

export type Token = {
  kind: TokenKind;
  start: number;
  end: number;
  value: LiteralType[keyof LiteralType];
};
export type IdentifierToken = Token & {
  kind: "identifier";
  value: string;
};
type LiteralType = {
  boolean: boolean;
  number: number;
  string: string;
};
export type LiteralToken<T extends keyof LiteralType> = Token & {
  kind: "literal";
  type: T;
  value: LiteralType[T];
} & (T extends "string" ? {} : { raw: string });
export type AdditiveOperator = "+" | "-";
export type ComparisonOperator =
  | "less than"
  | "greater than"
  | "at least"
  | "no more than";
export type EqualityOperator = "is" | "is not";
export type LogicalOperator = "and" | "or";
export type MultiplicativeOperator = "*" | "/" | "%";
export type NotValue = "not" | "until";
export type ParenthesisValue = "(" | ")";
export type SquareBracketValue = "[" | "]";
type PunctuatorCategories = {
  additive: AdditiveOperator;
  colon: ":";
  comma: ",";
  comparison: ComparisonOperator;
  dot: ".";
  equality: EqualityOperator;
  logical: LogicalOperator;
  multiplicative: MultiplicativeOperator;
  not: NotValue;
  parenthesis: ParenthesisValue;
  question: "?";
  square_bracket: SquareBracketValue;
};
export type PunctuatorCategory = keyof PunctuatorCategories;
export type PunctuatorToken<Category extends keyof PunctuatorCategories> =
  Token & {
    kind: "punctuator";
    category: Category;
    value: PunctuatorCategories[Category];
  };
