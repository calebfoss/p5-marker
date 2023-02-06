import { pascalToKebab, kebabToCamel } from "./utils/caseConvert";
import { AttrParseUtil } from "./utils/attrParse";
import { wrapMethod, defineProperties } from "./utils/p5Modifiers";
import { addWebGLMethods } from "./methods/3d_methods";
import { addColorConstants } from "./properties/color_props";
import { addColorMethods } from "./methods/color_methods";
import { addStorage } from "./properties/data_props";
import { addDataMethods } from "./methods/data_methods";
import { addCollide } from "./methods/collide_methods";
import { defineCustomElement } from "./elements/beyond_canvas_elements";
import { addMathProps } from "./properties/math_props";
import { addMathMethods } from "./methods/math_methods";
import { addEventProps } from "./properties/event_props";

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
  return createdElement.this_element;
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
  "_default",
  "repeat",
  "change",
];
export const addP5PropsAndMethods = (baseClass) =>
  class P5Extension extends addColorMethods(
    addColorConstants(
      addWebGLMethods(
        addEventProps(
          addCollide(
            addMathMethods(addMathProps(addStorage(addDataMethods(baseClass))))
          )
        )
      )
    )
  ) {
    /**
     * This element's parent canvas.
     * @private
     */
    #canvas;
    #frame_created;
    /**
     * @private
     */
    #pInst;
    /**
     * @private
     */
    #proxy = new Proxy(this, {
      get(target, prop) {
        return target[prop];
      },
      has(target, prop) {
        return prop in target;
      },
      set(target, prop, val) {
        return target.set(prop, val);
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
    #name;
    #on = true;
    constructor() {
      super();
      if (this.hasAttribute("name")) defineCustomElement(this);
    }
    /**
     * The on property determines whether this element and its children
     * are updated and rendered.
     */
    get on() {
      return this.#on;
    }
    set on(val) {
      this.#on = val;
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
      const change = (this.#state.change = this.#updateAttribute("change"));
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
    #callAttributeUpdater(attrName) {
      if (this.#updateFunctions.has(attrName)) {
        const updateFn = this.#updateFunctions.get(attrName);
        return updateFn.call(this);
      }
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
    /**
     * The text content of the element and its children. If a $ is followed by
     * the name of a property (such as $blend_mode), it will be replaced by the
     * value of the property.
     */
    get content() {
      const getInherited = (owner, prop) => {
        if (prop in owner) return owner[prop];
        if (owner.parentElement) return getInherited(owner.parentElement, prop);
        return `$${prop}`;
      };
      const textNodes = Array.from(this.childNodes).filter(
        ({ nodeType }) => nodeType === 3
      );
      const text = textNodes
        .map(({ nodeValue }) => nodeValue)
        .join("")
        .replace(/\$(\w*)/g, (_, prop) => getInherited(this, prop))
        .replace(/\\n/g, "\n")
        .trim();
      return text;
    }
    set content(s) {
      if (this.content === s) return;
      for (const node of this.childNodes) {
        if (node.nodeType === 3) this.removeChild(node);
      }
      this.insertBefore(document.createTextNode(s), this.firstChild);
    }
    /**
     * Updates the element's attribute values, renders it to the canvas, and
     * calls the draw method on its children.
     * @method draw
     * @param {object} inherited - object containing attribute values passed
     * down from parent element
     */
    draw() {
      if (this.hasAttribute("on")) {
        this.#updateAttribute("on");
        if (!this.on) return;
      }
      this.pInst.push();
      this.updateState();
      const { content: description } = this;
      if (description.length) {
        if (this instanceof HTMLCanvasElement) this.pInst.describe(description);
        else this.pInst.describeElement(this.name, description);
      }
      const { WHILE } = p5.prototype;
      let repeat = true;
      while (repeat) {
        this.transform?.();
        this.render?.();
        for (const child of this.children) {
          child.draw?.(this.#state);
        }
        repeat = this.hasAttribute("repeat") && this.#state.repeat;
        const { change } = this.#state;
        if (Array.isArray(repeat)) {
          const [key, ...conditions] = this.#updateAttribute("repeat");
          repeat = (key === WHILE) === conditions.every((c) => c);
        }
        if (repeat) {
          this.pInst.pop();
          this.pInst.push();
          const changed = this.#applyChange();
          const updaters = this.#updateFunctions.entries();
          for (const [attrName, updater] of updaters) {
            if (attrName in change === false)
              this.#state[attrName] = this.#updateAttribute(attrName);
          }
          if (!changed) repeat = false;
        }
        this.endRender?.();
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
     * first_frame is true if the element was just created.
     * This can be used for setup. For example,
     * ```xml
     * <_ rand_ball="this_element">
     *  <_ on="first_frame"
     *     rand_ball.x="random(canvas.width)"
     *     rand_ball.y="random(canvas.height)"></_>
     *   <circle></circle>
     * </_>
     * ```
     * Sets the ```<_>```'s x-coordinate to a random position along the
     * canvas when it is first created. The value then stays the same.
     * As a result, the circle is played at that random position.
     * (read-only)
     * @type {boolean}
     */
    get first_frame() {
      return this.frame_count === 1;
    }
    /**
     * frame_count counts the number of frames this element has been
     * rendered. The first time this element is rendered, frame_count
     * with be 1. (read-only)
     * @type {number}
     */
    get frame_count() {
      return this.pInst.frameCount - this.#frame_created;
    }
    /**
     * @private
     */
    get #html() {
      return this.outerHTML.replace(this.innerHTML, "");
    }
    get name() {
      if (this.#name) return this.#name;
      const elementsWithThisTag = Array.from(
        document.querySelectorAll(this.tagName)
      );
      return `${this.tagName
        .slice(2)
        .toLowerCase()}_${elementsWithThisTag.indexOf(this)}`;
    }
    set name(val) {
      this.#name = val;
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
      return ordered;
    }
    /**
     * Proxy for this element's parent element with access to its properties,
     * methods, and attributes.
     * @type {proxy}
     */
    get parent() {
      return this.parentElement.this_element;
    }
    /**
     * This element's p5 instance.
     * @type {object}
     */
    get pInst() {
      return this.#pInst;
    }
    render() {}
    /**
     * Sets an attribute's value on this element.
     * @param {string} attributeName
     * @param {*} value
     */
    set(attributeName, value) {
      if (attributeName in this) {
        if (this.#updateFunctions.has(attributeName))
          this.#updateFunctions.delete(attributeName);
        this[attributeName] = value;
        return true;
      } else if (attributeName in this.pInst) {
        this.#updateFunctions.set(
          attributeName,
          () => (this.pInst[attributeName] = value)
        );
        return true;
      }
      console.error(
        `${this.tagName}'s ${attributeName} is being set to ${value} by another element, but it doesn't have a property by that name.`
      );
      return false;
    }
    /**
     * Sets this element up with a p5 instance and sets up its children.
     * @param {p5} pInst
     */
    setup(pInst, canvas) {
      this.#pInst = pInst;
      this.#frame_created = pInst.frameCount;
      this.#canvas = canvas;
      this.setDefaults?.();
      this.#setupEvalFns();
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
          `It looks like a ${this.tagName}'s ${attr.name} ` +
            `attribute has an open string. Check that each string has a beginning and end character.`
        );

      const getAssignPropRef = (str, obj = this) => {
        //  If string isn't already an array, split it on '.' characters
        const [beforeDot, ...afterDot] = Array.isArray(str)
          ? str
          : str.split(".");
        if (afterDot.length === 0) return [obj, beforeDot];
        return getAssignPropRef(afterDot, obj[beforeDot]);
      };
      const [assignObj, assignPropName] = getAssignPropRef(attr.name);

      if (assignObj === this && assignPropName in this === false)
        this.#customAttributeToProperty(assignPropName);
      const attrValueVarsReplaced = AttrParseUtil.replacePropNames(
        this,
        attr.name === "name" ? `'${attrJsStr}'` : attrJsStr,
        this instanceof HTMLCanvasElement ||
          assignPropName === "repeat" ||
          assignPropName === "change"
      );
      const varValue = AttrParseUtil.enclose(attrValueVarsReplaced);
      const evalFnName = `${this.tagName.toLowerCase()}_${attr.name}`.replace(
        /[^a-z0-9]/g,
        "_"
      );
      const fnHeader = `return function ${evalFnName}() {`;
      const fnBody = `return ${varValue};\n}`;
      const fnStr = [fnHeader, ...this.#comments, fnBody].join("\n");
      const evalFn = new Function(fnStr)();
      const updateFn = function () {
        return (assignObj[assignPropName] = evalFn.call(this));
      };
      this.#updateFunctions.set(attr.name, updateFn);
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
      const inheritedAttributes = new Set();
      let obj = this.parent;
      while (obj) {
        for (const { name } of obj.attributes) {
          inheritedAttributes.add(name);
        }
        if (obj.parent && obj.parent !== obj) obj = obj.parent;
        else break;
      }
      for (const propName of inheritedAttributes) {
        if (this.hasAttribute(propName)) continue;
        if (propName in this)
          this.#updateFunctions.set(propName, () => {
            return (this[propName] = this.parent[propName]);
          });
        else {
          Object.defineProperty(this, propName, {
            get: function () {
              if (typeof this.#state[propName] === "undefined")
                return this.parent[propName];
              return this.#state[propName];
            },
            set: function (val) {
              this.#state[propName] = val;
            },
          });
        }
      }
      const { orderedAttributeNames } = this;
      for (let i = 0; i < orderedAttributeNames.length; i++) {
        this.#setupEvalFn(this.attributes[orderedAttributeNames[i]]);
      }
    }
    #customAttributeToProperty(propName) {
      Object.defineProperty(this, propName, {
        get: function () {
          return this.#state[propName];
        },
        set: function (val) {
          this.#state[propName] = val;
        },
      });
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
    #updateAttribute(attrName) {
      const val = this.#callAttributeUpdater(attrName);
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
    updateState() {
      const updaters = this.#updateFunctions.entries();
      for (const [attrName, updateFunction] of updaters) {
        this.#updateAttribute(attrName);
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
  static overloads = [""];
  constructor() {
    super();
    /**
     * @private
     */
    this.renderFunctionName ||= kebabToCamel(
      this.tagName.toLowerCase().slice(2)
    );
  }
  /**
   * Sets the parameters used to call this element's render function based
   * on the overloads for that function and this element's attributes.
   * @private
   */
  #getArgumentsFromOverloads() {
    const { overloads } = this.constructor;
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
      const overloadParams = overloadsSplitSorted[i].map((param) => ({
        name: param.replaceAll(/\[|\]/g, ""),
        optional: isOptional(param),
      }));
      overloadMatch =
        i === overloadsSplitSorted.length - 1 ||
        overloadParams.every(
          ({ name, optional }) =>
            optional ||
            this.hasAttribute(name) ||
            this.attributeInherited(name) ||
            name === ""
        );

      //  If matched overload found
      if (overloadMatch) {
        const lastParamWithAttribute = overloadParams.findLastIndex(
          ({ name, optional }) => this.hasAttribute(name) || !optional
        );

        const filteredParams = overloadParams
          .slice(0, lastParamWithAttribute + 1)
          .map(({ name }) => name);
        return filteredParams;
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
      this.pInst[this.renderFunctionName](...args.map((param) => this[param]));
    };
  }
}
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
