import { Base } from "../elements/base";
import { lex } from "./lexer";
import { parseAttribute } from "./parser";
import { IdentifierToken, SquareBracketToken } from "./tokens";

export const interpret = (
  element: Base,
  dynamicAssigners: (() => void)[],
  attribute: Attr
) => {
  if (attribute.name === "id") return;
  const nameTokens = lex(attribute.name);
  const valTokens = lex(attribute.value);
  const [firstNameToken] = nameTokens;
  if (!(firstNameToken instanceof IdentifierToken))
    throw new Error(`Attribute name must begin with property identifier`);
  const [assignTo, getValuesFrom] = (() => {
    switch (firstNameToken.value) {
      case "each":
      case "then":
      case "repeat":
        return [element, element];
      case "on":
        return [element, element.parentElement];
      default:
        return [element.base, element.parentElement];
    }
  })();
  const [getOwner, getPropertyKey, getValue] = parseAttribute(
    nameTokens,
    valTokens,
    assignTo,
    getValuesFrom
  );
  const updater = () => {
    const test = getPropertyKey();
    getOwner()[getPropertyKey()] = getValue;
  };
  const leftSquareBracketIndex = nameTokens.findIndex(
    (token) => token instanceof SquareBracketToken && token.value === "["
  );
  if (leftSquareBracketIndex > -1) {
    const rightSquareBracketIndex = nameTokens.findLastIndex(
      (token) => token instanceof SquareBracketToken && token.value === "]"
    );
    const tokensInBetween = nameTokens.slice(
      leftSquareBracketIndex + 1,
      rightSquareBracketIndex
    );
    const isDynamic = tokensInBetween.some(
      (token) => token instanceof IdentifierToken
    );
    if (isDynamic) dynamicAssigners.push(updater);
  }
  updater();
};
