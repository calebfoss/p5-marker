import { lex } from "./lexer.js";
import { parse } from "./parser.js";

export const interpret = (element, attrName, attrValue) => {
  const tokens = lex(attrValue);
  const getValue = parse(tokens);
  return getValue;
};

const test = "1, (2, 3 * (4 + 5))";
const testInterpretation = interpret({}, "test", test);
console.log(testInterpretation());
