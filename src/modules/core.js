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

const attributePriorities = [
  "debug_attributes",
  "anchor",
  "angle",
  "scale_factor",
  "shear",
  "_default",
  "repeat",
  "change",
];
const P5Extension = (baseClass) =>
  class P5Extension extends baseClass {
    /**
     * @private
     */
    #pInst;
    /**
     * @private
     */
    #state = {};
    proxy = new Proxy(this, {
      get(target, prop) {
        if (prop in target) return target[prop];
        return target.#state[prop];
      },
      has(target, prop) {
        if (prop in target) return true;
        return prop in target.#state;
      },
      set(target, prop, val) {
        target.#updateFunctions.set(prop, () => val);
        target.#state[prop] = val;
      },
    });
    /**
     * @private
     */
    #updateFunctions = new Map();

    constructor() {
      super();
    }
    /**
     * @private
     * @param {*} inherited
     * @param {*} attrName
     * @param {*} thisArg
     * @returns
     */
    #updateAttribute(inherited, attrName, thisArg) {
      if (attrName === "repeat" || attrName === "change")
        inherited = this.#state;
      const val = this.#callAttributeUpdater(inherited, attrName, thisArg);
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
      this.setAttribute(attrName, valToString(val));
      return val;
    }
    updateState(inherited) {
      this.#state = Object.assign({}, inherited);
      const updaters = this.#updateFunctions.entries();
      for (const [attrName, updateFunction] of updaters) {
        this.#state[attrName] = this.#updateAttribute(
          inherited,
          attrName,
          this
        );
      }
      return this.#state;
    }
    /**
     * @method applyChange
     * @private
     * @returns
     */
    #applyChange() {
      const change = (this.#state.change = this.#updateAttribute(
        this.#state,
        "change",
        this
      ));
      let changed = false;
      const assignProp = (obj, prop) => {
        if (prop in obj) {
          const changeVal = change[prop];
          changed ||= obj[prop] !== changeVal;
          obj[prop] = changeVal;
          if (this.pInst.debug_attributes) this.setAttribute(prop, changeVal);
          return true;
        }
        return false;
      };
      for (const prop in change) {
        assignProp(this.#state, prop) ||
          assignProp(this.persistent, prop) ||
          assignProp(this.pInst, prop) ||
          console.error(
            `${this.constructor.elementName}'s change attribute has a prop called ${prop} that is unknown`
          );

        this.#state[prop] = change[prop];
      }
      return changed;
    }
    colliding_with(el) {
      return this.pInst.collide_elements(this, el);
    }
    draw(inherited) {
      if (this.hasAttribute("on")) {
        this.#state.on = this.#updateAttribute(
          inherited,
          "on",
          this.this_element
        );
        if (!this.#state.on) return;
      }
      this.pInst.push();
      this.updateState(inherited);
      const { WHILE } = p5.prototype;
      let repeat = true;
      while (repeat) {
        this.renderToCanvas?.();
        this.drawChildren(this.#state);
        repeat = this.#state.repeat;
        const { change } = this.#state;
        if (Array.isArray(repeat)) {
          const [key, ...conditions] = this.#updateAttribute(
            this.#state,
            "repeat"
          );
          repeat = (key === WHILE) === conditions.every((c) => c);
        }
        if (repeat) {
          this.pInst.pop();
          this.pInst.push();
          const updaters = this.#updateFunctions.entries();
          for (const [attrName, updater] of updaters) {
            if (attrName in change === false)
              this.#state[attrName] = this.#updateAttribute(
                inherited,
                attrName,
                this
              );
          }
          const changed = this.#applyChange();
          if (!changed) repeat = false;
        }
        this.endRender?.(this.#state);
      }
      this.pInst.pop();
    }
    drawChildren(assigned) {
      for (let c = 0; c < this.children.length; c++) {
        const child = this.children[c];
        child.draw?.(assigned);
      }
    }
    static get elementName() {
      return `p-${pascalToKebab(this.name)}`;
    }
    /**
     * @private
     */
    #callAttributeUpdater(inherited, attrName, thisArg) {
      if (this.#updateFunctions.has(attrName)) {
        const evalFn = this.#updateFunctions.get(attrName);
        return evalFn.call(thisArg, this.pInst, inherited);
      }
      if (attrName in inherited) return inherited[attrName];
      if (attrName in this.persistent) return this.persistent[attrName];
      if (attrName in this.pInst) return this.pInst[attrName];
      return;
    }
    /**
     * @private
     */
    get #comments() {
      return this.#html
        .split(/(?:\r\n|\r|\n)/)
        .map((line) => line.match(/.{1,80}/g))
        .flat()
        .map((line) => "//\t" + line);
    }
    /**
     * @private
     */
    get #html() {
      return this.outerHTML.replace(this.innerHTML, "");
    }
    isPersistent(attrName) {
      if (this instanceof HTMLCanvasElement) return this.hasAttribute(attrName);
      return this.parentElement?.isPersistent?.(attrName);
    }
    get orderedAttributeNames() {
      const ordered = Array.from(this.attributes)
        .sort(
          ({ name: a }, { name: b }) =>
            (attributePriorities.indexOf(a) + 1 ||
              attributePriorities.indexOf("_default")) -
            (attributePriorities.indexOf(b) + 1 ||
              attributePriorities.indexOf("_default"))
        )
        .map(({ name }) => name);
      this.transformDoneIndex =
        ordered.findLastIndex((attrName) =>
          attributePriorities.includes(attrName)
        ) + 1;
      return ordered;
    }
    get persistent() {
      return this.#pInst.canvas.proxy;
    }
    get parent_element() {
      return this.parentElement.proxy;
    }
    get above_sibling() {
      return this.previousElementSibling.proxy;
    }
    get above_siblings_off() {
      if (this === this.parentElement.firstElementChild) return true;
      const { above_sibling } = this;
      if (above_sibling.on) return false;
      return above_sibling.above_siblings_off;
    }
    get pInst() {
      return this.#pInst;
    }
    setup(pInst) {
      this.#pInst = pInst;
      this.setDefaults?.();
      this.#setupEvalFns?.();
      this.setParamsFromOverloads?.();
      for (const child of this.children) {
        child.setup(pInst);
      }
    }
    /**
     * @private
     */
    #setupEvalFn(attr) {
      //  The attribute's value will be modified, then run as JS
      const attrJsStr = attr.value;
      //  TODO - catch improperly ordered quote marks: "foo'var"'
      if (AttrParseUtil.allQuotesMatched(attrJsStr) === false)
        console.error(
          `It looks like a ${this.constructor.elementName}'s ${attr.name} ` +
            `attribute has an open string. Check that each string has a beginning and end character.`
        );
      const owner = AttrParseUtil.getOwnerName(this, attr.name);
      //  This is plural because there may be a prop name within
      //  Ex:  myArray[i]
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
      const fnHeader = `return function ${evalFnName}(_pInst, _inherited) {`;
      //  TODO Fix this mess
      const fnBody =
        owner === "inherited" && !attr.name.includes(".")
          ? `return ${varValue};\n}`
          : `return ${varName} = ${varValue};\n};`;
      const fnStr = [fnHeader, ...this.#comments, fnBody].join("\n");
      const evalFn = new Function(fnStr)();
      this.#updateFunctions.set(attr.name, evalFn);
    }
    /**
     * @private
     */
    #setupEvalFns() {
      if (this.hasAttribute("repeat") && !this.hasAttribute("change")) {
        console.error(
          `It looks like a ${this.constructor.elementName} has a repeat attribute ` +
            "but does not have a change attribute. The change attribute is required to " +
            "prevent infinite loops."
        );
        this.removeAttribute("repeat");
      }
      const { orderedAttributeNames, transformDoneIndex } = this;
      for (let i = 0; i < orderedAttributeNames.length; i++) {
        if (i === transformDoneIndex)
          this.#updateFunctions.set("transform_matrix", function () {
            this.transform_matrix = this.pInst.transform_matrix;
          });
        this.#setupEvalFn(this.attributes[orderedAttributeNames[i]]);
      }
    }
    get this_element() {
      return this.proxy;
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
  renderToCanvas() {
    const args = this.params.map((param) =>
      param in this.proxy ? this.proxy[param] : this.persistent[param]
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
          this.hasAttribute(p) ||
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
          if (this.hasAttribute(p))
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

p5.prototype._defineCustomElement = function (pCustomEl) {
  const name = pCustomEl.getAttribute("name");
  customElements.define(
    `p-${name}`,
    class extends P5Element {
      constructor() {
        super();
      }
      setDefaults() {
        Array.from(pCustomEl.attributes).forEach(
          (a) =>
            this.hasAttribute(a.name) === false &&
            this.setAttribute(a.name, a.value)
        );
        const childClones = Array.from(pCustomEl.children).map((child) =>
          child.cloneNode(true)
        );
        this.prepend(...childClones);
      }

      renderToCanvas = null;
    }
  );
};
(() => {
  /**
   * The blank `<_>` element renders nothing to the canvas. This is useful
   * for adjusting attributes for child elements.
   * @element _
   */
  class _ extends P5Element {
    constructor() {
      super();
    }
  }

  /**
   * The `<canvas>` element is a rectangular area of the window for rendering
   * imagery. All child elements are rendered to the canvas. Width, height
   * canvas_background, and all custom attributes are persistent; if a child
   * element changes the value of any of these attributes, the change will
   * remain in the next frame. This can be used to animate attributes over
   * time.
   * @element canvas
   * @attr {Number} width - Width of the canvas in pixels
   * @attr {Number} height - Height of the canvas in pixels
   * @attr {p5.Color|String|Number, [Number]|Number, Number, Number, [Number]|p5.Image, [Number]} canvas_background - Sets the background that is rendered at the start of each frame. This may be a color or an image.
   */
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
        canvas.setup(pInst);

        pInst.preload = () => pInst.loadAssets();

        pInst.setup = function () {
          const renderer = pInst[canvas.getAttribute("renderer")];
          pInst.assignCanvas(canvas, renderer);
          const initialState = canvas.updateState({});

          Object.getOwnPropertyNames(initialState).forEach(
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
          on: true,
          repeat: false,
          change: {},
        };

        pInst.draw = function () {
          canvas.drawChildren(defaults);
        };
      };
      new p5(sketch);
    }
    varInitialized(varName) {
      if (this.hasAttribute(varName)) return true;
      return super.varInitialized(varName);
    }
  }
  /**
 * The `<custom>` element generates a new element from a combination of existing
 * elements. This element should be placed outside the <canvas> element. The name attribute defines the name of the new element. For
 * example, if name is set to "my-element," <my-element>
 * @element custom
 * @example
 * <_>
 *  <custom name="cloud" attributes="center_x, center_y" stroke_color="NONE">
 *      <_ anchor="center_x, center_y" d="40">
 *          <circle x="-20" y="-10" fill_color="220"></circle>
 *          <circle x="20" y="-10" fill_color="210"></circle>
 *          <circle x="-10" y="-20" fill_color="250"></circle>
 *          <circle x="10" y="-20" fill_color="210"></circle>
 *          <circle x="0" y="0" fill_color="180"></circle>
 *          <circle x="20" y="0" fill_color="200"></circle>
 *          <circle x="-20" y="0" fill_color="240"></circle>
 *          <circle x="0" y="-5" fill_color="235"></circle>
 *      </_>
 *  </custom>
 *  <canvas
 *      width="400"
 *      height="400"
 *      is="canvas"
        canvas_background="100, 140, 200"
        cloud_x="0"
    >
        <cloud
            center_y="75"
            center_x="cloud_x - 40 - width * 0.25"
            change="center_x: center_x + width * 0.25"
            repeat="WHILE,  center_x LESS_THAN width * 1.25"
        ></cloud>
        <_ cloud_x="cloud_x + 0.25">
            <_ on="cloud_x GREATER_THAN width * 0.25" cloud_x="0"></_>
        </_>
    </canvas>
</_>
 */
  class Custom extends P5Element {
    constructor() {
      super();
      if (this.attributes.length) p5.prototype._defineCustomElement(this);
    }
  }
  class Asset extends HTMLElement {
    static elementName = "p-asset";
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

    async load(pInst) {
      if (this.data) return this.data;
      const loadFn = Asset.loadFns[this.getAttribute("type").toLowerCase()];
      const path = this.getAttribute("path");
      this.data = await pInst[loadFn](path);
      return this.data;
    }
  }
  /**
   * This HTML element loads an XML sketch file. This should be added to the
   * index.html file as a `<link>` element with the attributes is="p-sketch" and
   * href="[PATH TO XML FILE]".
   * @element p-sketch
   * @example
   * <!DOCTYPE html>
   * <html lang="en">
   * <head>
   *   <script src="p5.js"></script>
   *   <script src="p5.marker.js" defer></script>
   *   <link rel="stylesheet" type="text/css" href="style.css" />
   *   <link href="sketch.xml" is="p-sketch" />
   *   <meta charset="utf-8" />
   * </head>
   * <body></body>
   * </html>
   */
  class Sketch extends HTMLLinkElement {
    static elementName = "p-sketch";
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
  }

  registerElements(_, Canvas, Custom, Asset, Sketch);
})();
