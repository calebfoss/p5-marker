import { pascalToCamel, pascalToKebab } from "../utils/caseConvert";
import { AttrParseUtil } from "../utils/attrParse";
import {
  registerElements,
  wrapMethod,
  defineProperties,
} from "../utils/p5Modifiers";

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
p5.prototype.WHILE = "while";
p5.prototype.UNTIL = "until";

p5.prototype.assignCanvas = function (c, r) {
  this.noCanvas();
  const mainDiv = document.querySelector("main");
  let index = 0;
  if (typeof c.id === "undefined") {
    while (document.querySelector(`p5MarkerCanvas${index}`)) index++;
  }
  c.id = `p5MarkerCanvas${index}`;
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
p5.prototype._debug_attributes = true;
defineProperties({
  object_assign: {
    set: function ([target, ...sources]) {
      Object.assign(target, ...sources);
    },
  },
  debug_attributes: {
    get: function () {
      return this._debug_attributes;
    },
    set: function (val) {
      const valType = typeof val;
      if (typeof val === "boolean") this._debug_attributes = val;
      else
        console.error(
          `debug_attributes was set to a value of type ${valType} but may only be set to a boolean true/false value.`
        );
    },
  },
});

const attributePriorities = new Map(
  ["debug_attributes", "anchor", "angle", "scale_factor", "shear"].map(
    (name, index) => [name, index]
  )
);

const P5Extension = (baseClass) =>
  class P5Extension extends baseClass {
    constructor() {
      super();
    }
    assignAttrVal(persistent, assigned, attrName, thisArg) {
      const val = this.evalAttr(persistent, assigned, attrName, thisArg);
      //  Setting canvas width or height resets the drawing context
      //  Only set the attribute if it's not one of those
      if (this.pInst.debug_attributes === false) return val;
      if (
        this instanceof HTMLCanvasElement &&
        (attrName !== "width" || attrName !== "height")
      )
        return val;

      //  Brackets will throw a 'not a valid attribute name' error
      if (attrName.match(/[\[\]]/)) return val;

      const valToString = (v) => {
        if (v instanceof p5.Color) return v.toString(this.pInst.color_mode);
        if (typeof v?.toString === "undefined") return v;
        return v.toString();
      };
      this.setAttr(attrName, valToString(val));
      return val;
    }
    assignAttrVals(persistent, inherited) {
      this.proxy = new Proxy(this, {
        get(target, prop) {
          if (prop in target) return target[prop];
          return target.evalAttr(persistent, assigned, prop);
        },
        set(target, prop, val) {
          const propOwnerName = AttrParseUtil.getOwnerName(target, prop);
          const assignmentFn = target.#assignmentFn(propOwnerName, prop, val);
          target.attrEvals.set(prop, assignmentFn);
          target.assignAttrVal(persistent, assigned, prop);
        },
      });
      const assigned = Object.assign({}, inherited, {
        this_element: this.proxy,
        parent_element: inherited.this_element,
      });
      const { orderedAttributeNames } = this;
      for (let i = 0; i < orderedAttributeNames.length; i++) {
        const attrName = orderedAttributeNames[i];
        this.assignAttrVal(persistent, assigned, attrName, this.proxy);
        if (i === this.transformDoneIndex)
          this.transform_matrix = this.pInst.transform_matrix;
      }
      return assigned;
    }
    #assignmentFn(ownerName, propName, val) {
      switch (ownerName) {
        case "pInst":
          return (pInst) => (pInst[propName] = val);
        case "persistent":
          return (_, persistent) => (persistent[propName] = val);
        case "assigned":
          return (_, __, assigned) => (assigned[propName] = val);
        default:
          return () => (propName = val);
      }
    }
    attrEvals = new Map();
    change(persistent, assigned) {
      const change = this.assignAttrVal(persistent, assigned, "change");
      let changed = false;
      const assignProp = (obj, prop) => {
        if (prop in obj) {
          const changeVal = change[prop];
          changed ||= obj[prop] !== changeVal;
          obj[prop] = changeVal;
          if (this.pInst.debug_attributes) this.setAttr(prop, changeVal);
          return true;
        }
        return false;
      };
      for (const prop in change) {
        assignProp(assigned, prop) ||
          assignProp(persistent, prop) ||
          assignProp(this.pInst, prop) ||
          console.error(
            `${this.constructor.elementName}'s change attribute has a prop called ${prop} that is unknown`
          );
      }
      return changed;
    }
    colliding_with(el) {
      return this.pInst.collide_elements(this, el);
    }
    draw(persistent, inherited) {
      this.pInst.push();
      const assigned = this.assignAttrVals(persistent, inherited);
      this.drawIteration(persistent, assigned);
      this.pInst.pop();
    }
    drawChildren(persistent, assigned) {
      let showElse = false;
      for (let c = 0; c < this.children.length; c++) {
        const child = this.children[c];
        if (child instanceof P5Element === false) continue;
        const [showKey, showVal] = child.showLogicBool(persistent, assigned);
        if (
          showVal === true &&
          (showKey === p5.prototype.IF ||
            (showKey === p5.prototype.ELSE && showElse === true))
        ) {
          child.draw?.(persistent, assigned);
          showElse = false;
        } else if (showKey === p5.prototype.IF) {
          showElse = true;
        }
      }
    }
    drawIteration(persistent, assigned) {
      const { WHILE } = p5.prototype;
      let repeat = true;
      while (repeat) {
        this.renderToCanvas?.(persistent, assigned);
        this.drawChildren(persistent, assigned);
        const changed = this.change(persistent, assigned);
        if (!changed) repeat = false;
        else if (typeof assigned.repeat === "boolean") repeat = assigned.repeat;
        else {
          const [key, ...conditions] = this.assignAttrVal(
            persistent,
            assigned,
            "repeat"
          );
          repeat = (key === WHILE) === conditions.every((c) => c);
        }
        this.endRender?.(assigned);
      }
    }
    static get elementName() {
      return `p-${pascalToKebab(this.name)}`;
    }
    evalAttr(persistent, assigned, attrName, thisArg) {
      if (this.attrEvals.has(attrName)) {
        const evalFn = this.attrEvals.get(attrName);
        return evalFn.call(thisArg, this.pInst, persistent, assigned);
      }
      if (attrName in assigned) return assigned[attrName];
      if (attrName in persistent) return persistent[attrName];
      if (attrName in this.pInst) return this.pInst[attrName];
      return;
    }
    getInheritedAttr(attrName) {
      if (this instanceof HTMLCanvasElement) return;
      if (this.parentElement.hasAttr(attrName))
        return this.parentElement.getAttr(attrName);
      return this.parentElement.getInheritedAttr(attrName);
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
    get html() {
      return this.outerHTML.replace(this.innerHTML, "");
    }
    isPersistent(attrName) {
      if (this instanceof HTMLCanvasElement) return this.hasAttr(attrName);
      return this.parentElement?.isPersistent?.(attrName);
    }
    get orderedAttributeNames() {
      this.transformDoneIndex = 0;
      return Array.from(this.attributes)
        .sort(
          ({ name: a }, { name: b }) =>
            (attributePriorities.get(a) || attributePriorities.size) -
            (attributePriorities.get(b) || attributePriorities.size)
        )
        .map(({ name }) => name);
    }
    #pInst = null;
    get pInst() {
      return this.#pInst;
    }
    set pInst(pInst) {
      this.#pInst = pInst;
    }
    setupEvalFn(attr) {
      const attrJsStr = attr.value;
      //  TODO - catch improperly ordered quote marks: "foo'var"'
      if (AttrParseUtil.allQuotesMatched(attrJsStr) === false)
        console.error(
          `It looks like a ${this.constructor.elementName}'s ${attr.name} ` +
            `attribute has an open string. Check that each string has a beginning and end character.`
        );
      const varName = AttrParseUtil.replacePropNames(this, attr.name);
      const attrValueVarsReplaced = AttrParseUtil.replacePropNames(
        this,
        attrJsStr
      );
      const varValue = AttrParseUtil.enclose(attrValueVarsReplaced);
      const evalFnName = `${this.constructor.name}_${attr.name.replace(
        /[^a-z0-9]/g,
        "_"
      )}`;
      const fnHeader = `return function ${evalFnName}(_pInst, _persistent, _assigned) {`;
      const fnBody = `return ${varName} = ${varValue};\n};`;
      const fnStr = [fnHeader, ...this.comments, fnBody].join("\n");
      const evalFn = new Function(fnStr)();
      this.attrEvals.set(attr.name, evalFn);
    }
    setupEvalFns() {
      if (this.hasAttr("repeat") && !this.hasAttr("change")) {
        console.error(
          `It looks like a ${this.constructor.elementName} has a repeat attribute ` +
            "but does not have a change attribute. The change attribute is required to " +
            "prevent infinite loops."
        );
        this.removeAttribute("repeat");
      }
      const { attributes } = this;
      for (let i = 0; i < attributes.length; i++) {
        this.setupEvalFn(attributes[i]);
      }
    }
    showLogicBool(persistent, assigned) {
      const show = this.hasAttribute("show")
        ? this.assignAttrVal(persistent, { ...assigned }, "show")
        : assigned.show;
      if (Array.isArray(show)) {
        const [logic, ...conditions] = show;
        const bool = conditions.every((c) => c);
        return [logic, bool];
      } else if (typeof show === "string") return [show, true];
      else if (typeof show === "boolean") return [p5.prototype.IF, show];
      return [p5.prototype.IF, false];
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
  renderToCanvas(persistent, assigned) {
    const args = this.params.map((param) =>
      param in assigned ? assigned[param] : persistent[param]
    );
    this.pInst[this.fnName](...args);
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
    for (let i = 0; i < overloads.length; i++) {
      const overloadParams = overloads[i].split(",").map((s) => s.trim());
      overloadMatch = overloadParams.every(
        (p) =>
          this.orderedAttributeNames.includes(p) ||
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
          if (this.orderedAttributeNames.includes(p))
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
      } else if (i === overloads.length - 1)
        this.params = overloadParams.filter((param) => !isOptional(param));
    }
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

p5.prototype._defineCustomElement = function (pCustomEl) {
  const name = pCustomEl.getAttr("name");
  customElements.define(
    `p-${name}`,
    class extends P5Element {
      constructor() {
        super();
      }
      setDefaults() {
        Array.from(pCustomEl.attributes).forEach(
          (a) => this.hasAttr(a.name) === false && this.setAttr(a.name, a.value)
        );
        const childClones = Array.from(pCustomEl.children).map((child) =>
          child.cloneNode(true)
        );
        this.prepend(...childClones);
        this.setupEvalFns();
      }
      static elementName = name;
      renderToCanvas = null;
    }
  );
};

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
    get orderedAttributeNames() {
      //  Remove 'is' and 'style' from attrNames
      return super.orderedAttributeNames.filter(
        (v) => v !== "is" && v != "style"
      );
    }
    runCode() {
      const canvas = this;

      const sketch = (pInst) => {
        Canvas.setupElement(canvas, pInst);
        const persistent = {};

        pInst.preload = () => pInst.loadAssets();

        pInst.setup = function () {
          const renderer = canvas.hasAttr("renderer")
            ? canvas.evalAttr({}, {}, "renderer")
            : null;
          pInst.assignCanvas(canvas, renderer);
          canvas.assignAttrVals(persistent, {});
          Object.getOwnPropertyNames(persistent).forEach(
            (name) => delete defaults[name]
          );
        };
        const defaults = {
          x: 0,
          x1: 0,
          x2: 0,
          x3: 100,
          x4: 100,
          cx: 0,
          y: 0,
          y1: 0,
          y2: 100,
          y3: 100,
          y4: 0,
          cy: 0,
          z: 0,
          w: 100,
          h: 100,
          d: 100,
          s: 100,
          start_angle: 0,
          stop_angle: pInst.PI,
          vector: pInst.createVector(),
          v1: 255,
          v2: 255,
          v3: 255,
          rx: 1,
          ry: 1,
          rz: -1,
          img: pInst.createImage(100, 100),
          content: "",
          show: [p5.prototype.IF, true],
          repeat: false,
          change: {},
        };

        pInst.draw = function () {
          canvas.drawChildren(persistent, defaults);
        };
      };
      new p5(sketch);
    }
    static setupElement = (el, pInst) => {
      el.pInst = pInst;
      el.setDefaults?.();
      el.parseAttributes?.();
      el.setupEvalFns?.();
      el.setParamsFromOverloads?.();
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children.item(i);
        Canvas.setupElement(child, pInst);
      }
    };

    varInitialized(varName) {
      if (this.orderedAttributeNames.includes(varName)) return true;
      return super.varInitialized(varName);
    }
  },
  class Custom extends P5Element {
    constructor() {
      super();
      if (this.attributes.length) p5.prototype._defineCustomElement(this);
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
      const pEl =
        xmlTag === "canvas"
          ? document.createElement("canvas", { is: "p-canvas" })
          : document.createElement(`p-${xmlTag}`);
      this.copyAttributes(xmlEl, pEl);
      if (xmlTag === "custom") p5.prototype._defineCustomElement(pEl);
      return pEl;
    }
    convertAllElements(xmlEl, parent = document.body) {
      const pEl = this.convertElement(xmlEl);
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
