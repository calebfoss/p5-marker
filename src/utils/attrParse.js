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
  static isP5 = (name) => p5.prototype.hasOwnProperty(name);
  static replaceVarNames(el, str) {
    return str.replace(AttrParseUtil.regex.varName, (varName) => {
      if (globalThis.hasOwnProperty(varName)) return varName;
      if (AttrParseUtil.isP5(varName)) return "_pInst." + varName;
      if (el.isPersistent(varName)) return "_persistent." + varName;
      return "_assigned." + varName;
    });
  }
}
