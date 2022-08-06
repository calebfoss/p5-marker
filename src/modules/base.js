import { pascalToCamel, pascalToKebab } from "./utils.js";

p5.prototype._customElements = [];
p5.prototype._registerElements = function () {
  p5.prototype._customElements.push(...arguments);
};

p5.prototype._defineProperties = function (obj) {
  for (const p in obj) {
    p5.prototype[p] = {};
  }
  Object.defineProperties(p5.prototype, obj);
};

p5.prototype._createFriendlyGlobalFunctionBinderBase =
  p5.prototype._createFriendlyGlobalFunctionBinder;
p5.prototype._createFriendlyGlobalFunctionBinder = function (options = {}) {
  return (prop, value) => {
    const descriptor = Object.getOwnPropertyDescriptor(p5.prototype, prop);
    const globalObject = options.globalObject || window;
    if (typeof descriptor === "undefined" || descriptor.writable)
      return this._createFriendlyGlobalFunctionBinderBase(options)(prop, value);
    return Object.defineProperty(globalObject, prop, descriptor);
  };
};

const logicKeyWordToAttribute = new Map([
  ["if", "show_if"],
  ["else", "else_show"],
  ["else if", "else_show_if"],
  ["while", "repeat_while"],
]);
const logicAttributeToKeyword = new Map(
  Array.from(logicKeyWordToAttribute, (a) => a.reverse())
);
const attrIsLogic = (val) => {
  const logicNames = logicKeyWordToAttribute.values();
  const checkNames = () => {
    const logicName = logicNames.next();
    if (logicName.value === val) return true;
    if (logicName.done) return false;
    return checkNames();
  };
  return checkNames();
};

const P5Extension = (baseClass) =>
  class P5Extension extends baseClass {
    constructor() {
      super();
      [this.settings, this.vars, this.logic] = this.parseAttributes();
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
    get assignStrings() {
      return this.vars.map((attr) => {
        const init =
          this.varInitialized(attr) || P5Element.isP5(attr) ? "" : "let ";
        if (this.getAttr(attr).length === 0) return `${init}${attr};`;
        return `${init}${attr} = ${this.getAttr(attr)};`;
      });
    }
    getAttr = this.getAttribute;
    getInheritedAttr(attrName) {
      if (this.parentElement.hasAttr(attrName))
        return this.parentElement.getAttr(attrName);
      return this.parentElement.getInheritedAttr();
    }
    hasAttr = this.hasAttribute;
    setAttr = this.setAttribute;
    get isBlock() {
      return this.vars.length + this.settings.length > 0 || this.logic !== null;
    }
    get blockEnd() {
      if (this.isBlock) return "}";
      return "";
    }
    get blockStart() {
      if (this.isBlock === false) return "";
      if (this.logic === null) return "{";
      if (this.logic === logicKeyWordToAttribute.get("else")) return "else {";
      return `${logicAttributeToKeyword.get(this.logic)} (${this.getAttr(
        this.logic
      )}) {`;
    }
    get childStrings() {
      if (this.children.length === 0) return [];
      return Array.from(this.children)
        .map((child) => child.codeStrings || [])
        .flat();
    }
    get codeStrings() {
      return [
        " ",
        this.comment,
        this.blockStart,
        ...[
          this.pushStr,
          ...this.setStrings,
          ...this.assignStrings,
          this.fnStr,
          ...this.childStrings,
          this.innerEnd,
          this.popStr,
        ].map(P5Element.addTab, this),
        this.blockEnd,
      ].filter((line) => line.length);
    }
    get comment() {
      return `// ${this.html.replace(/(?:\r\n|\r|\n)/g, "")}`;
    }
    static get elementName() {
      return `p-${pascalToKebab(this.name)}`;
    }
    get fnStr() {
      return "";
    }
    get html() {
      return this.outerHTML.replace(this.innerHTML, "");
    }
    get innerEnd() {
      return "";
    }
    static isP5(name) {
      return p5.prototype.hasOwnProperty(name);
    }
    parseAttributes() {
      return Array.from(this.attributes).reduce(
        ([s, v, l], { name: attr }) => {
          if (P5Element.isP5(attr)) return [s.concat(attr), v, l];
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
    }
    get pushStr() {
      if (this.settings.length) return "push();";
      return "";
    }
    get popStr() {
      if (this.settings.length) return "pop();";
      return "";
    }
    //  Create string to call functions for each setting
    get setStrings() {
      return this.settings.map((s) => `${s} = ${this.getAttr(s)};`);
    }
    varInitialized(varName) {
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
    this.setAttr(this.params[0], 0);
    this.setAttr(this.params[1], 0);
    this.settings.unshift("anchor");
  }
  setParamsFromOverloads() {
    super.setParamsFromOverloads();
    if (
      (this.hasAttr("angle") || this.hasAttr("scaling")) &&
      !this.hasAttr("anchor")
    )
      this.setAnchorToXY();
  }
}

p5.prototype.assignCanvas = function (c, r) {
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

p5.prototype._registerElements(
  class _ extends P5Element {
    constructor() {
      super();
    }
  },
  class Sketch extends P5Extension(HTMLCanvasElement) {
    constructor() {
      super();
      //  Remove 'is' attribute from vars
      this.vars = this.vars.filter((v) => v !== "is" && v != "renderer");

      const setParams = (el) => {
        el.setParamsFromOverloads?.();
        for (let i = 0; i < el.children.length; i++) {
          const child = el.children.item(i);
          setParams(child);
        }
      };

      const runCode = () => {
        setParams(this);

        console.log(this.codeString);

        Function("canvas", this.codeString)(this);
      };
      window.addEventListener("customElementsDefined", runCode);
    }
    get codeString() {
      return [
        this.comment,
        ...this.initStrings,

        " ",
        "this.setup = function() {",
        ...[this.fnStr, ...this.setStrings, ...this.assignStrings].map(
          this.constructor.addTab,
          this
        ),
        "}",
        " ",
        `this.draw = function() {`,
        ...[...this.childStrings].map(this.constructor.addTab, this),
        "}",
      ].join("\n");
    }
    static constructorOptions = { extends: "canvas" };
    get fnStr() {
      const renderer = this.getAttribute("renderer");
      if (!renderer) return "assignCanvas(canvas);";
      return `assignCanvas(canvas, ${renderer});`;
    }
    get initStrings() {
      return this.vars.map((v) => `let ${v};`);
    }
    isBlock = true;
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
          }
          static elementName = name;
          fnStr = "";
        }
      );
    }
  },
  class Update extends P5Element {
    constructor() {
      super();
      if (this.parentElement.hasAttribute("cond")) {
        this.vars.push("cond");
        this.cond = this.parentElement.getAttribute("cond");
      }
    }
  }
);
