export class AttrParseUtil {
  static {
    const notExistingObjProp = "(?<!\\.)";
    const legalVarName = "\\b[a-z$_][a-z0-9$_]*\\b(?!\\s*:)";
    const notNewObjProp = "(?!s*:[^{]*})";
    const notBoolean = "(?<!\\btrue\\b)(?<!\\bfalse\\b)";
    const notNewKeyword = "(?<!\\bnew\\b)";
    const notProceededByOpenString = "(?=(?:[^\"'`](?:([\"'`]).*\\1)*)*$)";
    const unenclosedList =
      /^[^[{\(]*?(?:(?:\[.*?])*(?:{.*?})*(?:\(.*?\))*)*,.*$/gi;
    const varName = new RegExp(
      notExistingObjProp +
        legalVarName +
        notExistingObjProp +
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
      unenclosedList,
      varName,
    };
  }
  static allQuotesMatched(str) {
    const quoteExps = [/"/g, /'/g, /`/g];
    for (const i in quoteExps) {
      const matches = str.match(quoteExps[i]);
      if (matches && matches.length % 2 !== 0) return false;
      return true;
    }
  }
  static encloseList = (str) =>
    str.replace(AttrParseUtil.regex.unenclosedList, "[$&]");
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
