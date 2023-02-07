const notExistingObjProp = "(?<![^\\.]\\.)";
const legalVarName = "\\b[a-z$_][a-z0-9$_]*\\b";
const notNewObjProp = "(?:(?!\\s*:)|(?<=\\?[^,]*))";
const notBoolean = "(?<!\\btrue\\b)(?<!\\bfalse\\b)";
const notNewKeyword = "(?<!\\bnew\\b)";
const notProceededByOpenString = "(?=(?:[^\"'`](?:([\"'`]).*\\1)*)*$)";
const varName = new RegExp(
  notExistingObjProp +
    legalVarName +
    notNewObjProp +
    notBoolean +
    notNewKeyword +
    notProceededByOpenString,
  "gi"
);

export class AttrParseUtil {
  static regex = {
    legalVarName,
    notExistingObjProp,
    notNewObjProp,
    notBoolean,
    notNewKeyword,
    notProceededByOpenString,
    varName,
  };
  static allQuotesMatched(str) {
    const quoteExps = [/"/g, /'/g, /`/g];
    for (const i in quoteExps) {
      const matches = str.match(quoteExps[i]);
      if (matches && matches.length % 2 !== 0) return false;
    }
    return true;
  }
  static enclose = (str) => {
    const strMinusStrings = str.replace(/(["'`]).*?\1/gi, "");
    const items = strMinusStrings.split(/(?<!{[^}]*),/gi);
    const isObject = strMinusStrings.match(/^[^\?\{]*:/gi);
    if (items.length === 1 && !isObject) return str;
    const isUnenclosed = str.match(/(?<!\([^\)]*)(?<!{[^}]*)[,:]/gi) !== null;
    if (!isUnenclosed) return str;
    if (isObject) return `{${str}}`;
    return `[${str}]`;
  };
  static escapes = {
    less_than: "<",
    greater_than: ">",
    at_least: ">=",
    no_more_than: "<=",
    and: "&&",
    or: "||",
    while: "",
  };
  static isP5 = (name) => p5.prototype.hasOwnProperty(name);
  static keywords = [
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "return",
    "static",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
  ];
  static getOwnerName(el, prop, canReferenceSelf = false) {
    if (
      (canReferenceSelf && prop in el) ||
      [
        "this_element",
        "parent",
        "above_sibling",
        "above_siblings_off",
      ].includes(prop)
    )
      return "this";
    if (el.parent && prop in el.parent) return "this.parent";
    if (
      AttrParseUtil.keywords.includes(prop) ||
      prop in AttrParseUtil.escapes ||
      prop in globalThis
    )
      return "none";
    //  TODO - remove this temporary check when no longer needed
    if (prop in el.pInst && prop !== "width" && prop !== "height")
      return "this.pInst";
    console.error(
      `${el.tagName} is referencing ${prop}, but this property cannot be found on its parents or further up the inheritance.`
    );
    return "this.parent";
  }
  static getPrefix(el, prop, canReferenceSelf = false) {
    const ownerName = AttrParseUtil.getOwnerName(el, prop, canReferenceSelf);
    if (ownerName === "none") return "";
    if (ownerName.slice(0, 4) === "this") return `${ownerName}.`;
    else return `_${ownerName}.`;
  }
  static replacePropName(el, prop, canReferenceSelf = false) {
    if (prop in AttrParseUtil.escapes) return AttrParseUtil.escapes[prop];
    return AttrParseUtil.getPrefix(el, prop, canReferenceSelf) + prop;
  }
  static replacePropNames(el, str, canReferenceSelf = false) {
    return str
      .replace(/until(.*)/, "!($1)")
      .replace(AttrParseUtil.regex.varName, (prop) =>
        AttrParseUtil.replacePropName(el, prop, canReferenceSelf)
      );
  }
}
