import { camelToSnake, pascalToCamel, pascalToKebab } from "../caseConvert";

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

p5.prototype.state = {};

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

p5.prototype._defineSnakeAlias = (...propNames) =>
  propNames.forEach(
    (propName) =>
      (p5.prototype[camelToSnake(propName)] = p5.prototype[propName])
  );

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
      this.storeEvalFns();
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
    storeEvalFn(attr) {
      const varNameExp =
        /(?<![a-z\_\$\.])[a-z][a-z0-9\_\$]*(?=(?:[^"'`]*["'`][^"'`]*["'`])*[^"'`]*$)/gi;
      const localVars = [];
      const fnStr =
        "return " +
        attr.value.replace(varNameExp, (varName) => {
          if (this.constructor.isP5(varName)) return "p." + varName;
          localVars.push(varName);
          return "_." + varName;
        });
      const evalFn = new Function("p", "_", fnStr);
      this.attrEvals.set(attr.name, evalFn);
    }
    storeEvalFns() {
      const { attributes } = this;
      for (let i = 0; i < attributes.length; i++) {
        this.storeEvalFn(attributes[i]);
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
    evalAttr(p, _, attrName) {
      const evalFn = this.attrEvals.get(attrName);
      if (typeof evalFn !== "function")
        return console.error(
          `${this.constructor.elementName} couldn't get ${attrName}`
        );
      return evalFn(p, _);
    }
    assignAttrVals(p, inherited) {
      const assigned = Object.assign({}, inherited);
      const vars = this.vars.concat(this.settings);
      for (let i = 0; i < vars.length; i++) {
        const attrName = vars[i];
        const props = attrName.split(".");
        const val = this.evalAttr(p, inherited, attrName);
        if (P5Element.isP5(props[0])) {
          let target = p;
          const propCount = props.length;
          for (let i = 0; i < propCount - 1; i++) {
            target = p[props[i]];
          }
          const [lastProp] = props.slice(-1);
          target[lastProp] = val;
        } else assigned[attrName] = val;
      }
      return assigned;
    }
    draw(p, inherited) {
      const ifAttr = logicKeyWordToAttribute.get("if");
      if (
        this.logic === ifAttr &&
        this.evalAttr(p, inherited, ifAttr) === false
      )
        return;
      const elseAttr = logicKeyWordToAttribute.get("else");
      const elseIfAttr = logicKeyWordToAttribute.get("else if");
      const prevSib = this.previousElementSibling;
      if (
        (this.logic === elseAttr || this.logic === elseIfAttr) &&
        prevSib.evalAttr(p, inherited, prevSib.logic)
      )
        return;
      if (
        this.logic === elseIfAttr &&
        this.evalAttr(p, inherited, elseIfAttr) === false
      )
        return;
      p.push();
      const assigned = this.assignAttrVals(p, inherited);
      this.renderToCanvas?.(p, assigned);
      this.drawChildren(p, assigned);
      const whileKeyword = logicKeyWordToAttribute.get("while");
      if (
        this.logic === whileKeyword &&
        this.evalAttr(p, assigned, whileKeyword) === true
      )
        this.draw(p, assigned);
      this.endRender?.(p, assigned);
      p.pop();
    }
    drawChildren(p, assigned) {
      for (let c = 0; c < this.children.length; c++) {
        this.children[c].draw(p, assigned);
      }
    }
    static get elementName() {
      return `p-${pascalToKebab(this.name)}`;
    }
    get html() {
      return this.outerHTML.replace(this.innerHTML, "");
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
  renderToCanvas(p, assigned) {
    const args = this.params.map((p) => assigned[p]);
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

        const canvas = this;

        const sketch = (p) => {
          p.setup = function () {
            const renderer = canvas.hasAttr("renderer")
              ? canvas.evalAttr(p, {}, "renderer")
              : null;
            p.assignCanvas(canvas, renderer);
            const baseState = canvas.assignAttrVals(p, {});

            p.draw = function () {
              canvas.drawChildren(p, baseState);
            };
          };
        };
        new p5(sketch);
      };
      window.addEventListener("customElementsDefined", runCode);
    }
    static constructorOptions = { extends: "canvas" };
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
            this.storeEvalFns();
          }
          static elementName = name;
          renderToCanvas = null;
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
