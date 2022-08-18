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

const logicKeys = {
  IF: "show_if",
  ELSE: "else_show",
  ELSE_IF: "else_show_if",
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
    anchorFirst() {
      const anchorIndex = this.settings.indexOf("anchor");
      this.settings = ["anchor"].concat(
        this.settings.slice(0, anchorIndex),
        this.settings.slice(anchorIndex + 1)
      );
    }
    attrEvals = new Map();
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
      if (typeof evalFn !== "function")
        return console.error(
          `${this.constructor.elementName} couldn't get ${attrName}`
        );
      return evalFn(pInst, persistent, assigned);
    }
    assignAttrVals(p, persistent, inherited) {
      const assigned = Object.assign({}, inherited);
      const vars = this.settings.concat(this.vars);
      for (let i = 0; i < vars.length; i++) {
        this.evalAttr(p, persistent, assigned, vars[i]);
      }
      return assigned;
    }
    draw(p, persistent, inherited) {
      const { IF, ELSE, ELSE_IF } = logicKeys;
      if (
        this.logic === IF &&
        this.evalAttr(p, persistent, inherited, IF) === false
      )
        return;
      const prevSib = this.previousElementSibling;
      if (
        (this.logic === ELSE || this.logic === ELSE_IF) &&
        prevSib.evalAttr(p, persistent, inherited, prevSib.logic)
      )
        return;
      if (
        this.logic === ELSE_IF &&
        this.evalAttr(p, persistent, inherited, ELSE_IF) === false
      )
        return;
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
    parseAttributes() {
      [this.settings, this.vars, this.logic] = Array.from(
        this.attributes
      ).reduce(
        ([s, v, l], { name: attr }) => {
          if (AttrParseUtil.isP5(attr)) return [s.concat(attr), v, l];
          if (attrIsLogic(attr)) {
            if (l !== null) {
              console.error(
                `${this.constructor.elementName} has ${l} and ${attr} attributes, but can have only one.`
              );
              return [s, v, l];
            }
            return [s, v.concat(attr), attr];
          }
          return [s, v.concat(attr), l];
        },
        [[], [], null]
      );
      if (this.hasAttr("anchor")) this.anchorFirst();
    }
    isPersistent(attrName) {
      if (this instanceof HTMLCanvasElement) return this.hasAttr(attrName);
      return this.parentElement?.isPersistent?.(attrName);
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
    if (overloads.length === 0) return [[], this.vars];
    for (const i in overloads) {
      const overloadParams = overloads[i].split(",").map((s) => s.trim());
      overloadMatch = overloadParams.every(
        (p) =>
          this.vars.includes(p) ||
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
          if (this.vars.includes(p))
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
    this.settings.unshift("anchor");
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
    parseAttributes() {
      super.parseAttributes();
      //  Remove 'is' attribute from vars
      this.vars = this.vars.filter((v) => v !== "is");
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
      if (this.vars.includes(varName)) return true;
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
            const addAttribute = (obj, arr, attr) => {
              arr.push(attr);
              obj.setAttr(attr, custom.getAttr(attr));
            };
            custom.settings.forEach((s) =>
              addAttribute(this, this.settings, s)
            );
            custom.vars.forEach((v) => {
              if (v !== "name" && v != "attributes")
                addAttribute(this, this.vars, v);
            });
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
