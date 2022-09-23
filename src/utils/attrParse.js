export class AttrParseUtil {
  static {
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
    this.regex = {
      legalVarName,
      notExistingObjProp,
      notNewObjProp,
      notBoolean,
      notNewKeyword,
      notProceededByOpenString,
      varName,
    };
  }
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
    const isObject = items.some((item) => item.match(/^[^\?\{]*:/gi));
    if (items.length === 1 && !isObject) return str;
    const isUnenclosed = str.match(/^[^\(]*[,:]/gi) !== null;
    if (!isUnenclosed) return str;
    if (isObject) return `{${str}}`;
    return `[${str}]`;
  };
  static escapes = { LESS_THAN: "<", GREATER_THAN: ">", AND: "&&" };
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
  static getOwnerName(el, prop) {
    if (
      AttrParseUtil.keywords.includes(prop) ||
      prop in AttrParseUtil.escapes ||
      prop in globalThis
    )
      return "none";
    if (AttrParseUtil.isP5(prop)) return "pInst";
    if (el.isPersistent(prop)) return "persistent";
    if (prop in el) return "this";
    return "assigned";
  }
  static getPrefix(el, prop) {
    const ownerName = AttrParseUtil.getOwnerName(el, prop);
    if (ownerName === "none") return "";
    if (ownerName === "this") return "this.";
    else return `_${ownerName}.`;
  }
  static replacePropName(el, prop) {
    if (prop in AttrParseUtil.escapes) return AttrParseUtil.escapes[prop];
    return AttrParseUtil.getPrefix(el, prop) + prop;
  }
  static replacePropNames(el, str) {
    return str.replace(AttrParseUtil.regex.varName, (prop) =>
      AttrParseUtil.replacePropName(el, prop)
    );
  }
}
