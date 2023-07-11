import { lex } from "./lexer";
import { parse, parseAttributeName } from "./parser";

export const interpret = (
  element: HTMLElement,
  attribute: Attr
): [() => object, () => string, () => any] => {
  const nameTokens = lex(attribute.name);
  const [getTarget, getPropName] = parseAttributeName(
    element,
    attribute.name,
    nameTokens
  );
  const firstNameTokenValue = nameTokens[0].value;
  const referenceOwnProperties =
    firstNameTokenValue === "change" ||
    firstNameTokenValue === "each" ||
    firstNameTokenValue === "repeat";

  const valTokens = lex(attribute.value);
  const getValue = parse(
    element,
    attribute.name,
    valTokens,
    referenceOwnProperties
  );
  return [getTarget, getPropName, getValue];
};
