import { Base, createProperty } from "../elements/base";
import { lex } from "./lexer";
import { parse } from "./parser";

export const interpret = (element: Base, attribute: Attr): void => {
  const nameTokens = lex(attribute.name);
  const valTokens = lex(attribute.value);
  const [action, getProperty, getValue] = parse(
    element,
    attribute.name,
    nameTokens,
    valTokens
  );
  switch (action) {
    case "change":
      element.addChange(getProperty, getValue);
      break;
    case "each":
      element.addEach(getProperty, getValue);
      break;
    default:
      const [firstNameToken] = nameTokens;
      const propertyName = firstNameToken.value;
      if (!(propertyName in element)) {
        element.propertyManager[propertyName] = createProperty(undefined);
        Object.defineProperty(element, propertyName, {
          get: () => element.propertyManager[propertyName].get(),
          set: (value) => {
            element.propertyManager[propertyName].set(value);
          },
        });
      }
      element.addGetter(getProperty, getValue);
  }
};
