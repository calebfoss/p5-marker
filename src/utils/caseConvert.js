//  regex
const upperCaseChar = /([A-Z])/g;
const upperCaseCharAfterFirst = /(?<!^)[A-Z]/g;

//  js string replace 2nd param
const prependMatch = (char) => char + "$&";

//  casing converters
export const camelToKebab = (camelStr) =>
  camelStr.replace(upperCaseCharAfterFirst, prependMatch("-")).toLowerCase();

export const camelToSnake = (camelStr) =>
  camelStr.replace(upperCaseCharAfterFirst, prependMatch("_")).toLowerCase();

export const kebabToCamel = (kebabStr) =>
  kebabStr.replace(/-./g, (s) => s[1].toUpperCase());

export const pascalToCamel = (pascalStr) =>
  pascalStr.slice(0, 1).toLowerCase() + pascalStr.slice(1);

export const pascalToKebab = (pascalStr) =>
  pascalToCamel(pascalStr).replaceAll(
    upperCaseChar,
    (c) => "-" + c.toLowerCase()
  );

export const pascalToSnake = (pascalStr) =>
  pascalToCamel(pascalStr).replaceAll(
    upperCaseChar,
    (c) => "_" + c.toLowerCase()
  );

export const snakeToCamel = (snakeStr) =>
  snakeStr
    .split("_")
    .map((s, i) => (i > 0 ? s.slice(0, 1).toUpperCase() + s.slice(1) : s))
    .join("");
