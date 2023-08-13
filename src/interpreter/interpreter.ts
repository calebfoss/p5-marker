import { Base, GettersFor } from "../elements/base";
import { lex } from "./lexer";
import { parseAttribute } from "./parser";
import { IdentifierToken, SquareBracketToken } from "./tokens";

export const interpret = (
  element: Base,
  dynamicAssigners: (() => void)[],
  attribute: Attr,
  base: GettersFor<Base>,
  each: GettersFor<Base>,
  then: GettersFor<Base>
) => {
  if (attribute.name === "id") return;
  const nameTokens = lex(attribute.name);
  const valTokens = lex(attribute.value);
  const [firstNameToken] = nameTokens;
  if (!(firstNameToken instanceof IdentifierToken))
    throw new Error(`Attribute name must begin with property identifier`);
  const constantValue = valTokens.every(
    (token) => !(token instanceof IdentifierToken)
  );
  const [assignTo, getValuesFrom, leftTokens] = (() => {
    switch (firstNameToken.value) {
      case "each":
        return [each, element, nameTokens.slice(1)];
      case "then":
        return [then, element, nameTokens.slice(1)];
      case "repeat":
        return [element, element, nameTokens];
      case "on":
        return [element, element.parentElement, nameTokens];
      default:
        if (constantValue) return [element, element.parentElement, nameTokens];
        return [base, element.parentElement, nameTokens];
    }
  })();
  const [getOwner, getPropertyKey, getValue] = parseAttribute(
    leftTokens,
    valTokens,
    assignTo,
    getValuesFrom
  );
  if (constantValue) {
    getOwner()[getPropertyKey()] = getValue();
    return;
  }
  const updater = () => {
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
