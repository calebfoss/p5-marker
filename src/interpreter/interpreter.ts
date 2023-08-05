import { Base } from "../elements/base";
import { lex } from "./lexer";
import { parseAttribute, parseExpression } from "./parser";
import { IdentifierToken } from "./tokens";

export const interpret = (
  element: Base,
  base_updaters: (() => void)[],
  each_updaters: (() => void)[],
  then_updaters: (() => void)[],
  repeat_getter: { get: () => boolean },
  attribute: Attr
) => {
  const nameTokens = lex(attribute.name);
  const valTokens = lex(attribute.value);
  const [firstNameToken] = nameTokens;
  if (!(firstNameToken instanceof IdentifierToken))
    throw new Error(`Attribute name must begin with property identifier`);
  if (firstNameToken.value === "repeat") {
    const getRepeatValue = parseExpression(
      () => element,
      valTokens
    ) as () => boolean;
    repeat_getter.get = getRepeatValue;
  } else if (
    firstNameToken.value === "each" ||
    firstNameToken.value === "then"
  ) {
    const [getOwner, getPropertyKey, getValue] = parseAttribute(
      nameTokens,
      valTokens,
      element,
      element
    );
    const updater = () => {
      getOwner()[getPropertyKey()] = getValue();
    };
    if (firstNameToken.value === "each") {
      each_updaters.push(updater);
      return;
    }
    then_updaters.push(updater);
    return;
  } else {
    const [getOwner, getPropertyKey, getValue] = parseAttribute(
      nameTokens,
      valTokens,
      element.parent,
      element.base
    );
    const updater = () => {
      getOwner()[getPropertyKey()] = getValue();
    };
    base_updaters.push(updater);
    return;
  }
};
