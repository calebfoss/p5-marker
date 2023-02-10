import { lex } from "./lexer.js";
import { parse } from "./parser.js";

export const interpret = (element, attrName, attrValue) => {
  const tokens = lex(attrValue);
  const getValue = parse(element, attrName, tokens);
  return getValue;
};

const test = "prop: 123, ternary: 1 less_than 2 ? 3 : 4";
const testInterpretation = interpret({ prop: "value" }, "test", test);
console.log(testInterpretation());
