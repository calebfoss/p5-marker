import { lex } from "./lexer.js";
import { parse } from "./parser.js";

export const interpret = (element, attrName, attrValue) => {
  const tokens = lex(attrValue);
  const getValue = parse(element, attrName, tokens);
  return getValue;
};
