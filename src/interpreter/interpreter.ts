import { Base } from "../elements/base";
import { lex } from "./lexer";
import { parseAttribute } from "./parser";
import { IdentifierToken } from "./tokens";

export const interpret = (
  element: Base,
  updaters: (() => void)[],
  attribute: Attr
) => {
  if (attribute.name === "id") return;
  const nameTokens = lex(attribute.name);
  const valTokens = lex(attribute.value);
  const [firstNameToken] = nameTokens;
  if (!(firstNameToken instanceof IdentifierToken))
    throw new Error(`Attribute name must begin with property identifier`);
  const [nameReference, valueReference] = (() => {
    switch (firstNameToken.value) {
      case "each":
      case "then":
      case "repeat":
        return [element, element];
      default:
        return [element.base, element.parentElement];
    }
  })();
  const [getOwner, getPropertyKey, getValue] = parseAttribute(
    nameTokens,
    valTokens,
    nameReference,
    valueReference
  );
  const updater = () => {
    getOwner()[getPropertyKey()] = getValue;
  };
  updaters.push(updater);
};
