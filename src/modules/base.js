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
    attrEvals = new Map();
    setupEvalFn(attr) {
      const varNameExp =
        /(?<![a-z\_\$\.])[a-z][a-z0-9\_\$]*(?=(?:[^"'`]*["'`][^"'`]*["'`])*[^"'`]*$)/gi;
      const evalFnName = `${this.constructor.name}_${attr.name}`;
      const fnHeader = `return function ${evalFnName}(_p5Inst, _persistent, _assigned) {`;
      const fnBody = `return ${attr.value.replace(varNameExp, (varName) => {
        if (this.constructor.isP5(varName)) return "_p5Inst." + varName;
        if (this.isPersistent(varName)) return "_persistent." + varName;
        return "_assigned." + varName;
      })};\n};`;
      const fnStr = [fnHeader, ...this.comments, fnBody].join("\n");
      const evalFn = new Function(fnStr)();
      this.attrEvals.set(attr.name, evalFn);
    }
    setupEvalFns() {
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
    evalAttr(p5Inst, persistent, assigned, attrName) {
      const evalFn = this.attrEvals.get(attrName);
      if (typeof evalFn !== "function")
        return console.error(
          `${this.constructor.elementName} couldn't get ${attrName}`
        );
      return evalFn(p5Inst, persistent, assigned);
    }
    assignAttrVals(p, persistent, inherited) {
      const assigned = Object.assign({}, inherited);
      const vars = this.vars.concat(this.settings);
      for (let i = 0; i < vars.length; i++) {
        const attrName = vars[i];
        const propNames = attrName.split(".");
        const [basePropName] = propNames;
        const val = this.evalAttr(p, persistent, inherited, attrName);
        const modifyProperty = (obj, propNameArray) => {
          let target = obj;
          const propCount = propNameArray.length;
          for (let i = 0; i < propCount - 1; i++) {
            target = p[propNames[i]];
          }
          const [lastProp] = propNames.slice(-1);
          target[lastProp] = val;
        };
        if (P5Element.isP5(basePropName)) {
          modifyProperty(p, propNames);
        } else if (this.isPersistent(basePropName)) {
          modifyProperty(persistent, propNames);
        } else assigned[attrName] = val;
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
      this.renderToCanvas?.(p, assigned);
      this.drawChildren(p, persistent, assigned);
      if (
        this.logic === WHILE &&
        this.evalAttr(p, persistent, assigned, WHILE) === true
      )
        this.draw(p, persistent, assigned);
      if (
        this.logic === WHILE_NOT &&
        this.evalAttr(p, persistent, assigned, WHILE_NOT) === false
      )
        this.draw(p, persistent, assigned);
      this.endRender?.(p, assigned);
      p.pop();
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
      this.vars = this.vars.filter((v) => v !== "is");

      const setupElement = (el) => {
        el.setupEvalFns?.();
        el.setParamsFromOverloads?.();
        for (let i = 0; i < el.children.length; i++) {
          const child = el.children.item(i);
          setupElement(child);
        }
      };

      const runCode = () => {
        setupElement(this);

        const canvas = this;

        const sketch = (p5Inst) => {
          const persistent = {};

          p5Inst.setup = function () {
            const renderer = canvas.hasAttr("renderer")
              ? canvas.evalAttr(p5Inst, {}, {}, "renderer")
              : null;
            p5Inst.assignCanvas(canvas, renderer);
            canvas.assignAttrVals(p5Inst, persistent, {});
          };

          p5Inst.draw = function () {
            canvas.drawChildren(p5Inst, persistent, {});
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
            this.setupEvalFns();
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
