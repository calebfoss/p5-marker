import { lex } from "./lexer.js";
import { parse } from "./parser.js";

export const interpret = (element, attrName, attrValue) => {
  const tokens = lex(attrValue);
  const getValue = parse(element, attrName, tokens);
  return getValue;
};

const test = "1 is less than 1 + 1 - 2";
const testInterpretation = interpret({ prop: "value" }, "test", test);
console.log(testInterpretation());
