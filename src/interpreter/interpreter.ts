import { MarkerElement } from "../elements/base";
import { lex } from "./lexer";
import { parse } from "./parser";

export const interpret = (element: MarkerElement, attribute: Attr): void => {
  const nameTokens = lex(attribute.name);
  const valTokens = lex(attribute.value);
  parse(element, attribute.name, nameTokens, valTokens);
};
