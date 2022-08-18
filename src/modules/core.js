import { pascalToCamel, pascalToKebab } from "../utils/caseConvert";
import { AttrParseUtil } from "../utils/attrParse";
import { registerElements, wrapMethod } from "../utils/p5Modifiers";

p5.prototype._customElements = [];

wrapMethod(
  "_createFriendlyGlobalFunctionBinder",
  (base) =>
    function (options = {}) {
      return (prop, value) => {
        const descriptor = Object.getOwnPropertyDescriptor(p5.prototype, prop);
        const globalObject = options.globalObject || window;
        if (typeof descriptor === "undefined" || descriptor.writable)
          return base.call(this, options)(prop, value);
        return Object.defineProperty(globalObject, prop, descriptor);
      };
    }
);

p5.prototype.IF = p5.prototype.WHEN = "if";
p5.prototype.ELSE = "else";
const logicKeys = {
  WHILE: "repeat_while",
  WHILE_NOT: "repeat_until",
};

const attrIsLogic = (val) => {
  const logicNames = Object.values(logicKeys);
  return logicNames.includes(val);
};

const P5Extension = (baseClass) =>
  class P5Extension extends baseClass {
    constructor() {
      super();
    }
    static addTab(line) {
      return line.length && this.isBlock ? "\t" + line : line;
    }
    attrEvals = new Map();
    get attrNames() {
      let anchorIndex = -1;
      const names = Array.from(this.attributes).map(({ name }, i) => {
        if (name === "anchor") anchorIndex = i;
        return name;
      });
      if (anchorIndex <= 0) return names;
      return ["anchor"]
        .concat(names.slice(0, anchorIndex))
        .concat(names.slice(anchorIndex + 1));
    }
    setupEvalFn(attr) {
      const attrJsStr = attr.value;
      //  TODO - catch improperly ordered quote marks: "foo'var"'
      if (AttrParseUtil.allQuotesMatched(attrJsStr) === false)
        console.error(
          `It looks like a ${this.constructor.elementName}'s ${attr.name} ` +
            `attribute has an open string. Check that each string has a beginning and end character.`
        );
      const attrNameVarsReplaced = AttrParseUtil.replaceVarNames(
        this,
        attr.name
      );
      const attrValueVarsReplaced = AttrParseUtil.replaceVarNames(
        this,
        attrJsStr
      );
      const evalFnName = `${this.constructor.name}_${attr.name.replace(
        /[^a-z0-9]/g,
        "_"
      )}`;
      const fnHeader = `return function ${evalFnName}(_pInst, _persistent, _assigned) {`;
      const fnBody = `return ${attrNameVarsReplaced} = ${attrValueVarsReplaced};\n};`;
      const fnStr = [fnHeader, ...this.comments, fnBody].join("\n");
      const evalFn = new Function(fnStr)();
      this.attrEvals.set(attr.name, evalFn);
    }
    setupEvalFns() {
      const { WHILE, WHILE_NOT } = logicKeys;
      if (
        (this.logic === WHILE || this.logic === WHILE_NOT) &&
        !this.hasAttr("change")
      ) {
        console.error(
          `It looks like a ${this.constructor.elementName} has a ${this.logic} attribute ` +
            `but does not have a change attribute. The change attribute is required to ` +
            `prevent infinite loops`
        );
        this.removeAttribute(this.logic);
      }
      const { attributes } = this;
      for (let i = 0; i < attributes.length; i++) {
        this.setupEvalFn(attributes[i]);
      }
    }
    getInheritedAttr(attrName) {
      if (this.parentElement.hasAttr(attrName))
        return this.parentElement.getAttr(attrName);
      return this.parentElement.getInheritedAttr();
    }
    getAttr = this.getAttribute;
    hasAttr = this.hasAttribute;
    setAttr = this.setAttribute;
    get comments() {
      return this.html
        .split(/(?:\r\n|\r|\n)/)
        .map((line) => line.match(/.{1,80}/g))
        .flat()
        .map((line) => "//\t" + line);
    }
    evalAttr(pInst, persistent, assigned, attrName) {
      const evalFn = this.attrEvals.get(attrName);
      if (typeof evalFn !== "function") return;
      return evalFn(pInst, persistent, assigned);
    }
    assignAttrVals(p, persistent, inherited) {
      const assigned = Object.assign({}, inherited);
      const { attrNames } = this;
      for (let i = 0; i < attrNames.length; i++) {
        this.evalAttr(p, persistent, assigned, attrNames[i]);
      }
      return assigned;
    }
    draw(p, persistent, inherited) {
      if (this.showSelf(p, persistent, inherited) === false) return;
      p.push();
      const assigned = this.assignAttrVals(p, persistent, inherited);
      this.drawIteration(p, persistent, assigned);
      p.pop();
    }
    drawIteration(p, persistent, assigned) {
      const { WHILE, WHILE_NOT } = logicKeys;
      let repeat = true;
      while (repeat) {
        this.renderToCanvas?.(p, persistent, assigned);
        this.drawChildren(p, persistent, assigned);
        const changeObj = this.hasAttr("change")
          ? this.evalAttr(p, persistent, assigned, "change")
          : {};
        assigned = { ...assigned, ...changeObj };
        const whileCond =
          this.logic === WHILE && this.evalAttr(p, persistent, assigned, WHILE);
        const whileNotCond =
          this.logic === WHILE_NOT &&
          this.evalAttr(p, persistent, assigned, WHILE_NOT) === false;
        this.endRender?.(p, assigned);
        repeat = whileCond || whileNotCond;
      }
    }
    drawChildren(p, persistent, assigned) {
      for (let c = 0; c < this.children.length; c++) {
        this.children[c].draw(p, persistent, assigned);
      }
    }
    static get elementName() {
      return `p-${pascalToKebab(this.name)}`;
    }
    get html() {
      return this.outerHTML.replace(this.innerHTML, "");
    }
    isPersistent(attrName) {
      if (this instanceof HTMLCanvasElement) return this.hasAttr(attrName);
      return this.parentElement?.isPersistent?.(attrName);
    }
    rootCondition(
      p,
      persistent,
      inherited,
      caller = this,
      sib = this.previousElementSibling
    ) {
      if (sib.hasAttr("show") === false) {
        console.error(
          `${caller.constructor.elementName} has a show attribute` +
            `with an ELSE key, but none of its previous siblings have an IF key. ` +
            "Elements with an ELSE key only work if a previous sibling has an IF key."
        );
        return true;
      }
      const [key, ...conditions] = sib.evalAttr(
        p,
        persistent,
        inherited,
        "show"
      );
      const allTrue = conditions.every((c) => c);
      if (allTrue) return true;
      if (key !== p5.prototype.IF)
        return this.rootCondition(
          p,
          persistent,
          inherited,
          caller,
          sib.previousElementSibling
        );
    }
    showSelf(p, persistent, inherited) {
      const { IF } = p5.prototype;
      if (this.hasAttr("show") === false) return true;
      const attrVal = this.evalAttr(p, persistent, inherited, "show");
      const [key, ...conditions] = Array.isArray(attrVal) ? attrVal : [attrVal];
      const allTrue = conditions.every((c) => c);
      if (allTrue === false) return false;
      if (key === IF) return true;
      return !this.rootCondition(p, persistent, inherited);
    }
    varInitialized(varName) {
      const [obj, ...props] = varName.split(".");
      if (props.length) return this.varInitialized(obj);
      if (this.parentElement.hasAttribute(varName)) return true;
      if (this.parentElement.varInitialized)
        return this.parentElement.varInitialized(varName);
      return false;
    }
  };

export class P5Element extends P5Extension(HTMLElement) {}

export class P5Function extends P5Element {
  constructor(overloads) {
    super();
    this.overloads = overloads;
  }
  renderToCanvas(p, persistent, assigned) {
    const args = this.params.map((p) =>
      this.isPersistent(p) ? persistent[p] : assigned[p]
    );
    p[this.fnName](...args);
  }
  get fnName() {
    return pascalToCamel(this.constructor.name);
  }
  //  Create string to call function with provided arguments
  get fnStr() {
    return `${this.fnName}(${this.params.join(", ")});`;
  }

  setParamsFromOverloads() {
    const { overloads } = this;
    //  Check every required parameter has an attribute
    const isOptional = (param) => param.match(/^\[.*\]$/);
    let overloadMatch = false;
    //  Start with overloads with most parameters
    overloads.reverse();
    if (overloads.length === 0) return (this.params = []);
    for (const i in overloads) {
      const overloadParams = overloads[i].split(",").map((s) => s.trim());
      overloadMatch = overloadParams.every(
        (p) =>
          this.attrNames.includes(p) ||
          this.varInitialized(p) ||
          isOptional(p) ||
          p === ""
      );
      //  If matched overload found
      if (overloadMatch) {
        //  Filter params recursively
        const filterParams = (overloadParams, filteredParams = [], i = 0) => {
          //  If there are no more overload params, return filtered params
          if (i === overloadParams.length) return filteredParams;
          const optional = isOptional(overloadParams[i]);
          const p = overloadParams[i].replaceAll(/\[|\]/g, "");
          //  If param defined on this element, add it to filtered params
          if (this.attrNames.includes(p))
            return filterParams(overloadParams, filteredParams.concat(p), ++i);
          //  If not defined on this element and optional, return filtered params
          if (optional) return filteredParams;
          //  If required and already initialized, add it to filtered params
          if (this.varInitialized(p))
            return filterParams(overloadParams, filteredParams.concat(p), ++i);
          return filteredParams;
        };
        this.params = filterParams(overloadParams);
        return;
      }
    }
    console.error(
      `${
        this.constructor.elementName
      } has the following attributes: ${Array.from(this.attributes)
        .map(({ name }) => name)
        .join(", ")}\n` +
        `but it must have one of the following combinations of attributes:\n${overloads.join(
          "\n"
        )}\n\n` +
        this.outerHTML
    );
  }
}

export class PositionedFunction extends P5Function {
  constructor(overloads) {
    super(overloads);
  }
  setAnchorToXY() {
    const [xParam, yParam] = this.params.slice(0, 2);
    const x = this.getAttr(xParam) || this.getInheritedAttr(xParam);
    const y = this.getAttr(yParam) || this.getInheritedAttr(yParam);
    const anchorVal = `[${x}, ${y}]`;
    this.setAttr("anchor", anchorVal);
    this.setAttr(xParam, 0);
    this.setAttr(yParam, 0);
    const anchorAttr = this.attributes["anchor"];
    this.setupEvalFn(this.attributes[xParam]);
    this.setupEvalFn(this.attributes[yParam]);
    this.setupEvalFn(anchorAttr);
  }
  setParamsFromOverloads() {
    super.setParamsFromOverloads();
    //  If el has transform attrs but not anchor
    if (
      !this.hasAttr("anchor") &&
      (this.hasAttr("angle") ||
        this.hasAttr("scale_factor") ||
        this.hasAttr("shear"))
    )
      this.setAnchorToXY();
  }
}

p5.prototype.assignCanvas = function (c, r) {
  this.noCanvas();
  const mainDiv = document.querySelector("main");
  if (mainDiv.children.length === 0) mainDiv.remove();
  if (r === this.WEBGL) {
    this._setProperty("_renderer", new p5.RendererGL(c, this, true));
  } else {
    //P2D mode
    this._setProperty("_renderer", new p5.Renderer2D(c, this, true));
  }
  this._renderer._applyDefaults();
  this._setProperty("_elements", [this._renderer]);
  this.resizeCanvas(c.width, c.height);
};

p5.prototype.assets = {};

p5.prototype.loadAssets = async function () {
  const assetElements = Array.from(document.querySelectorAll("p-asset"));
  const pInst = this;
  const promises = assetElements.map((el) => el.load(pInst));
  const results = await Promise.all(promises);
  results.forEach(
    (result, i) => (this.assets[assetElements[i].getAttribute("name")] = result)
  );
  this._decrementPreload();
};
p5.prototype.registerPreloadMethod("loadAssets", p5.prototype);

registerElements(
  class _ extends P5Element {
    constructor() {
      super();
    }
  },
  class Canvas extends P5Extension(HTMLCanvasElement) {
    constructor() {
      super();
      window.addEventListener("customElementsDefined", this.runCode.bind(this));
    }
    static constructorOptions = { extends: "canvas" };
    get attrNames() {
      //  Remove 'is' and 'style' from attrNames
      return super.attrNames.filter((v) => v !== "is" && v != "style");
    }
    runCode() {
      Canvas.setupElement(this);

      const canvas = this;

      const sketch = (pInst) => {
        const persistent = {};

        pInst.preload = () => pInst.loadAssets();

        pInst.setup = function () {
          const renderer = canvas.hasAttr("renderer")
            ? canvas.evalAttr(pInst, {}, {}, "renderer")
            : null;
          pInst.assignCanvas(canvas, renderer);
          canvas.assignAttrVals(pInst, persistent, {});
        };

        pInst.draw = function () {
          canvas.drawChildren(pInst, persistent, {});
        };
      };
      new p5(sketch);
    }
    static setupElement = (el) => {
      el.parseAttributes?.();
      el.setupEvalFns?.();
      el.setParamsFromOverloads?.();
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children.item(i);
        Canvas.setupElement(child);
      }
    };

    varInitialized(varName) {
      if (this.attrNames.includes(varName)) return true;
      return super.varInitialized(varName);
    }
  },
  class Custom extends P5Function {
    constructor() {
      super(["name, [attributes]"]);
      if (this.getAttr("name").slice(0, 2) !== "p-")
        this.setAttr("name", "p-" + this.getAttr("name"));
      const name = this.getAttr("name");
      const attributes = this.getAttr("attributes");
      const custom = this;
      customElements.define(
        this.getAttr("name"),
        class extends P5Function {
          constructor() {
            super([attributes]);
            Array.from(custom.attributes).forEach((a) =>
              this.setAttr(a.name, a.value)
            );
            const childClones = Array.from(custom.children).map((child) =>
              child.cloneNode(true)
            );
            this.prepend(...childClones);
            this.setupEvalFns();
          }
          static elementName = name;
          renderToCanvas = null;
        }
      );
    }
  },
  class Asset extends HTMLElement {
    constructor() {
      super();
    }
    static loadFns = {
      image: "loadImage",
      font: "loadFont",
      json: "loadJSON",
      strings: "loadStrings",
      table: "loadTable",
      xml: "loadXML",
      bytes: "loadBytes",
      get: "httpGet",
      shader: "loadShader",
    };
    static elementName = "p-asset";
    async load(pInst) {
      if (this.data) return this.data;
      const loadFn = Asset.loadFns[this.getAttribute("type").toLowerCase()];
      const path = this.getAttribute("path");
      this.data = await pInst[loadFn](path);
      return this.data;
    }
  },
  class Sketch extends HTMLLinkElement {
    constructor() {
      super();
      this.loadXML(this.href);
    }
    static constructorOptions = { extends: "link" };
    convertElement(xmlEl) {
      const xmlTag = xmlEl.tagName;
      if (xmlTag === "canvas")
        return document.createElement("canvas", { is: "p-canvas" });
      return document.createElement(`p-${xmlTag}`);
    }
    convertAllElements(xmlEl, parent = document.body) {
      const pEl = this.convertElement(xmlEl);
      this.copyAttributes(xmlEl, pEl);
      parent.appendChild(pEl);
      for (let i = 0; i < xmlEl.children.length; i++) {
        this.convertAllElements(xmlEl.children[i], pEl);
      }
    }
    convertXML(e) {
      const xml = e.target.response.documentElement;
      this.convertAllElements(xml);
      document.querySelectorAll("canvas").forEach((canvas) => canvas.runCode());
    }
    copyAttributes(orig, copy) {
      const attrs = orig.attributes;
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        copy.setAttribute(attr.name, attr.value);
      }
    }
    loadXML(path) {
      if (!path)
        return console.error(
          "p-sketch element is missing required path attribute"
        );
      const request = new XMLHttpRequest();
      request.open("GET", path);
      request.responseType = "document";
      request.overrideMimeType("text/xml");
      request.addEventListener("load", this.convertXML.bind(this));
      request.send();
    }
    static elementName = "p-sketch";
  }
);
