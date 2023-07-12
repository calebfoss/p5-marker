import { MarkerElement } from "../elements/base";
import { lex } from "./lexer";
import { parse, parseAttributeName } from "./parser";

export const interpret = (
  element: MarkerElement,
  attribute: Attr
): [() => object, () => string, () => any] => {
  const nameTokens = lex(attribute.name);
  const firstNameTokenValue = nameTokens[0].value;
  const referenceOwnProperties =
    firstNameTokenValue === "change" ||
    firstNameTokenValue === "each" ||
    firstNameTokenValue === "repeat";
  const [getTarget, getPropName] = parseAttributeName(
    element,
    attribute.name,
    nameTokens
  );

  const valTokens = lex(attribute.value);
  const getValue = parse(
    element,
    attribute.name,
    valTokens,
    referenceOwnProperties
  );
  return [getTarget, getPropName, getValue];
};