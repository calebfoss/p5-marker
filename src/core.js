import { pascalToKebab, kebabToCamel } from "./utils/caseConvert";
import { AttrParseUtil } from "./utils/attrParse";
import { wrapMethod, defineProperties } from "./utils/p5Modifiers";
import { addWebGLMethods } from "./methods/3d_methods";
import { addCanvasProperties } from "./properties/canvas_props";
import { addCanvasMethods } from "./methods/canvas_methods";
import { addColorConstants } from "./properties/color_props";
import { addColorMethods } from "./methods/color_methods";

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
p5.prototype.create_canvas_element = function (elementName) {
  const createdElement = document.createElement(elementName);
  this.canvas.appendChild(createdElement);
  createdElement.setup(this, this.canvas);
  return createdElement;
};
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
export const addP5PropsAndMethods = (baseClass) =>
  class P5Extension extends addColorMethods(
    addColorConstants(addWebGLMethods(baseClass))
  ) {
    /**
     * This element's parent canvas.
     * @private
     */
    #canvas;
    /**
     * @private
     */
    #pInst;
    /**
     * @private
     */
    #proxy = new Proxy(this, {
      get(target, prop) {
        if (prop in target) return target[prop];
        return target.#state[prop];
      },
      has(target, prop) {
        if (prop in target) return true;
        return prop in target.#state;
      },
      set(target, prop, val) {
        target.set(prop, val);
      },
    });
    /**
     * @private
     */
    #state = {};

    /**
     * @private
     */
    #updateFunctions = new Map();

    constructor() {
      super();
    }
    /**
     * Proxy for the sibling element above this element with access to its
     * properties, methods, and attributes.
     * @type {proxy}
     */
    get above_sibling() {
      return this.previousElementSibling.this_element;
    }
    /**
     * True if siblings directly above this element with an "on" attribute have
     * "on" set to false. This can be used to switch between elements based on
     * conditions, similar to if/else.
     * @type {boolean}
     */
    get above_siblings_off() {
      if (this === this.parentElement.firstElementChild) return true;
      const { above_sibling } = this;
      if (above_sibling.on) return false;
      return above_sibling.above_siblings_off;
    }
    /**
     * @method applyChange
     * @private
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
        assignProp(this, prop) ||
          assignProp(this.#state, prop) ||
          assignProp(this.pInst, prop) ||
          console.error(
            `${this.constructor.elementName}'s change attribute has a prop called ${prop} that is unknown`
          );

        this.#state[prop] = change[prop];
      }
      return changed;
    }
    /**
     * Checks if the provided attribute name belongs to a parent element. If
     * the attribute refers to an object property, this will check for an
     * attribute with a name that matches the object.
     * @param {string} attributeName - name of the attribute to check
     * @returns {boolean} true
     */
    attributeInherited(attributeName) {
      const [obj, ...props] = attributeName.split(".");
      if (props.length) return this.attributeInherited(obj);
      if (this.parentElement.hasAttribute(attributeName)) return true;
      if (this.parentElement.attributeInherited)
        return this.parentElement.attributeInherited(attributeName);
      return false;
    }
    /**
     * Blends the pixels in the display window according to the defined mode.
     * There is a choice of the following modes to blend the source pixels (A)
     * with the ones of pixels already in the display window (B):
     * <ul>
     * <li><code>BLEND</code> - linear interpolation of colours: C =
     * A*factor + B. <b>This is the default blending mode.</b></li>
     * <li><code>ADD</code> - sum of A and B</li>
     * <li><code>DARKEST</code> - only the darkest colour succeeds: C =
     * min(A*factor, B).</li>
     * <li><code>LIGHTEST</code> - only the lightest colour succeeds: C =
     * max(A*factor, B).</li>
     * <li><code>DIFFERENCE</code> - subtract colors from underlying image.
     * <em>(2D)</em></li>
     * <li><code>EXCLUSION</code> - similar to <code>DIFFERENCE</code>, but less
     * extreme.</li>
     * <li><code>MULTIPLY</code> - multiply the colors, result will always be
     * darker.</li>
     * <li><code>SCREEN</code> - opposite multiply, uses inverse values of the
     * colors.</li>
     * <li><code>REPLACE</code> - the pixels entirely replace the others and
     * don't utilize alpha (transparency) values.</li>
     * <li><code>REMOVE</code> - removes pixels from B with the alpha strength of A.</li>
     * <li><code>OVERLAY</code> - mix of <code>MULTIPLY</code> and <code>SCREEN
     * </code>. Multiplies dark values, and screens light values. <em>(2D)</em></li>
     * <li><code>HARD_LIGHT</code> - <code>SCREEN</code> when greater than 50%
     * gray, <code>MULTIPLY</code> when lower. <em>(2D)</em></li>
     * <li><code>SOFT_LIGHT</code> - mix of <code>DARKEST</code> and
     * <code>LIGHTEST</code>. Works like <code>OVERLAY</code>, but not as harsh. <em>(2D)</em>
     * </li>
     * <li><code>DODGE</code> - lightens light tones and increases contrast,
     * ignores darks. <em>(2D)</em></li>
     * <li><code>BURN</code> - darker areas are applied, increasing contrast,
     * ignores lights. <em>(2D)</em></li>
     * <li><code>SUBTRACT</code> - remainder of A and B <em>(3D)</em></li>
     * </ul>
     *
     * <em>(2D)</em> indicates that this blend mode <b>only</b> works in the 2D renderer.<br>
     * <em>(3D)</em> indicates that this blend mode <b>only</b> works in the WEBGL renderer.
     * @type {BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|
     * REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|REMOVE|SUBTRACT}
     */
    get blend_mode() {
      if (this.pInst._renderer.isP3D) return this.curBlendMode;
      return this.pInst.drawingContext.globalCompositeOperation;
    }
    set blend_mode(val) {
      this.pInst.blendMode(val);
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
      if (attrName in this.pInst) return this.pInst[attrName];
      return;
    }
    /**
     * The parent canvas for this element
     * @type {HTMLCanvasElement}
     */
    get canvas() {
      return this.#canvas.this_element;
    }
    /**
     * Checks if this element is colliding with the provided other element.
     * @method colliding_with
     * @param {P5Element} el - other element to check
     * @returns {boolean} true if elements are colliding
     */
    colliding_with(el) {
      return this.pInst.collide_elements(this, el);
    }
    /**
     * color_mode changes the way p5.js interprets
     * color data. By default, fill,
     * <a href="https://p5js.org/reference/#/p5/color">color()</a> are defined
     * by values between 0 and 255 using the RGB color model. This is equivalent
     * to setting color_mode="RGB, 255".
     * Setting color_mode="HSB" lets you use the HSB system instead. By default,
     * this is color_mode="HSB, 360, 100, 100, 1". You can also use HSL.
     *
     * Note: existing color objects remember the mode that they were created in,
     * so you can change modes as you like without affecting their appearance.
     *
     * @type {RGB|HSB|HSL}
     */
    get color_mode() {
      return this.pInst._colorMode;
    }
    set color_mode(val) {
      this.pInst.colorMode(val);
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
    set console_log(val) {
      console.log(...arguments);
    }
    /**
     * Updates the element's attribute values, renders it to the canvas, and
     * calls the draw method on its children.
     * @method draw
     * @param {object} inherited - object containing attribute values passed
     * down from parent element
     */
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
        this.render?.();
        for (const child of this.children) {
          child.draw(this.#state);
        }
        repeat = this.hasAttribute("repeat") && this.#state.repeat;
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
          const changed = this.#applyChange();
          const updaters = this.#updateFunctions.entries();
          for (const [attrName, updater] of updaters) {
            if (attrName in change === false)
              this.#state[attrName] = this.#updateAttribute(
                inherited,
                attrName,
                this
              );
          }
          if (!changed) repeat = false;
        }
        this.endRender?.(this.#state);
      }
      this.pInst.pop();
    }
    /**
     * The p5.js API provides a lot of functionality for creating graphics, but
     * there is some native HTML5 Canvas functionality that is not exposed by
     * p5.
     *
     * You can still assign to
     * it directly using the property `drawing_context`. This is
     * the equivalent of calling `canvas.getContext('2d');` or
     * `canvas.getContext('webgl');` and then calling Object.assign on the
     * result.
     * See this
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D">
     * reference for the native canvas API</a> for possible drawing functions
     * you can call.
     *
     * ```xml
     * <_ drawing_context="shadowOffsetX: 5, shadowOffsetY: -5, shadowBlur: 10,
     * shadowColor: 'black'" />
     * ```
     * @type {Object}
     */
    get drawing_context() {
      return this.pInst.drawingContext;
    }
    set drawing_context(obj) {
      Object.assign(this.pInst.drawingContext, obj);
    }
    /**
     * Name of the HTML element generated from this class.
     * @type {string}
     */
    static get elementName() {
      return `p-${pascalToKebab(this.name)}`;
    }
    /**
     * With erase="true", this element and all elements rendered after it will
     * subtract from the canvas. Erased areas will reveal the web page
     * underneath the canvas. This may be canceled with erase="false"
     *
     * Arguments for the optional parameters to
     * <a href="https://p5js.org/reference/#/p5/erase">erase()</a>
     * may also be provided as a comma separated list.
     *
     * ```<p-image>``` elements will not erase the canvas but works as usual.
     * @type {boolean}
     */
    get erase() {
      return this.pInst._renderer._isErasing;
    }
    set erase(val) {
      if (val === true) this.pInst.erase();
      else if (val === false) this.pInst.noErase();
      else if (Array.isArray(val)) this.pInst.erase(...val);
      else
        console.error(
          `${
            this.tagName
          }'s erase property was set using type ${typeof val}, but erase may only be set to a boolean or array.`
        );
    }
    /**
     * @private
     */
    get #html() {
      return this.outerHTML.replace(this.innerHTML, "");
    }
    /**
     * List of attribute names in the order in which they will be evaluated.
     * Element attributes are not guaranteed to be in the order in which they
     * are written. Transformation attributes are prioritized before others
     * and use this order: anchor, angle, scale_factor, shear.
     * @type {Array}
     */
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
    /**
     * Proxy for this element's parent element with access to its properties,
     * methods, and attributes.
     * @type {proxy}
     */
    get parent_element() {
      return this.parentElement.this_element;
    }
    /**
     * This element's p5 instance.
     * @type {object}
     */
    get pInst() {
      return this.#pInst;
    }
    /**
     * Sets an attribute's value on this element.
     * @param {string} attributeName
     * @param {*} value
     */
    set(attributeName, value) {
      if (attributeName in this) {
        this.#updateFunctions.set(
          attributeName,
          () => (this[attributeName] = value)
        );
        this[attributeName] = value;
      } else {
        this.#updateFunctions.set(attributeName, () => value);
      }
      this.#state[attributeName] = value;
    }
    /**
     * Sets this element up with a p5 instance and sets up its children.
     * @param {p5} pInst
     */
    setup(pInst, canvas) {
      this.#pInst = pInst;
      this.#canvas = canvas;
      this.setDefaults?.();
      this.#setupEvalFns?.();
      this.setupRenderFunction?.();
      for (const child of this.children) {
        child.setup(pInst, canvas);
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
      const getOwnerName = (prop) => {
        if (prop in this) return "this";
        //  TODO - remove condition when p5 props have been moved to elments
        if (
          prop in this.pInst &&
          typeof this.pInst[prop] !== "function" &&
          prop !== "width" &&
          prop !== "height"
        )
          return "this.pInst";
        if (this.attributeInherited(prop)) return "inherited";
      };
      const owner = getOwnerName(attr.name);
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
    /**
     * This element's proxy with access to properties, methods, and attributes.
     */
    get this_element() {
      return this.#proxy;
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
        (attrName === "width" || attrName === "height")
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
    /**
     * Updates the values of all attributes using the provided expressions.
     * @param {Object} inherited - object
     * @returns
     */
    updateState(inherited) {
      for (const prop in inherited) {
        if (prop in this) this[prop] = inherited[prop];
        this.#state[prop] = inherited[prop];
      }
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
     * Set attributes for the WebGL Drawing context.
     * This is a way of adjusting how the WebGL
     * renderer works to fine-tune the display and performance.
     *
     * Note that this will reinitialize the drawing context
     * if set after the WebGL canvas is made.
     *
     * If webgl_attributes is set to an object, all attributes
     * not declared in the object will be set to defaults.
     *
     * The available attributes are:
     * <br>
     * alpha - indicates if the canvas contains an alpha buffer
     * default is false
     *
     * depth - indicates whether the drawing buffer has a depth buffer
     * of at least 16 bits - default is true
     *
     * stencil - indicates whether the drawing buffer has a stencil buffer
     * of at least 8 bits
     *
     * antialias - indicates whether or not to perform anti-aliasing
     * default is false (true in Safari)
     *
     * premultipliedAlpha - indicates that the page compositor will assume
     * the drawing buffer contains colors with pre-multiplied alpha
     * default is false
     *
     * preserveDrawingBuffer - if true the buffers will not be cleared and
     * and will preserve their values until cleared or overwritten by author
     * (note that p5 clears automatically on draw loop)
     * default is true
     *
     * perPixelLighting - if true, per-pixel lighting will be used in the
     * lighting shader otherwise per-vertex lighting is used.
     * default is true.
     *
     * @type {Object}
     */
    get webgl_attributes() {
      return this.pInst._glAttributes;
    }
    set webgl_attributes(val) {
      this.pInst.setAttributes(...arguments);
    }
  };
export class P5Element extends addP5PropsAndMethods(HTMLElement) {}

export class RenderedElement extends P5Element {
  constructor(overloads, renderFunctionName) {
    super();
    /**
     * @private
     */
    this.overloads = overloads;
    /**
     * @private
     */
    this.renderFunctionName =
      renderFunctionName || kebabToCamel(this.tagName.toLowerCase().slice(2));
  }
  /**
   * Sets the parameters used to call this element's render function based
   * on the overloads for that function and this element's attributes.
   * @private
   */
  #getArgumentsFromOverloads() {
    const { overloads } = this;
    //  Check every required parameter has an attribute
    const isOptional = (param) => param.match(/^\[.*\]$/);
    let overloadMatch = false;
    //  Split the parameters and start with overloads with most parameters
    const overloadsSplitSorted = overloads
      .map((o) => o.split(",").map((p) => p.trim()))
      .sort((a, b) => a.length - b.length);
    //  If there aren't any overloads, return an empty array
    if (overloadsSplitSorted.length === 0) return [];
    for (let i = 0; i < overloadsSplitSorted.length; i++) {
      const overloadParams = overloadsSplitSorted[i];
      overloadMatch = overloadParams.every(
        (p) =>
          this.hasAttribute(p) ||
          this.attributeInherited(p) ||
          isOptional(p) ||
          p === "" ||
          (i === overloadsSplitSorted.length - 1 && this.attributeInherited(p))
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
            return filterParams(
              overloadParams,
              filteredParams.concat({ owner: this.this_element, param: p }),
              ++i
            );
          //  If not defined on this element and optional, return filtered params
          if (optional) return filteredParams;
          //  If required and already initialized, add it to filtered params
          if (this.attributeInherited(p))
            return filterParams(
              overloadParams,
              filteredParams.concat({ owner: this.this_element, param: p }),
              ++i
            );
          return filteredParams;
        };
        return filterParams(overloadParams);
      }
    }
    console.error(
      `Element ${this.tagName} does not have the required attributes to render and will be removed from the sketch`
    );
    this.remove();
  }
  /**
   * @private
   */
  setupRenderFunction() {
    const args = this.#getArgumentsFromOverloads();
    this.render = function () {
      this.pInst[this.renderFunctionName](
        ...args.map(({ param, owner }) => owner[param])
      );
    };
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
      /**
       * Sets the default values for this element's attributes.
       */
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
customElements.define("p-_", _);

/**
 * The `<canvas>` element is a rectangular area of the window for rendering
 * imagery. All child elements are rendered to the canvas.
 * @element canvas
 * @attribute {Number} width - Width of the canvas in pixels
 * @attribute {Number} height - Height of the canvas in pixels
 * @attribute {p5.Color|String|Number, [Number]|Number, Number, Number, [Number]|p5.Image,
 * [Number]} canvas_background
 * Sets the background that is rendered at the start of each frame. This may be a color
 * or an image. The default background is NONE (transparent). The color is either specified in
 * terms of the RGB, HSB, or HSL color depending on the current color_mode. The values are the
 * same as the parameters for <a href="https://p5js.org/reference/#/p5/color" target="_blank">color()</a>.
 *
 * If the attribute is set to a single string, RGB, RGBA and Hex CSS color strings and
 * all named color strings are supported. In this case, an alpha number value as a second
 * value is not supported, the RGBA form should be used.
 */
export class Canvas extends addCanvasMethods(
  addCanvasProperties(addP5PropsAndMethods(HTMLCanvasElement))
) {
  static renderer = "p2d";

  constructor() {
    super();
    window.addEventListener("customElementsDefined", this.runCode.bind(this));
  }
}
customElements.define("p-canvas", Canvas, { extends: "canvas" });

/**
 * The `<custom>` element generates a new element from a combination of existing
 * elements. This element should be placed outside the <canvas> element. The name attribute defines the name of the new element. For
 * example, if name is set to "my-element," <my-element>
 * @element custom
 * @example Clouds
 * ```html
 * <_>
 *  <custom name="cloud" attributes="center_x, center_y" stroke="NONE">
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
 *      canvas_background="100, 140, 200"
 *      cloud_x="0"
 *  >
 *      <cloud
 *          center_y="75"
 *          center_x="cloud_x - 40 - width * 0.25"
 *          change="center_x: center_x + width * 0.25"
 *          repeat="WHILE center_x LESS_THAN width * 1.25"
 *      ></cloud>
 *      <_ cloud_x="cloud_x + 0.25">
 *          <_ on="cloud_x GREATER_THAN width * 0.25" cloud_x="0"></_>
 *      </_>
 *  </canvas>
 * </_>
 * ```
 */
class Custom extends P5Element {
  constructor() {
    super();
    if (this.attributes.length) p5.prototype._defineCustomElement(this);
  }
}
customElements.define("p-custom", Custom);

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
customElements.define("p-asset", Asset);

/**
 * This HTML element loads an XML sketch file. This should be added to the
 * index.html file as a `<link>` element with the attributes is="p-sketch" and
 * href="[PATH TO XML FILE]".
 * @element p-sketch
 * @example Add a sketch to html
 * ```html
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
 * ```
 */
class Sketch extends HTMLLinkElement {
  static elementName = "p-sketch";
  constructor() {
    super();
    this.#loadXML(this.href);
  }
  #convertElement(xmlEl) {
    const xmlTag = xmlEl.tagName;
    const createElementArguments = this.#xmlTagToCreateElementArguments(xmlTag);
    const pEl = document.createElement(...createElementArguments);
    this.#copyAttributes(xmlEl, pEl);
    if (xmlTag === "custom") p5.prototype._defineCustomElement(pEl);
    return pEl;
  }
  #convertAllElements(xmlEl, parent = document.body) {
    const pEl = this.#convertElement(xmlEl);
    parent.appendChild(pEl);
    for (let i = 0; i < xmlEl.children.length; i++) {
      this.#convertAllElements(xmlEl.children[i], pEl);
    }
  }
  #convertXML(e) {
    const xml = e.target.response.documentElement;
    this.#convertAllElements(xml);
    document.querySelectorAll("canvas").forEach((canvas) => canvas.runCode());
  }
  #copyAttributes(orig, copy) {
    const attrs = orig.attributes;
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      copy.setAttribute(attr.name, attr.value);
    }
  }
  #loadXML(path) {
    if (!path)
      return console.error(
        "p-sketch element is missing required path attribute"
      );
    const request = new XMLHttpRequest();
    request.open("GET", path);
    request.responseType = "document";
    request.overrideMimeType("text/xml");
    request.addEventListener("load", this.#convertXML.bind(this));
    request.send();
  }
  #xmlTagToCreateElementArguments(xmlTag) {
    if (xmlTag.slice(0, 2) === "p-") return [xmlTag];
    if (xmlTag === "canvas") return [xmlTag, { is: "p-canvas" }];
    if (xmlTag === "canvas-3d") return ["canvas", { is: "p-canvas-3d" }];
    return ["p-" + xmlTag];
  }
}
customElements.define("p-sketch", Sketch, { extends: "link" });
