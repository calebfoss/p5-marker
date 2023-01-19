//  regex
const $7a53813bc2528edd$var$upperCaseChar = /([A-Z])/g;
const $7a53813bc2528edd$var$upperCaseCharAfterFirst = /(?<!^)[A-Z]/g;
//  js string replace 2nd param
const $7a53813bc2528edd$var$prependMatch = (char)=>char + "$&";
const $7a53813bc2528edd$export$f38e744fd7a17882 = (camelStr)=>camelStr.replace($7a53813bc2528edd$var$upperCaseCharAfterFirst, $7a53813bc2528edd$var$prependMatch("-")).toLowerCase();
const $7a53813bc2528edd$export$e12f55f9c91df96a = (camelStr)=>camelStr.replace($7a53813bc2528edd$var$upperCaseCharAfterFirst, $7a53813bc2528edd$var$prependMatch("_")).toLowerCase();
const $7a53813bc2528edd$export$fd546b5ffd1f6a92 = (kebabStr)=>kebabStr.replace(/-./g, (s)=>s[1].toUpperCase());
const $7a53813bc2528edd$export$1e3da36a069282b8 = (pascalStr)=>pascalStr.slice(0, 1).toLowerCase() + pascalStr.slice(1);
const $7a53813bc2528edd$export$b797531657428303 = (pascalStr)=>$7a53813bc2528edd$export$1e3da36a069282b8(pascalStr).replaceAll($7a53813bc2528edd$var$upperCaseChar, (c)=>"-" + c.toLowerCase());
const $7a53813bc2528edd$export$c41e01cfc9033fe7 = (pascalStr)=>$7a53813bc2528edd$export$1e3da36a069282b8(pascalStr).replaceAll($7a53813bc2528edd$var$upperCaseChar, (c)=>"_" + c.toLowerCase());
const $7a53813bc2528edd$export$b70dcce1c70696bf = (snakeStr)=>snakeStr.split("_").map((s, i)=>i > 0 ? s.slice(0, 1).toUpperCase() + s.slice(1) : s).join("");


const $1e4b072929c69c2b$var$notExistingObjProp = "(?<![^\\.]\\.)";
const $1e4b072929c69c2b$var$legalVarName = "\\b[a-z$_][a-z0-9$_]*\\b";
const $1e4b072929c69c2b$var$notNewObjProp = "(?:(?!\\s*:)|(?<=\\?[^,]*))";
const $1e4b072929c69c2b$var$notBoolean = "(?<!\\btrue\\b)(?<!\\bfalse\\b)";
const $1e4b072929c69c2b$var$notNewKeyword = "(?<!\\bnew\\b)";
const $1e4b072929c69c2b$var$notProceededByOpenString = "(?=(?:[^\"'`](?:([\"'`]).*\\1)*)*$)";
const $1e4b072929c69c2b$var$varName = new RegExp($1e4b072929c69c2b$var$notExistingObjProp + $1e4b072929c69c2b$var$legalVarName + $1e4b072929c69c2b$var$notNewObjProp + $1e4b072929c69c2b$var$notBoolean + $1e4b072929c69c2b$var$notNewKeyword + $1e4b072929c69c2b$var$notProceededByOpenString, "gi");
class $1e4b072929c69c2b$export$25a3dda2d7b8a35b {
    static regex = {
        legalVarName: $1e4b072929c69c2b$var$legalVarName,
        notExistingObjProp: $1e4b072929c69c2b$var$notExistingObjProp,
        notNewObjProp: $1e4b072929c69c2b$var$notNewObjProp,
        notBoolean: $1e4b072929c69c2b$var$notBoolean,
        notNewKeyword: $1e4b072929c69c2b$var$notNewKeyword,
        notProceededByOpenString: $1e4b072929c69c2b$var$notProceededByOpenString,
        varName: $1e4b072929c69c2b$var$varName
    };
    static allQuotesMatched(str) {
        const quoteExps = [
            /"/g,
            /'/g,
            /`/g
        ];
        for(const i in quoteExps){
            const matches = str.match(quoteExps[i]);
            if (matches && matches.length % 2 !== 0) return false;
        }
        return true;
    }
    static enclose = (str)=>{
        const strMinusStrings = str.replace(/(["'`]).*?\1/gi, "");
        const items = strMinusStrings.split(/(?<!{[^}]*),/gi);
        const isObject = strMinusStrings.match(/^[^\?\{]*:/gi);
        if (items.length === 1 && !isObject) return str;
        const isUnenclosed = str.match(/(?<!\([^\)]*)(?<!{[^}]*)[,:]/gi) !== null;
        if (!isUnenclosed) return str;
        if (isObject) return `{${str}}`;
        return `[${str}]`;
    };
    static escapes = {
        LESS_THAN: "<",
        GREATER_THAN: ">",
        AT_LEAST: ">=",
        NO_MORE_THAN: "<=",
        AND: "&&",
        OR: "||",
        WHILE: ""
    };
    static isP5 = (name)=>p5.prototype.hasOwnProperty(name);
    static keywords = [
        "break",
        "case",
        "catch",
        "class",
        "const",
        "continue",
        "debugger",
        "default",
        "delete",
        "do",
        "else",
        "export",
        "extends",
        "false",
        "finally",
        "for",
        "function",
        "if",
        "import",
        "in",
        "instanceof",
        "new",
        "null",
        "return",
        "static",
        "super",
        "switch",
        "this",
        "throw",
        "true",
        "try",
        "typeof",
        "var",
        "void",
        "while",
        "with",
        "yield"
    ];
    static getOwnerName(el, prop) {
        if ($1e4b072929c69c2b$export$25a3dda2d7b8a35b.keywords.includes(prop) || prop in $1e4b072929c69c2b$export$25a3dda2d7b8a35b.escapes || prop in globalThis) return "none";
        if (prop in el) return "this";
        //  TODO - remove this temporary check when no longer needed
        if (prop in el.pInst && prop !== "width" && prop !== "height") return "pInst";
        return "inherited";
    }
    static getPrefix(el, prop) {
        const ownerName = $1e4b072929c69c2b$export$25a3dda2d7b8a35b.getOwnerName(el, prop);
        if (ownerName === "none") return "";
        if (ownerName.slice(0, 4) === "this") return `${ownerName}.`;
        else return `_${ownerName}.`;
    }
    static replacePropName(el, prop) {
        if (prop in $1e4b072929c69c2b$export$25a3dda2d7b8a35b.escapes) return $1e4b072929c69c2b$export$25a3dda2d7b8a35b.escapes[prop];
        return $1e4b072929c69c2b$export$25a3dda2d7b8a35b.getPrefix(el, prop) + prop;
    }
    static replacePropNames(el, str) {
        return str.replace(/UNTIL(.*)/, "!($1)").replace($1e4b072929c69c2b$export$25a3dda2d7b8a35b.regex.varName, (prop)=>$1e4b072929c69c2b$export$25a3dda2d7b8a35b.replacePropName(el, prop));
    }
}



function $1b3618ac1b6555cf$export$b61bda4fbca264f2(obj) {
    for(const p in obj)p5.prototype[p] = {};
    Object.defineProperties(p5.prototype, obj);
}
const $1b3618ac1b6555cf$export$e00416b3cd122575 = (methodName, wrapper)=>p5.prototype[methodName] = wrapper(p5.prototype[methodName]);
const $1b3618ac1b6555cf$export$49218a2feaa1d459 = (...propNames)=>propNames.forEach((propName)=>p5.prototype[(0, $7a53813bc2528edd$export$e12f55f9c91df96a)(propName)] = p5.prototype[propName]);
const $1b3618ac1b6555cf$export$44f806bc073ff27e = (...methodNames)=>methodNames.forEach((methodName)=>$1b3618ac1b6555cf$export$b61bda4fbca264f2({
            [(0, $7a53813bc2528edd$export$e12f55f9c91df96a)(methodName)]: {
                get: function() {
                    return this._renderer?.[`_${methodName}`];
                },
                set: function(val) {
                    if (Array.isArray(val)) this[methodName](...val);
                    else this[methodName](val);
                }
            }
        }));


const $03bbbf8eda9a336e$export$f5ddaad6515de8cc = (baseClass)=>class extends baseClass {
        /**
     * Creates a new <a href="#/p5.Camera">p5.Camera</a> object and sets it
     * as the current (active) camera.
     *
     * The new camera is initialized with a default position
     * (see camera property)
     * and a default perspective projection
     * (see <a href="#/p5.Camera/perspective">perspective()</a>).
     * Its properties can be controlled with the <a href="#/p5.Camera">p5.Camera</a>
     * methods.
     *
     * Note: Every 3D sketch starts with a default camera initialized.
     * This camera can be controlled with the canvas properties
     * camera,
     * perspective, ortho,
     * and frustum if it is the only camera
     * in the scene.
     * @method create_camera
     * @return {p5.Camera} The newly created camera object.
     */ create_camera() {
            this.pInst.createCamera();
        }
        /**
     * Creates a new <a href="#/p5.Shader">p5.Shader</a> object
     * from the provided vertex and fragment shader code.
     *
     * Note, shaders can only be used in WEBGL mode.
     * @method create_shader
     * @param {String} vertSrc source code for the vertex shader
     * @param {String} fragSrc source code for the fragment shader
     * @returns {p5.Shader} a shader object created from the provided
     */ create_shader() {
            this.pInst.createShader(...arguments);
        }
    };


const $60cbc2b134970376$export$bf2e82bce1545c45 = (baseClass)=>class extends baseClass {
        #background;
        /**
     * The background property sets the color or image used
     * for the background of the p5.js canvas. The default background is transparent.
     * A <a href="https://p5js.org/reference/#/p5.Color">p5.Color</a> object can be provided to set the background color.
     *
     * A <a href="https://p5js.org/reference/#/p5.Image">p5.Image</a> can also be provided to set the background image.
     *
     * The arguments to <a href="https://p5js.org/reference/#/p5/color">color()</a> can also be provided,
     * separated by commas.
     * @type {p5.Color|p5.Image}
     */ get background() {
            return this.#background;
        }
        set background(c) {
            if (c instanceof p5.Color || c instanceof p5.Image) this.#background = c;
            this.#background = this.pInst.color(c);
        }
        /**
     * Sets the cursor when hovering over the canvas.
     *
     * You can set cursor to any of the following constants:
     * ARROW, CROSS, HAND, MOVE, TEXT and WAIT
     *
     * You may also set cursor to the URL of an image file. The recommended size
     * is 16x16 or 32x32 pixels. (Allowed File extensions: .cur, .gif, .jpg, .jpeg, .png)
     *
     * For more information on Native CSS cursors and url visit:
     * https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
     *
     * You may also set cursor to "type, x, y", where type is one of the types above,
     * x is the horizontal active spot of the cursor (must be less than 32)
     * and
     * y is the vertical active spot of the cursor (must be less than 32)
     * @type {string}
     */ get cursor() {
            return this.style.cursor;
        }
        set cursor(val) {
            const { pInst: pInst  } = this;
            if (val === this.NONE) pInst.noCursor();
            else if (Array.isArray(val)) pInst.cursor(...val);
            else pInst.cursor(val);
        }
        get description() {
            const { pInst: pInst  } = this;
            const cnvId = this.id;
            const descContainer = pInst.dummyDOM.querySelector(`#${cnvId}_Description`);
            if (descContainer) return descContainer;
            const labelContainer = pInst.dummyDOM.querySelector(`#${cnvId}_Label`);
            return labelContainer;
        }
        set description(val) {
            if (Array.isArray(val)) this.pInst.describe(...val);
            else this.pInst.describe(val);
        }
        /**
     * The height of the canvas in pixels.
     * @type {number}
     */ get height() {
            return this.pInst.height;
        }
        set height(val) {
            if (val === this.height || isNaN(val)) return;
            this.#resize(this.width, val);
        }
        get orderedAttributeNames() {
            //  Remove 'is' and 'style' from attrNames
            return super.orderedAttributeNames.filter((v)=>v !== "is" && v != "style");
        }
        set loop(val) {
            if (val) this.pInst.loop();
            else this.pInst.noLoop();
        }
        #resize(w, h) {
            if (w === this.width && h === this.height) return;
            const { pInst: pInst  } = this;
            const props = {};
            for(const key in pInst.drawingContext){
                const val = pInst.drawingContext[key];
                if (typeof val !== "object" && typeof val !== "function") props[key] = val;
            }
            pInst.width = pInst._renderer.width = w;
            pInst.height = pInst._renderer.height = h;
            this.setAttribute("width", w * pInst._pixelDensity);
            this.setAttribute("height", h * pInst._pixelDensity);
            this.style.width = `${w}px`;
            this.style.height = `${h}px`;
            pInst.drawingContext.scale(pInst._pixelDensity, pInst._pixelDensity);
            for(const savedKey in props)try {
                pInst.drawingContext[savedKey] = props[savedKey];
            } catch (err) {}
            pInst.drawingContext.scale(pInst._pixelDensity, pInst._pixelDensity);
            pInst.redraw();
        }
        /**
     * The width of the canvas in pixels.
     * @type {number}
     */ get width() {
            return this.pInst.width;
        }
        set width(val) {
            if (val === this.width || isNaN(val)) return;
            this.#resize(val, this.height);
        }
    };


const $76bd26c91fab8e7c$export$5eb092502585022b = (baseClass)=>class extends baseClass {
        attributeInherited(attributeName) {
            if (this.hasAttribute(attributeName) || attributeName in this.defaults) return true;
            return super.attributeInherited(attributeName);
        }
        runCode() {
            const canvas = this;
            const sketch = (pInst)=>{
                canvas.defaults = {
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
                    size: 100,
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
                    change: {}
                };
                pInst.preload = ()=>pInst.loadAssets();
                pInst.setup = function() {
                    canvas.setup(pInst, canvas);
                    // Set default dimensions (100, 100)
                    canvas.width = 100;
                    canvas.height = 100;
                    //  Set default background to transparent
                    canvas.background = pInst.color(0, 0);
                    pInst.assignCanvas(canvas, canvas.constructor.renderer);
                };
                pInst.draw = function() {
                    const state = canvas.updateState(canvas.defaults);
                    pInst.background(canvas.background);
                    for (const child of canvas.children)child.draw?.(state);
                };
            };
            new p5(sketch);
        }
    };


const $063b9c440f4a940f$export$699475ba1140c5eb = (baseClass)=>class extends baseClass {
        get NONE() {
            return "#0000";
        }
    };
const $063b9c440f4a940f$export$b2e29383819ac3c4 = (baseClass)=>class extends baseClass {
        #stroke;
        /**
     * Sets the color used to draw lines and borders around shapes. This color
     * is either a <a href="#/p5.Color">p5.Color</a> object or a comma
     * separated list of values to pass into
     * <a href="https://p5js.org/reference/#/p5/color">color()</a>.
     * @type {p5.Color}
     */ get stroke() {
            return this.#stroke;
        }
        set stroke(val) {
            const { pInst: pInst  } = this;
            if (val === this.NONE) pInst.noStroke();
            else pInst.stroke(val);
            this.#stroke = pInst.color(pInst._renderer.isP3D ? pInst._renderer.curStrokeColor : pInst.drawingContext.strokeStyle);
        }
    };
const $063b9c440f4a940f$export$306219eb761ac4c2 = (baseClass)=>class extends $063b9c440f4a940f$export$b2e29383819ac3c4(baseClass) {
        #fill;
        /**
     * Sets the color used to fill shapes. This may be a
     * <a href="https://p5js.org/reference/#/p5.Color">p5.Color</a> object or
     * a comma separated list of values to pass into
     * <a href="https://p5js.org/reference/#/p5/color">color()</a>.
     * @type {p5.Color}
     */ get fill() {
            return this.#fill;
        }
        set fill(val) {
            const { pInst: pInst  } = this;
            if (val === this.NONE) pInst.noFill();
            else pInst.fill(val);
            this.#fill = pInst.color(pInst._renderer.isP3D ? pInst._renderer.curFillColor : pInst.drawingContext.fillStyle);
        }
    };


const $dfaf816c8f7968eb$export$df7182d31779a5d2 = (baseClass)=>class extends baseClass {
        lerp_color() {
            return this.pInst.lerpColor(...arguments);
        }
    };


const $db244738e3d6357d$export$a9e2f2714159e1ff = (baseClass)=>class extends baseClass {
        /**
     * The delta_time property contains the time
     * difference between the beginning of the previous frame and the beginning
     * of the current frame in milliseconds.
     *
     * This variable is useful for creating time sensitive animation or physics
     * calculation that should stay constant regardless of frame rate.
     * (read-only)
     * @readonly
     * @type {number}
     */ get delta_time() {
            return this.pInst.deltaTime;
        }
        /**
     * screen stores information about the screen displaying the canvas.
     * To get the dimensions of the screen, use:
     * ```
     * screen.width
     * screen.height
     * ```
     * screen is available in any browser and is not specific to this
     * library.
     * The full documentation is here:
     * https://developer.mozilla.org/en-US/docs/Web/API/Screen
     * (read-only)
     * @readonly
     */ get screen() {
            return screen;
        }
    };


(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_createFriendlyGlobalFunctionBinder", (base)=>function(options = {}) {
        return (prop, value)=>{
            const descriptor = Object.getOwnPropertyDescriptor(p5.prototype, prop);
            const globalObject = options.globalObject || window;
            if (typeof descriptor === "undefined" || descriptor.writable) return base.call(this, options)(prop, value);
            return Object.defineProperty(globalObject, prop, descriptor);
        };
    });
p5.prototype.WHILE = "while";
p5.prototype.UNTIL = "until";
p5.prototype.assignCanvas = function(c, r) {
    this.noCanvas();
    const mainDiv = document.querySelector("main");
    let index = 0;
    if (typeof c.id === "undefined") while(document.querySelector(`p5MarkerCanvas${index}`))index++;
    c.id = `p5MarkerCanvas${index}`;
    if (mainDiv.children.length === 0) mainDiv.remove();
    if (r === this.WEBGL) this._setProperty("_renderer", new p5.RendererGL(c, this, true));
    else //P2D mode
    this._setProperty("_renderer", new p5.Renderer2D(c, this, true));
    this._renderer._applyDefaults();
    this._setProperty("_elements", [
        this._renderer
    ]);
};
p5.prototype.assets = {};
p5.prototype.loadAssets = async function() {
    const assetElements = Array.from(document.querySelectorAll("p-asset"));
    const pInst = this;
    const promises = assetElements.map((el)=>el.load(pInst));
    const results = await Promise.all(promises);
    results.forEach((result, i)=>this.assets[assetElements[i].getAttribute("name")] = result);
    this._decrementPreload();
};
p5.prototype.registerPreloadMethod("loadAssets", p5.prototype);
p5.prototype._debug_attributes = true;
p5.prototype.create_canvas_element = function(elementName) {
    const createdElement = document.createElement(elementName);
    this.canvas.appendChild(createdElement);
    createdElement.setup(this, this.canvas);
    return createdElement;
};
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    object_assign: {
        set: function([target, ...sources]) {
            Object.assign(target, ...sources);
        }
    },
    debug_attributes: {
        get: function() {
            return this._debug_attributes;
        },
        set: function(val) {
            const valType = typeof val;
            if (typeof val === "boolean") this._debug_attributes = val;
            else console.error(`debug_attributes was set to a value of type ${valType} but may only be set to a boolean true/false value.`);
        }
    }
});
const $79ce0e365a23b6d5$var$attributePriorities = [
    "debug_attributes",
    "anchor",
    "angle",
    "scale_factor",
    "shear",
    "_default",
    "repeat",
    "change"
];
const $79ce0e365a23b6d5$export$a11dc51f2ecd743e = (baseClass)=>class P5Extension extends (0, $db244738e3d6357d$export$a9e2f2714159e1ff)((0, $dfaf816c8f7968eb$export$df7182d31779a5d2)((0, $063b9c440f4a940f$export$699475ba1140c5eb)((0, $03bbbf8eda9a336e$export$f5ddaad6515de8cc)(baseClass)))) {
        /**
     * This element's parent canvas.
     * @private
     */ #canvas;
        #frame_created;
        /**
     * @private
     */ #pInst;
        /**
     * @private
     */ #proxy = new Proxy(this, {
            get (target, prop) {
                if (prop in target) return target[prop];
                return target.#state[prop];
            },
            has (target, prop) {
                if (prop in target) return true;
                return prop in target.#state;
            },
            set (target, prop, val) {
                target.set(prop, val);
            }
        });
        /**
     * @private
     */ #state = {};
        /**
     * @private
     */ #updateFunctions = new Map();
        constructor(){
            super();
        }
        /**
     * Proxy for the sibling element above this element with access to its
     * properties, methods, and attributes.
     * @type {proxy}
     */ get above_sibling() {
            return this.previousElementSibling.this_element;
        }
        /**
     * True if siblings directly above this element with an "on" attribute have
     * "on" set to false. This can be used to switch between elements based on
     * conditions, similar to if/else.
     * @type {boolean}
     */ get above_siblings_off() {
            if (this === this.parentElement.firstElementChild) return true;
            const { above_sibling: above_sibling  } = this;
            if (above_sibling.on) return false;
            return above_sibling.above_siblings_off;
        }
        /**
     * @method applyChange
     * @private
     */ #applyChange() {
            const change = this.#state.change = this.#updateAttribute(this.#state, "change", this);
            let changed = false;
            const assignProp = (obj, prop)=>{
                if (prop in obj) {
                    const changeVal = change[prop];
                    changed ||= obj[prop] !== changeVal;
                    obj[prop] = changeVal;
                    if (this.pInst.debug_attributes) this.setAttribute(prop, changeVal);
                    return true;
                }
                return false;
            };
            for(const prop in change){
                assignProp(this, prop) || assignProp(this.#state, prop) || assignProp(this.pInst, prop) || console.error(`${this.constructor.elementName}'s change attribute has a prop called ${prop} that is unknown`);
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
     */ attributeInherited(attributeName) {
            const [obj, ...props] = attributeName.split(".");
            if (props.length) return this.attributeInherited(obj);
            if (this.parentElement.hasAttribute(attributeName)) return true;
            if (this.parentElement.attributeInherited) return this.parentElement.attributeInherited(attributeName);
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
     */ get blend_mode() {
            if (this.pInst._renderer.isP3D) return this.curBlendMode;
            return this.pInst.drawingContext.globalCompositeOperation;
        }
        set blend_mode(val) {
            this.pInst.blendMode(val);
        }
        /**
     * @private
     */ #callAttributeUpdater(inherited, attrName, thisArg) {
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
     */ get canvas() {
            return this.#canvas.this_element;
        }
        /**
     * Checks if this element is colliding with the provided other element.
     * @method colliding_with
     * @param {P5Element} el - other element to check
     * @returns {boolean} true if elements are colliding
     */ colliding_with(el) {
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
     */ get color_mode() {
            return this.pInst._colorMode;
        }
        set color_mode(val) {
            this.pInst.colorMode(val);
        }
        /**
     * @private
     */ get #comments() {
            return this.#html.split(/(?:\r\n|\r|\n)/).map((line)=>line.match(/.{1,80}/g)).flat().map((line)=>"//	" + line);
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
     */ draw(inherited) {
            if (this.hasAttribute("on")) {
                this.#state.on = this.#updateAttribute(inherited, "on", this.this_element);
                if (!this.#state.on) return;
            }
            this.pInst.push();
            this.updateState(inherited);
            const { WHILE: WHILE  } = p5.prototype;
            let repeat = true;
            while(repeat){
                this.render?.();
                for (const child of this.children)child.draw(this.#state);
                repeat = this.hasAttribute("repeat") && this.#state.repeat;
                const { change: change  } = this.#state;
                if (Array.isArray(repeat)) {
                    const [key, ...conditions] = this.#updateAttribute(this.#state, "repeat");
                    repeat = key === WHILE === conditions.every((c)=>c);
                }
                if (repeat) {
                    this.pInst.pop();
                    this.pInst.push();
                    const changed = this.#applyChange();
                    const updaters = this.#updateFunctions.entries();
                    for (const [attrName, updater] of updaters)if (attrName in change === false) this.#state[attrName] = this.#updateAttribute(inherited, attrName, this);
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
     */ get drawing_context() {
            return this.pInst.drawingContext;
        }
        set drawing_context(obj) {
            Object.assign(this.pInst.drawingContext, obj);
        }
        /**
     * Name of the HTML element generated from this class.
     * @type {string}
     */ static get elementName() {
            return `p-${(0, $7a53813bc2528edd$export$b797531657428303)(this.name)}`;
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
     */ get erase() {
            return this.pInst._renderer._isErasing;
        }
        set erase(val) {
            if (val === true) this.pInst.erase();
            else if (val === false) this.pInst.noErase();
            else if (Array.isArray(val)) this.pInst.erase(...val);
            else console.error(`${this.tagName}'s erase property was set using type ${typeof val}, but erase may only be set to a boolean or array.`);
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
     */ get first_frame() {
            return this.frame_count === 1;
        }
        /**
     * frame_count counts the number of frames this element has been
     * rendered. The first time this element is rendered, frame_count
     * with be 1. (read-only)
     * @type {number}
     */ get frame_count() {
            return this.pInst.frameCount - this.#frame_created;
        }
        /**
     * @private
     */ get #html() {
            return this.outerHTML.replace(this.innerHTML, "");
        }
        /**
     * List of attribute names in the order in which they will be evaluated.
     * Element attributes are not guaranteed to be in the order in which they
     * are written. Transformation attributes are prioritized before others
     * and use this order: anchor, angle, scale_factor, shear.
     * @type {Array}
     */ get orderedAttributeNames() {
            const ordered = Array.from(this.attributes).sort(({ name: a  }, { name: b  })=>($79ce0e365a23b6d5$var$attributePriorities.indexOf(a) + 1 || $79ce0e365a23b6d5$var$attributePriorities.indexOf("_default")) - ($79ce0e365a23b6d5$var$attributePriorities.indexOf(b) + 1 || $79ce0e365a23b6d5$var$attributePriorities.indexOf("_default"))).map(({ name: name  })=>name);
            this.transformDoneIndex = ordered.findLastIndex((attrName)=>$79ce0e365a23b6d5$var$attributePriorities.includes(attrName)) + 1;
            return ordered;
        }
        /**
     * Proxy for this element's parent element with access to its properties,
     * methods, and attributes.
     * @type {proxy}
     */ get parent_element() {
            return this.parentElement.this_element;
        }
        /**
     * This element's p5 instance.
     * @type {object}
     */ get pInst() {
            return this.#pInst;
        }
        /**
     * Sets an attribute's value on this element.
     * @param {string} attributeName
     * @param {*} value
     */ set(attributeName, value) {
            if (attributeName in this) {
                this.#updateFunctions.set(attributeName, ()=>this[attributeName] = value);
                this[attributeName] = value;
            } else this.#updateFunctions.set(attributeName, ()=>value);
            this.#state[attributeName] = value;
        }
        /**
     * Sets this element up with a p5 instance and sets up its children.
     * @param {p5} pInst
     */ setup(pInst, canvas) {
            this.#pInst = pInst;
            this.#frame_created = pInst.frameCount;
            this.#canvas = canvas;
            this.setDefaults?.();
            this.#setupEvalFns?.();
            this.setupRenderFunction?.();
            for (const child of this.children)child.setup(pInst, canvas);
        }
        /**
     * @private
     */ #setupEvalFn(attr) {
            //  The attribute's value will be modified, then run as JS
            const attrJsStr = attr.value;
            //  TODO - catch improperly ordered quote marks: "foo'var"'
            if ((0, $1e4b072929c69c2b$export$25a3dda2d7b8a35b).allQuotesMatched(attrJsStr) === false) console.error(`It looks like a ${this.constructor.elementName}'s ${attr.name} ` + `attribute has an open string. Check that each string has a beginning and end character.`);
            const getOwnerName = (prop)=>{
                if (prop in this) return "this";
                //  TODO - remove condition when p5 props have been moved to elments
                if (prop in this.pInst && typeof this.pInst[prop] !== "function" && prop !== "width" && prop !== "height") return "this.pInst";
                if (this.attributeInherited(prop)) return "inherited";
            };
            const owner = getOwnerName(attr.name);
            //  This is plural because there may be a prop name within
            //  Ex:  myArray[i]
            const varName = (0, $1e4b072929c69c2b$export$25a3dda2d7b8a35b).replacePropNames(this, attr.name);
            const attrValueVarsReplaced = (0, $1e4b072929c69c2b$export$25a3dda2d7b8a35b).replacePropNames(this, attrJsStr);
            const varValue = (0, $1e4b072929c69c2b$export$25a3dda2d7b8a35b).enclose(attrValueVarsReplaced);
            const evalFnName = `${this.constructor.name}_${attr.name.replace(/[^a-z0-9]/g, "_")}`;
            const fnHeader = `return function ${evalFnName}(_pInst, _inherited) {`;
            //  TODO Fix this mess
            const fnBody = owner === "inherited" && !attr.name.includes(".") ? `return ${varValue};\n}` : `return ${varName} = ${varValue};\n};`;
            const fnStr = [
                fnHeader,
                ...this.#comments,
                fnBody
            ].join("\n");
            const evalFn1 = new Function(fnStr)();
            this.#updateFunctions.set(attr.name, evalFn1);
        }
        /**
     * @private
     */ #setupEvalFns() {
            if (this.hasAttribute("repeat") && !this.hasAttribute("change")) {
                console.error(`It looks like a ${this.constructor.elementName} has a repeat attribute ` + "but does not have a change attribute. The change attribute is required to " + "prevent infinite loops.");
                this.removeAttribute("repeat");
            }
            const { orderedAttributeNames: orderedAttributeNames , transformDoneIndex: transformDoneIndex  } = this;
            for(let i = 0; i < orderedAttributeNames.length; i++){
                if (i === transformDoneIndex) this.#updateFunctions.set("transform_matrix", function() {
                    this.transform_matrix = this.pInst.transform_matrix;
                });
                this.#setupEvalFn(this.attributes[orderedAttributeNames[i]]);
            }
        }
        /**
     * This element's proxy with access to properties, methods, and attributes.
     */ get this_element() {
            return this.#proxy;
        }
        /**
     * @private
     * @param {*} inherited
     * @param {*} attrName
     * @param {*} thisArg
     * @returns
     */ #updateAttribute(inherited1, attrName1, thisArg1) {
            if (attrName1 === "repeat" || attrName1 === "change") inherited1 = this.#state;
            const val = this.#callAttributeUpdater(inherited1, attrName1, thisArg1);
            //  Setting canvas width or height resets the drawing context
            //  Only set the attribute if it's not one of those
            if (this.pInst.debug_attributes === false) return val;
            if (this instanceof HTMLCanvasElement && (attrName1 === "width" || attrName1 === "height")) return val;
            //  Brackets will throw a 'not a valid attribute name' error
            if (attrName1.match(/[\[\]]/)) return val;
            const valToString = (v)=>{
                if (v instanceof p5.Color) return v.toString(this.pInst.color_mode);
                if (typeof v?.toString === "undefined") return v;
                return v.toString();
            };
            this.setAttribute(attrName1, valToString(val));
            return val;
        }
        /**
     * Updates the values of all attributes using the provided expressions.
     * @param {Object} inherited - object
     * @returns
     */ updateState(inherited) {
            for(const prop in inherited){
                if (prop in this) this[prop] = inherited[prop];
                this.#state[prop] = inherited[prop];
            }
            const updaters = this.#updateFunctions.entries();
            for (const [attrName, updateFunction] of updaters)this.#state[attrName] = this.#updateAttribute(inherited, attrName, this);
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
     */ get webgl_attributes() {
            return this.pInst._glAttributes;
        }
        set webgl_attributes(val) {
            this.pInst.setAttributes(...arguments);
        }
    };
class $79ce0e365a23b6d5$export$82fefa1d40d42487 extends $79ce0e365a23b6d5$export$a11dc51f2ecd743e(HTMLElement) {
}
class $79ce0e365a23b6d5$export$66cca51e2e9c1a33 extends $79ce0e365a23b6d5$export$82fefa1d40d42487 {
    constructor(overloads, renderFunctionName){
        super();
        /**
     * @private
     */ this.overloads = overloads;
        /**
     * @private
     */ this.renderFunctionName = renderFunctionName || (0, $7a53813bc2528edd$export$fd546b5ffd1f6a92)(this.tagName.toLowerCase().slice(2));
    }
    /**
   * Sets the parameters used to call this element's render function based
   * on the overloads for that function and this element's attributes.
   * @private
   */ #getArgumentsFromOverloads() {
        const { overloads: overloads  } = this;
        //  Check every required parameter has an attribute
        const isOptional = (param)=>param.match(/^\[.*\]$/);
        let overloadMatch = false;
        //  Split the parameters and start with overloads with most parameters
        const overloadsSplitSorted = overloads.map((o)=>o.split(",").map((p)=>p.trim())).sort((a, b)=>a.length - b.length);
        //  If there aren't any overloads, return an empty array
        if (overloadsSplitSorted.length === 0) return [];
        for(let i = 0; i < overloadsSplitSorted.length; i++){
            const overloadParams = overloadsSplitSorted[i];
            overloadMatch = overloadParams.every((p)=>this.hasAttribute(p) || this.attributeInherited(p) || isOptional(p) || p === "" || i === overloadsSplitSorted.length - 1 && this.attributeInherited(p));
            //  If matched overload found
            if (overloadMatch) {
                //  Filter params recursively
                const filterParams = (overloadParams, filteredParams = [], i = 0)=>{
                    //  If there are no more overload params, return filtered params
                    if (i === overloadParams.length) return filteredParams;
                    const optional = isOptional(overloadParams[i]);
                    const p = overloadParams[i].replaceAll(/\[|\]/g, "");
                    //  If param defined on this element, add it to filtered params
                    if (this.hasAttribute(p)) return filterParams(overloadParams, filteredParams.concat({
                        owner: this.this_element,
                        param: p
                    }), ++i);
                    //  If not defined on this element and optional, return filtered params
                    if (optional) return filteredParams;
                    //  If required and already initialized, add it to filtered params
                    if (this.attributeInherited(p)) return filterParams(overloadParams, filteredParams.concat({
                        owner: this.this_element,
                        param: p
                    }), ++i);
                    return filteredParams;
                };
                return filterParams(overloadParams);
            }
        }
        console.error(`Element ${this.tagName} does not have the required attributes to render and will be removed from the sketch`);
        this.remove();
    }
    /**
   * @private
   */ setupRenderFunction() {
        const args = this.#getArgumentsFromOverloads();
        this.render = function() {
            this.pInst[this.renderFunctionName](...args.map(({ param: param , owner: owner  })=>owner[param]));
        };
    }
}
/**
 * The blank `<_>` element renders nothing to the canvas. This is useful
 * for adjusting attributes for child elements.
 * @element _
 */ class $79ce0e365a23b6d5$var$_ extends $79ce0e365a23b6d5$export$82fefa1d40d42487 {
    constructor(){
        super();
    }
}
customElements.define("p-_", $79ce0e365a23b6d5$var$_);





/**
 * The `<canvas>` element is a rectangular area of the window for rendering
 * imagery. All child elements are rendered to the canvas.
 *
 * This canvas will render 2D elements only. For a 3D canvas, use
 * ```<canvas-3d>```.
 */ class $a7d17c9282527449$var$Canvas extends (0, $76bd26c91fab8e7c$export$5eb092502585022b)((0, $60cbc2b134970376$export$bf2e82bce1545c45)((0, $79ce0e365a23b6d5$export$a11dc51f2ecd743e)(HTMLCanvasElement))) {
    static renderer = "p2d";
    constructor(){
        super();
        window.addEventListener("customElementsDefined", this.runCode.bind(this));
    }
}
customElements.define("p-canvas", $a7d17c9282527449$var$Canvas, {
    extends: "canvas"
});
/**
 * The ```<canvas-3d>``` element is a ```<canvas>``` element
 * for rendering 3D elements.
 */ class $a7d17c9282527449$var$WebGLCanvas extends (0, $76bd26c91fab8e7c$export$5eb092502585022b)((0, $60cbc2b134970376$export$bf2e82bce1545c45)((0, $79ce0e365a23b6d5$export$a11dc51f2ecd743e)(HTMLCanvasElement))) {
    #debug_mode;
    #orbit_control;
    static renderer = "webgl";
    constructor(){
        super();
        window.addEventListener("customElementsDefined", this.runCode.bind(this));
    }
    /**
   * Sets the current (active) camera of a 3D sketch.
   * Allows for switching between multiple cameras.
   *
   * Comma-separated arguments for
   * <a href="https://p5js.org/reference/#/p5/camera">camera()</a>
   * may also be provided to adjust the current camera.
   *
   * @type {p5.Camera}
   * */ get camera() {
        return this.pInst._renderer._curCamera;
    }
    set camera(val) {
        const { pInst: pInst  } = this;
        if (val instanceof p5.Camera) pInst.setCamera(val);
        else if (Array.isArray(val)) pInst.camera(...val);
        else pInst.camera(val);
    }
    /**
   * debug_mode helps visualize 3D space by adding a grid to indicate where the
   * ‘ground’ is in a sketch and an axes icon which indicates the +X, +Y, and +Z
   * directions. This property can be set to "true" to create a
   * default grid and axes icon, or it can be set to a comma-separated list
   * of values to pass into
   * <a href="https://p5js.org/reference/#/p5/debugMode">debugMode()</a>.
   *
   * By default, the grid will run through the origin (0,0,0) of the sketch
   * along the XZ plane
   * and the axes icon will be offset from the origin.  Both the grid and axes
   * icon will be sized according to the current canvas size.
   * Note that because the
   * grid runs parallel to the default camera view, it is often helpful to use
   * debug_mode along with orbit_control to allow full view of the grid.
   * @type {boolean}
   */ get debug_mode() {
        return this.#debug_mode;
    }
    set debug_mode(val) {
        const { pInst: pInst  } = this;
        if (val === false) {
            pInst.noDebugMode();
            this.#debug_mode = false;
            return;
        } else if (val === true) pInst.debugMode();
        else if (Array.isArray(val)) pInst.debugMode(...val);
        else pInst.debugMode(val);
        this.#debug_mode = true;
    }
    /**
   * Allows movement around a 3D sketch using a mouse or trackpad.
   * Left-clicking and dragging will rotate the camera position about the
   * center of the sketch,
   * right-clicking and dragging will pan the camera position without rotation,
   * and using the mouse wheel (scrolling) will move the camera closer or
   * further
   * from the center of the sketch. This property can be set with parameters
   * dictating sensitivity to mouse movement along the X, Y, and Z axes.
   * Setting orbit_control="true" is equivalent to setting
   * orbit_control="1, 1".
   * To reverse direction of movement in either axis, enter a negative number
   * for sensitivity.
   * @type {boolean}
   * */ get orbit_control() {
        return this.#orbit_control;
    }
    set orbit_control(val) {
        if (val === false) return this.#orbit_control = false;
        this.#orbit_control = true;
        if (Array.isArray(val)) return this.pInst.orbitControl(...val);
        this.pInst.orbitControl();
    }
    /**
   * Sets an orthographic projection for the current camera in a 3D sketch
   * and defines a box-shaped viewing frustum within which objects are seen.
   * In this projection, all objects with the same dimension appear the same
   * size, regardless of whether they are near or far from the camera.
   *
   * This may be set to a comma-separated list of arguments to
   * <a href="https://p5js.org/reference/#/p5/ortho">ortho()</a>
   *
   * If set to "true", the following default is used:
   * ortho(-width/2, width/2, -height/2, height/2).
   *
   * @type {boolean}
   */ set ortho(val) {
        if (val === true) this.pInst.ortho();
        else if (Array.isArray(val)) this.pInst.ortho(...val);
        else if (val !== false) this.pInst.ortho(val);
    }
}
customElements.define("p-canvas-3d", $a7d17c9282527449$var$WebGLCanvas, {
    extends: "canvas"
});


/*
Repo: https://github.com/bmoren/p5.collide2D/
Created by http://benmoren.com
Some functions and code modified version from http://www.jeffreythompson.org/collision-detection
Version v0.7.3 | June 22, 2020
CC BY-NC-SA 4.0
*/ p5.prototype._collide_debug = false;
p5.prototype.collide_debug = function(debugMode) {
    _collideDebug = debugMode;
};
p5.prototype.collider_type = {
    point: "point",
    circle: "circle",
    ellipse: "ellipse",
    rect: "rect",
    line: "line",
    arc: "arc",
    triangle: "triangle",
    poly: "poly"
};
p5.prototype.collide_elements = function(elementA, elementB) {
    const { collider: colliderA  } = elementA;
    const { collider: colliderB  } = elementB;
    const argsA = elementA.collision_args;
    const argsB = elementB.collision_args;
    const fnNameForward = `collide_${colliderA}_${colliderB}`;
    if (fnNameForward in this) return this[fnNameForward](...argsA, ...argsB);
    const fnNameBackward = `collide_${colliderB}_${colliderA}`;
    if (fnNameBackward in this) return this[fnNameBackward](...argsB, ...argsA);
    console.warn(`Collision check between ${colliderA} and ${colliderB} has not been implemented`);
    return false;
};
/*~++~+~+~++~+~++~++~+~+~ 2D ~+~+~++~+~++~+~+~+~+~+~+~+~+~+~+*/ p5.prototype.collide_rect_rect = function(x, y, w, h, x2, y2, w2, h2) {
    //2d
    //add in a thing to detect rectMode CENTER
    if (x + w >= x2 && // r1 right edge past r2 left
    x <= x2 + w2 && // r1 left edge past r2 right
    y + h >= y2 && // r1 top edge past r2 bottom
    y <= y2 + h2) // r1 bottom edge past r2 top
    return true;
    return false;
};
// p5.vector version of collideRectRect
p5.prototype.collide_rect_rect_vector = function(p1, sz, p2, sz2) {
    return p5.prototype.collide_rect_rect(p1.x, p1.y, sz.x, sz.y, p2.x, p2.y, sz2.x, sz2.y);
};
p5.prototype.collide_rect_circle = function(rx, ry, rw, rh, cx, cy, diameter) {
    //2d
    // temporary variables to set edges for testing
    var testX = cx;
    var testY = cy;
    // which edge is closest?
    if (cx < rx) testX = rx; // left edge
    else if (cx > rx + rw) testX = rx + rw;
     // right edge
    if (cy < ry) testY = ry; // top edge
    else if (cy > ry + rh) testY = ry + rh;
     // bottom edge
    // // get distance from closest edges
    var distance = this.dist(cx, cy, testX, testY);
    // if the distance is less than the radius, collision!
    if (distance <= diameter / 2) return true;
    return false;
};
// p5.vector version of collideRectCircle
p5.prototype.collide_rect_circle_vector = function(r, sz, c, diameter) {
    return p5.prototype.collide_rect_circle(r.x, r.y, sz.x, sz.y, c.x, c.y, diameter);
};
p5.prototype.collide_circle_circle = function(x, y, d, x2, y2, d2) {
    //2d
    if (this.dist(x, y, x2, y2) <= d / 2 + d2 / 2) return true;
    return false;
};
// p5.vector version of collideCircleCircle
p5.prototype.collide_circle_circle_vector = function(p1, d, p2, d2) {
    return p5.prototype.collide_circle_circle(p1.x, p1.y, d, p2.x, p2.y, d2);
};
p5.prototype.collide_point_circle = function(x, y, cx, cy, d) {
    //2d
    if (this.dist(x, y, cx, cy) <= d / 2) return true;
    return false;
};
// p5.vector version of collidePointCircle
p5.prototype.collide_point_circle_vector = function(p, c, d) {
    return p5.prototype.collide_point_circle(p.x, p.y, c.x, c.y, d);
};
p5.prototype.collide_point_ellipse = function(x, y, cx, cy, dx, dy) {
    //2d
    var rx = dx / 2, ry = dy / 2;
    // Discarding the points outside the bounding box
    if (x > cx + rx || x < cx - rx || y > cy + ry || y < cy - ry) return false;
    // Compare the point to its equivalent on the ellipse
    var xx = x - cx, yy = y - cy;
    var eyy = ry * this.sqrt(this.abs(rx * rx - xx * xx)) / rx;
    return yy <= eyy && yy >= -eyy;
};
// p5.vector version of collidePointEllipse
p5.prototype.collide_point_ellipse_vector = function(p, c, d) {
    return p5.prototype.collide_point_ellipse(p.x, p.y, c.x, c.y, d.x, d.y);
};
p5.prototype.collide_point_rect = function(pointX, pointY, x, y, xW, yW) {
    //2d
    if (pointX >= x && // right of the left edge AND
    pointX <= x + xW && // left of the right edge AND
    pointY >= y && // below the top AND
    pointY <= y + yW) // above the bottom
    return true;
    return false;
};
// p5.vector version of collidePointRect
p5.prototype.collide_point_rect_vector = function(point, p1, sz) {
    return p5.prototype.collide_point_rect(point.x, point.y, p1.x, p1.y, sz.x, sz.y);
};
//  TODO - Accommodate lines with higher stroke_weight
p5.prototype.collide_point_line = function(px, py, x1, y1, x2, y2, buffer) {
    // get distance from the point to the two ends of the line
    var d1 = this.dist(px, py, x1, y1);
    var d2 = this.dist(px, py, x2, y2);
    // get the length of the line
    var lineLen = this.dist(x1, y1, x2, y2);
    // since floats are so minutely accurate, add a little buffer zone that will give collision
    if (buffer === undefined) buffer = 0.1;
     // higher # = less accurate
    // if the two distances are equal to the line's length, the point is on the line!
    // note we use the buffer here to give a range, rather than one #
    if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) return true;
    return false;
};
// p5.vector version of collidePointLine
p5.prototype.collide_point_line_vector = function(point, p1, p2, buffer) {
    return p5.prototype.collide_point_line(point.x, point.y, p1.x, p1.y, p2.x, p2.y, buffer);
};
p5.prototype.collide_line_circle = function(x1, y1, x2, y2, cx, cy, diameter) {
    // is either end INSIDE the circle?
    // if so, return true immediately
    var inside1 = this.collide_point_circle(x1, y1, cx, cy, diameter);
    var inside2 = this.collide_point_circle(x2, y2, cx, cy, diameter);
    if (inside1 || inside2) return true;
    // get length of the line
    var distX = x1 - x2;
    var distY = y1 - y2;
    var len = this.sqrt(distX * distX + distY * distY);
    // get dot product of the line and circle
    var dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / this.pow(len, 2);
    // find the closest point on the line
    var closestX = x1 + dot * (x2 - x1);
    var closestY = y1 + dot * (y2 - y1);
    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    var onSegment = this.collide_point_line(closestX, closestY, x1, y1, x2, y2);
    if (!onSegment) return false;
    // draw a debug circle at the closest point on the line
    if (this._collideDebug) this.ellipse(closestX, closestY, 10, 10);
    // get distance to closest point
    distX = closestX - cx;
    distY = closestY - cy;
    var distance = this.sqrt(distX * distX + distY * distY);
    if (distance <= diameter / 2) return true;
    return false;
};
// p5.vector version of collideLineCircle
p5.prototype.collide_line_circle_vector = function(p1, p2, c, diameter) {
    return p5.prototype.collide_line_circle(p1.x, p1.y, p2.x, p2.y, c.x, c.y, diameter);
};
p5.prototype.collide_line_line = function(x1, y1, x2, y2, x3, y3, x4, y4, calcIntersection) {
    var intersection;
    // calculate the distance to intersection point
    var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        if (this._collideDebug || calcIntersection) {
            // calc the point where the lines meet
            var intersectionX = x1 + uA * (x2 - x1);
            var intersectionY = y1 + uA * (y2 - y1);
        }
        if (this._collideDebug) this.ellipse(intersectionX, intersectionY, 10, 10);
        if (calcIntersection) {
            intersection = {
                x: intersectionX,
                y: intersectionY
            };
            return intersection;
        } else return true;
    }
    if (calcIntersection) {
        intersection = {
            x: false,
            y: false
        };
        return intersection;
    }
    return false;
};
// p5.vector version of collideLineLine
p5.prototype.collide_line_line_vector = function(p1, p2, p3, p4, calcIntersection) {
    return p5.prototype.collide_line_line(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y, calcIntersection);
};
p5.prototype.collide_line_rect = function(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {
    // check if the line has hit any of the rectangle's sides. uses the collideLineLine function above
    var left, right, top, bottom, intersection;
    if (calcIntersection) {
        left = this.collide_line_line(x1, y1, x2, y2, rx, ry, rx, ry + rh, true);
        right = this.collide_line_line(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh, true);
        top = this.collide_line_line(x1, y1, x2, y2, rx, ry, rx + rw, ry, true);
        bottom = this.collide_line_line(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh, true);
        intersection = {
            left: left,
            right: right,
            top: top,
            bottom: bottom
        };
    } else {
        //return booleans
        left = this.collide_line_line(x1, y1, x2, y2, rx, ry, rx, ry + rh);
        right = this.collide_line_line(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
        top = this.collide_line_line(x1, y1, x2, y2, rx, ry, rx + rw, ry);
        bottom = this.collide_line_line(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);
    }
    // if ANY of the above are true, the line has hit the rectangle
    if (left || right || top || bottom) {
        if (calcIntersection) return intersection;
        return true;
    }
    return false;
};
// p5.vector version of collideLineRect
p5.prototype.collide_line_rect_vector = function(p1, p2, r, rsz, calcIntersection) {
    return p5.prototype.collide_line_rect(p1.x, p1.y, p2.x, p2.y, r.x, r.y, rsz.x, rsz.y, calcIntersection);
};
p5.prototype.collide_point_poly = function(px, py, vertices) {
    var collision = false;
    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for(var current = 0; current < vertices.length; current++){
        // get next vertex in list if we've hit the end, wrap around to 0
        next = current + 1;
        if (next === vertices.length) next = 0;
        // get the PVectors at our current position this makes our if statement a little cleaner
        var vc = vertices[current]; // c for "current"
        var vn = vertices[next]; // n for "next"
        // compare position, flip 'collision' variable back and forth
        if ((vc.y >= py && vn.y < py || vc.y < py && vn.y >= py) && px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x) collision = !collision;
    }
    return collision;
};
// p5.vector version of collidePointPoly
p5.prototype.collide_point_poly_vector = function(p1, vertices) {
    return p5.prototype.collide_point_poly(p1.x, p1.y, vertices);
};
// POLYGON/CIRCLE
p5.prototype.collide_circle_poly = function(cx, cy, diameter, vertices, interior) {
    if (interior === undefined) interior = false;
    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for(var current = 0; current < vertices.length; current++){
        // get next vertex in list if we've hit the end, wrap around to 0
        next = current + 1;
        if (next === vertices.length) next = 0;
        // get the PVectors at our current position this makes our if statement a little cleaner
        var vc = vertices[current]; // c for "current"
        var vn = vertices[next]; // n for "next"
        // check for collision between the circle and a line formed between the two vertices
        var collision = this.collide_line_circle(vc.x, vc.y, vn.x, vn.y, cx, cy, diameter);
        if (collision) return true;
    }
    // test if the center of the circle is inside the polygon
    if (interior === true) {
        var centerInside = this.collide_point_poly(cx, cy, vertices);
        if (centerInside) return true;
    }
    // otherwise, after all that, return false
    return false;
};
// p5.vector version of collideCirclePoly
p5.prototype.collide_circle_poly_vector = function(c, diameter, vertices, interior) {
    return p5.prototype.collide_circle_poly(c.x, c.y, diameter, vertices, interior);
};
p5.prototype.collide_rect_poly = function(rx, ry, rw, rh, vertices, interior) {
    if (interior == undefined) interior = false;
    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for(var current = 0; current < vertices.length; current++){
        // get next vertex in list if we've hit the end, wrap around to 0
        next = current + 1;
        if (next === vertices.length) next = 0;
        // get the PVectors at our current position this makes our if statement a little cleaner
        var vc = vertices[current]; // c for "current"
        var vn = vertices[next]; // n for "next"
        // check against all four sides of the rectangle
        var collision = this.collide_line_rect(vc.x, vc.y, vn.x, vn.y, rx, ry, rw, rh);
        if (collision) return true;
        // optional: test if the rectangle is INSIDE the polygon note that this iterates all sides of the polygon again, so only use this if you need to
        if (interior === true) {
            var inside = this.collide_point_poly(rx, ry, vertices);
            if (inside) return true;
        }
    }
    return false;
};
// p5.vector version of collideRectPoly
p5.prototype.collide_rect_poly_vector = function(r, rsz, vertices, interior) {
    return p5.prototype.collide_rect_poly(r.x, r.y, rsz.x, rsz.y, vertices, interior);
};
p5.prototype.collide_line_poly = function(x1, y1, x2, y2, vertices) {
    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for(var current = 0; current < vertices.length; current++){
        // get next vertex in list if we've hit the end, wrap around to 0
        next = current + 1;
        if (next === vertices.length) next = 0;
        // get the PVectors at our current position extract X/Y coordinates from each
        var x3 = vertices[current].x;
        var y3 = vertices[current].y;
        var x4 = vertices[next].x;
        var y4 = vertices[next].y;
        // do a Line/Line comparison if true, return 'true' immediately and stop testing (faster)
        var hit = this.collide_line_line(x1, y1, x2, y2, x3, y3, x4, y4);
        if (hit) return true;
    }
    // never got a hit
    return false;
};
// p5.vector version of collideLinePoly
p5.prototype.collide_line_poly_vector = function(p1, p2, vertice) {
    return p5.prototype.collide_line_poly(p1.x, p1.y, p2.x, p2.y, vertice);
};
p5.prototype.collide_poly_poly = function(p1, p2, interior) {
    if (interior === undefined) interior = false;
    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for(var current = 0; current < p1.length; current++){
        // get next vertex in list, if we've hit the end, wrap around to 0
        next = current + 1;
        if (next === p1.length) next = 0;
        // get the PVectors at our current position this makes our if statement a little cleaner
        var vc = p1[current]; // c for "current"
        var vn = p1[next]; // n for "next"
        //use these two points (a line) to compare to the other polygon's vertices using polyLine()
        var collision = this.collide_line_poly(vc.x, vc.y, vn.x, vn.y, p2);
        if (collision) return true;
        //check if the either polygon is INSIDE the other
        if (interior === true) {
            collision = this.collide_point_poly(p2[0].x, p2[0].y, p1);
            if (collision) return true;
            collision = this.collide_point_poly(p1[0].x, p1[0].y, p2);
            if (collision) return true;
        }
    }
    return false;
};
p5.prototype.collide_poly_poly_vector = function(p1, p2, interior) {
    return p5.prototype.collide_poly_poly(p1, p2, interior);
};
p5.prototype.collide_point_triangle = function(px, py, x1, y1, x2, y2, x3, y3) {
    // get the area of the triangle
    var areaOrig = this.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
    // get the area of 3 triangles made between the point and the corners of the triangle
    var area1 = this.abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py));
    var area2 = this.abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py));
    var area3 = this.abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py));
    // if the sum of the three areas equals the original, we're inside the triangle!
    if (area1 + area2 + area3 === areaOrig) return true;
    return false;
};
// p5.vector version of collidePointTriangle
p5.prototype.collide_point_triangle_vector = function(p, p1, p2, p3) {
    return p5.prototype.collide_point_triangle(p.x, p.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
};
p5.prototype.collide_point_point = function(x, y, x2, y2, buffer) {
    if (buffer === undefined) buffer = 0;
    if (this.dist(x, y, x2, y2) <= buffer) return true;
    return false;
};
// p5.vector version of collidePointPoint
p5.prototype.collide_point_point_vector = function(p1, p2, buffer) {
    return p5.prototype.collide_point_point(p1.x, p1.y, p2.x, p2.y, buffer);
};
//  TODO - accommodate arcs with unequal width and height
p5.prototype.collide_point_arc = function(px, py, ax, ay, arcRadius, arcHeading, arcAngle, buffer) {
    if (buffer === undefined) buffer = 0;
    // point
    var point = this.createVector(px, py);
    // arc center point
    var arcPos = this.createVector(ax, ay);
    // arc radius vector
    var radius = this.createVector(arcRadius, 0).rotate(arcHeading);
    var pointToArc = point.copy().sub(arcPos);
    if (point.dist(arcPos) <= arcRadius + buffer) {
        var dot = radius.dot(pointToArc);
        var angle = radius.angleBetween(pointToArc);
        if (dot > 0 && angle <= arcAngle / 2 && angle >= -arcAngle / 2) return true;
    }
    return false;
};
// p5.vector version of collidePointArc
p5.prototype.collide_point_arc_vector = function(p1, a, arcRadius, arcHeading, arcAngle, buffer) {
    return p5.prototype.collide_point_arc(p1.x, p1.y, a.x, a.y, arcRadius, arcHeading, arcAngle, buffer);
};




const $f2731110a32ba8b7$export$767c784c12981b7a = (baseClass)=>class extends baseClass {
        #x;
        #y;
        /**
     * The x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get x() {
            return this.#x;
        }
        set x(val) {
            if (!isNaN(val)) this.#x = Number(val);
            else console.error(`${this.tagName}'s x property is being set to ${val}, but it may only be set to a number`);
        }
        /**
     * The y-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get y() {
            return this.#y;
        }
        set y(val) {
            if (!isNaN(val)) this.#y = Number(val);
            else console.error(`${this.tagName}'s y property is being set to ${val}, but it may only be set to a number`);
        }
    };
const $f2731110a32ba8b7$export$339b9be62e060004 = (baseClass)=>class extends $f2731110a32ba8b7$export$767c784c12981b7a(baseClass) {
        #z;
        /**
     * The z-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get z() {
            return this.#z;
        }
        set z(val) {
            if (!isNaN(val)) this.#z = Number(val);
            else console.error(`${this.tagName}'s z property is being set to ${val}, but it may only be set to a number`);
        }
    };
const $f2731110a32ba8b7$export$5f4909ba2c08017a = (baseClass)=>class extends baseClass {
        #height;
        #width;
        /**
     * The height of the element in pixels.
     * @type {number}
     */ get height() {
            return this.#height;
        }
        set height(val) {
            if (!isNaN(val)) this.#height = Number(val);
            else console.error(`${this.tagName}'s height is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The width of the element in pixels.
     * @type {number}
     */ get width() {
            return this.#width;
        }
        set width(val) {
            if (!isNaN(val)) this.#width = Number(val);
            else console.error(`${this.tagName}'s width is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$export$d38590504f301641 = (baseClass)=>class extends baseClass {
        #x1;
        #y1;
        #x2;
        #y2;
        /**
     * The first x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get x1() {
            return this.#x1;
        }
        set x1(val) {
            if (!isNaN(val)) this.#x1 = val;
            else console.error(`${this.tagName}'s x1 is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The first y-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get y1() {
            return this.#y1;
        }
        set y1(val) {
            if (!isNaN(val)) this.#y1 = val;
            else console.error(`${this.tagName}'s y1 is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The second x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get x2() {
            return this.#x2;
        }
        set x2(val) {
            if (!isNaN(val)) this.#x2 = val;
            else console.error(`${this.tagName}'s x2 is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The second y-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get y2() {
            return this.#y2;
        }
        set y2(val) {
            if (!isNaN(val)) this.#y2 = val;
            else console.error(`${this.tagName}'s y2 is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$export$e9cb68263e7b8eb3 = (baseClass)=>class extends baseClass {
        #x3;
        #y3;
        /**
     * The third x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get x3() {
            return this.#x3;
        }
        set x3(val) {
            if (!isNaN(val)) this.#x3 = val;
            else console.error(`${this.tagName}'s x3 is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The third y-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get y3() {
            return this.#y3;
        }
        set y3(val) {
            if (!isNaN(val)) this.#y3 = val;
            else console.error(`${this.tagName}'s y3 is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$export$9772409c44dd5b8c = (baseClass)=>class extends $f2731110a32ba8b7$export$d38590504f301641($f2731110a32ba8b7$export$e9cb68263e7b8eb3(baseClass)) {
    };
const $f2731110a32ba8b7$export$b29aca5fbcfded71 = (baseClass)=>class extends $f2731110a32ba8b7$export$d38590504f301641(baseClass) {
        #z1;
        #z2;
        /**
     * The first x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get z1() {
            return this.#z1;
        }
        set z1(val) {
            if (!isNaN(val)) this.#z1 = val;
            else console.error(`${this.tagName}'s z1 is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The second x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get z2() {
            return this.#z2;
        }
        set z2(val) {
            if (!isNaN(val)) this.#z2 = val;
            else console.error(`${this.tagName}'s z2 is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$export$7757a7d90505b04a = (baseClass)=>class extends baseClass {
        #rect_mode;
        /**
     * Modifies the location from which rectangles are drawn by changing the way
     * in which x and y coordinates are interpreted.
     *
     * The default mode is CORNER, which interprets the x and y as the
     * upper-left corner of the shape.
     *
     * rect_mode="CORNERS" interprets x and y as the location of
     * one of the corners, and width and height as the location of
     * the diagonally opposite corner. Note, the rectangle is drawn between the
     * coordinates, so it is not necessary that the first corner be the upper left
     * corner.
     *
     * rect_mode="CENTER" interprets x and y as the shape's center
     * point.
     *
     * rect_mode="RADIUS" also uses x and y as the shape's
     * center
     * point, but uses width and height to specify half of the shape's
     * width and height respectively.
     *
     * The value to this property must be written in ALL CAPS because they are
     * predefined as constants in ALL CAPS.
     *
     * @type {CORNER|CORNERS|CENTER|RADIUS}
     */ get rect_mode() {
            return this.#rect_mode;
        }
        set rect_mode(mode) {
            this.pInst.rectMode(mode);
            this.#rect_mode = this.pInst._renderer._rectMode;
        }
    };


const $f83208cc1173e373$var$transformVertexFn = (el)=>(v)=>{
        const originalPoint = new DOMPoint(v.x, v.y);
        const { x: x , y: y  } = el.pInst._transform_point_matrix(originalPoint, el.transform_matrix);
        return el.pInst.createVector(x, y);
    };
const $f83208cc1173e373$var$addXYZ1234 = (baseClass)=>class extends (0, $f2731110a32ba8b7$export$b29aca5fbcfded71)((0, $f2731110a32ba8b7$export$e9cb68263e7b8eb3)(baseClass)) {
        #z3;
        #z4;
        #y4;
        /**
     * The fourth y-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get y4() {
            return this.#y4;
        }
        set y4(val) {
            if (!isNaN(val)) this.#y4 = val;
            else console.error(`${this.tagName}'s y4 is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The first x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get z3() {
            return this.#z3;
        }
        set z3(val) {
            if (!isNaN(val)) this.#z3 = val;
            else console.error(`${this.tagName}'s z3 is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The fourth z-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get z4() {
            return this.#z4;
        }
        set z4(val) {
            if (!isNaN(val)) this.#z4 = val;
            else console.error(`${this.tagName}'s z4 is being set to ${val}, but it may only be set to a number.`);
        }
    };
/**
 * Draws an arc to the screen. If called with only x, y, w, h, start and stop
 * the arc will be drawn and filled as an open pie segment. If a mode
 * parameter is provided, the arc will be filled like an open semi-circle
 * (OPEN), a closed semi-circle (CHORD), or as a closed pie segment (PIE).
 * The origin may be changed with the ellipseMode() function.
 *
 * The arc is always drawn clockwise from wherever start falls to wherever
 * stop falls on the ellipse. Adding or subtracting TWO_PI to either angle
 * does not change where they fall. If both start and stop fall at the same
 * place, a full ellipse will be drawn. Be aware that the y-axis increases in
 * the downward direction, therefore angles are measured clockwise from the
 * positive x-direction ("3 o'clock").
 * @element arc
 */ class $f83208cc1173e373$var$Arc extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)))) {
    constructor(){
        super([
            "x, y, width, height, start_angle, stop_angle, [mode], [detail], [a]"
        ]);
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        const { x: x , y: y , width: width , height: height , start_angle: start_angle , stop_angle: stop_angle  } = this;
        console.assert(width === height, "mouse_over currently only works for arc's with equal width and height.");
        const arcRadius = width / 2;
        const arcAngle = stop_angle - start_angle;
        const arcRotation = start_angle + arcAngle / 2;
        return this.pInst.collide_point_arc(mouse_trans_pos_x, mouse_trans_pos_y, x, y, arcRadius, arcRotation, arcAngle);
    }
}
customElements.define("p-arc", $f83208cc1173e373$var$Arc);
/**
 * Draws an ellipse (oval) to the screen. If no height is specified, the
 * value of width is used for both the width and height. If a
 * negative height or width is specified, the absolute value is taken.
 *
 * An ellipse with equal width and height is a circle. The origin may be
 * changed with the ellipseMode() function.
 * @element ellipse
 */ class $f83208cc1173e373$var$Ellipse extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)))) {
    constructor(){
        super([
            "x, y, width, [height]",
            "x, y, width, height, [detail]"
        ]);
    }
    collider = p5.prototype.collider_type.ellipse;
    get collision_args() {
        const originalPoint = new DOMPoint(this.this_element.x, this.this_element.y);
        const { x: x , y: y  } = this.pInst._transform_point_matrix(originalPoint, this.transform_matrix);
        const { pixel_density: pixel_density  } = this.pInst;
        const { w: w  } = this.width * pixel_density;
        const { h: h  } = this.height * pixel_density || w;
        return [
            x,
            y,
            w,
            h
        ];
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        const { x: x , y: y , width: width , height: height  } = this.this_element;
        return this.pInst.collide_point_ellipse(mouse_trans_pos_x, mouse_trans_pos_y, x, y, width, height);
    }
}
customElements.define("p-ellipse", $f83208cc1173e373$var$Ellipse);
/**
 * Draws a circle to the screen. A circle is a simple closed shape. It is the
 * set of all points in a plane that are at a given distance from a given
 * point, the center.
 * @element circle
 */ class $f83208cc1173e373$var$Circle extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    constructor(){
        super([
            "x, y, d"
        ]);
    }
    collider = p5.prototype.collider_type.circle;
    get collision_args() {
        const originalPoint = new DOMPoint(this.x, this.y);
        const { x: x , y: y  } = this.pInst._transform_point_matrix(originalPoint, this.transform_matrix);
        const d = this.this_element.d * this.pInst.pow(this.pInst.pixel_density, 2);
        return [
            x,
            y,
            d
        ];
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        const { x: x , y: y , d: d  } = this.this_element;
        return this.pInst.collide_point_circle(mouse_trans_pos_x, mouse_trans_pos_y, x, y, d);
    }
}
customElements.define("p-circle", $f83208cc1173e373$var$Circle);
/**
 * Draws a line (a direct path between two points) to the screen. This width
 * can be modified by using the stroke_weight attribute. A line cannot be
 * filled, therefore the fill_color attribute will not affect the color of a
 * line. So to color a line, use the stroke attribute.
 * @element line
 */ class $f83208cc1173e373$var$Line extends (0, $f2731110a32ba8b7$export$b29aca5fbcfded71)((0, $063b9c440f4a940f$export$b2e29383819ac3c4)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    constructor(){
        super([
            "x1, y1, x2, y2",
            "x1, y1, z1, x2, y2, z2"
        ]);
    }
    collider = p5.prototype.collider_type.line;
    get collision_args() {
        const originalStart = new DOMPoint(this.this_element.x1, this.this_element.y1);
        const { x: x1 , y: y1  } = this.pInst._transform_point_matrix(originalStart, this.transform_matrix);
        const originalEnd = new DOMPoint(this.this_element.x2, this.this_element.y2);
        const { x: x2 , y: y2  } = this.pInst._transform_point_matrix(originalEnd, this.transform_matrix);
        return [
            x1,
            y1,
            x2,
            y2
        ];
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        const { x1: x1 , y1: y1 , x2: x2 , y2: y2  } = this.this_element;
        return this.pInst.collide_point_line(mouse_trans_pos_x, mouse_trans_pos_y, x1, y1, x2, y2);
    }
}
customElements.define("p-line", $f83208cc1173e373$var$Line);
/**
 * Draws a point, a coordinate in space at the dimension of one pixel. The
 * color of the point is changed with the stroke attribute. The size of
 * the point can be changed with the stroke_weight attribute.
 * @element point
 */ class $f83208cc1173e373$var$Point extends (0, $f2731110a32ba8b7$export$339b9be62e060004)((0, $063b9c440f4a940f$export$b2e29383819ac3c4)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    constructor(){
        super([
            "x, y, [z]"
        ]);
    }
    collider = p5.prototype.collider_type.circle;
    get collision_args() {
        const originalPoint = new DOMPoint(this.x, this.y);
        const { x: x , y: y  } = this.pInst._transform_point_matrix(originalPoint, this.transform_matrix);
        const { stroke_weight: stroke_weight , pixel_density: pixel_density  } = this.pInst;
        const d = stroke_weight * this.pInst.pow(pixel_density, 2);
        return [
            x,
            y,
            d
        ];
    }
    get mouse_over() {
        const { x: x , y: y , stroke_weight: stroke_weight , pixel_density: pixel_density , mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this;
        const d = stroke_weight * this.pInst.pow(pixel_density, 2);
        return this.pInst.collide_point_circle(mouse_trans_pos_x, mouse_trans_pos_y, x, y, d);
    }
}
customElements.define("p-point", $f83208cc1173e373$var$Point);
/**
 * Draws a quad on the canvas. A quad is a quadrilateral, a four-sided
 * polygon. It is similar to a rectangle, but the angles between its edges
 * are not constrained to ninety degrees. The x1 and y1 attributes set the
 * first vertex and the subsequent pairs should proceed clockwise or
 * counter-clockwise around the defined shape. z attributes only work when
 * quad() is used in WEBGL mode.
 * @element quad
 */ class $f83208cc1173e373$var$Quad extends $f83208cc1173e373$var$addXYZ1234((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    constructor(){
        super([
            "x1, y1, x2, y2, x3, y3, x4, y4, [detail_x], [detail_y]",
            "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, [detail_x], [detail_y]"
        ]);
    }
    collider = p5.prototype.collider_type.poly;
    get collision_args() {
        return [
            this.vertices.map($f83208cc1173e373$var$transformVertexFn(this))
        ];
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        return this.pInst.collide_point_poly(mouse_trans_pos_x, mouse_trans_pos_y, this.vertices);
    }
    get vertices() {
        const { x1: x1 , y1: y1 , x2: x2 , y2: y2 , x3: x3 , y3: y3 , x4: x4 , y4: y4  } = this;
        return [
            this.pInst.createVector(x1, y1),
            this.pInst.createVector(x2, y2),
            this.pInst.createVector(x3, y3),
            this.pInst.createVector(x4, y4)
        ];
    }
}
customElements.define("p-quad", $f83208cc1173e373$var$Quad);
/**
 * Draws a rectangle on the canvas. A rectangle is a four-sided closed shape
 * with every angle at ninety degrees. By default, the x and y attributes
 * set the location of the upper-left corner, w sets the width, and h sets
 * the height. The way these attributes are interpreted may be changed with
 * the rect_mode attribute.
 *
 * The tl, tr, br and bl attributes, if specified, determine
 * corner radius for the top-left, top-right, lower-right and lower-left
 * corners, respectively. An omitted corner radius parameter is set to the
 * value of the previously specified radius value in the attribute list.
 * @element rect
 */ class $f83208cc1173e373$var$Rect extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $f2731110a32ba8b7$export$7757a7d90505b04a)((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))))) {
    constructor(){
        super([
            "x, y, width, [h], [tl], [tr], [br], [bl]",
            "x, y, width, height, [detail_x], [detail_y]"
        ]);
    }
    collider = p5.prototype.collider_type.rect;
    get collision_args() {
        const originalPoint = new DOMPoint(this.x, this.y);
        const { x: x , y: y  } = this.pInst._transform_point_matrix(originalPoint, this.transform_matrix);
        const { pixel_density: pixel_density  } = this.pInst;
        const w = this.width * this.pInst.pow(pixel_density, 2);
        const h = this.height * this.pInst.pow(pixel_density, 2);
        return [
            x,
            y,
            w,
            h
        ];
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        const { x: x , y: y , width: width , height: height  } = this;
        return this.pInst.collide_point_rect(mouse_trans_pos_x, mouse_trans_pos_y, x, y, width, height);
    }
}
customElements.define("p-rect", $f83208cc1173e373$var$Rect);
/**
 * Draws a square to the screen. A square is a four-sided shape with every
 * angle at ninety degrees, and equal side size. This element is a special
 * case of the rect element, where the width and height are the same, and the
 * attribute is called "s" for side size. By default, the x and y attributes
 * set the location of the upper-left corner, and s sets the side size of the
 * square. The way these attributes are interpreted, may be changed with the
 * rect_mode attribute.
 *
 * The tl, tr, br, and bl attributes, if specified, determine corner radius
 * for the top-left, top-right, lower-right and lower-left corners,
 * respectively. An omitted corner radius attribute is set to the value of
 * the previously specified radius value in the attribute list.
 *
 * @element square
 */ class $f83208cc1173e373$var$Square extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$7757a7d90505b04a)((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)))) {
    #size;
    constructor(){
        super([
            "x, y, size, [tl], [tr], [br], [bl]"
        ]);
    }
    collider = p5.prototype.collider_type.rect;
    get collision_args() {
        const originalPoint = new DOMPoint(this.x, this.y);
        const { x: x , y: y  } = this.pInst._transform_point_matrix(originalPoint, this.transform_matrix);
        const { pixel_density: pixel_density  } = this.pInst;
        const { size: size  } = this;
        const w = size * this.pInst.pow(pixel_density, 2);
        const h = w;
        return [
            x,
            y,
            w,
            h
        ];
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        const { x: x , y: y , s: s  } = this;
        return this.pInst.collide_point_rect(mouse_trans_pos_x, mouse_trans_pos_y, x, y, s, s);
    }
    /**
   * The side size of the square
   * @type {number}
   */ get size() {
        return this.#size;
    }
    set size(val) {
        if (!isNaN(val)) this.#size = Number(val);
        else console.error(`${this.tagName}'s size is being set to ${val}, but it may only be set to a number.`);
    }
}
customElements.define("p-square", $f83208cc1173e373$var$Square);
/**
 * Draws a triangle to the canvas. A triangle is a plane created by connecting
 * three points. x1 and y1 specify the first point, x2 and y2 specify the
 * second point, and x3 and y3 specify the
 * third point.
 * @element triangle
 */ class $f83208cc1173e373$var$Triangle extends (0, $f2731110a32ba8b7$export$9772409c44dd5b8c)((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    constructor(){
        const overloads = [
            "x1, y1, x2, y2, x3, y3"
        ];
        super(overloads);
    }
    collider = p5.prototype.collider_type.poly;
    get collision_args() {
        return [
            this.vertices.map($f83208cc1173e373$var$transformVertexFn(this))
        ];
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        const { x1: x1 , y1: y1 , x2: x2 , y2: y2 , x3: x3 , y3: y3  } = this;
        return this.pInst.collide_point_triangle(mouse_trans_pos_x, mouse_trans_pos_y, x1, y1, x2, y2, x3, y3);
    }
    get vertices() {
        const { x1: x1 , y1: y1 , x2: x2 , y2: y2 , x3: x3 , y3: y3  } = this;
        return [
            this.pInst.createVector(x1, y1),
            this.pInst.createVector(x2, y2),
            this.pInst.createVector(x3, y3)
        ];
    }
}
customElements.define("p-triangle", $f83208cc1173e373$var$Triangle);
/**
 * Draws a cubic Bezier curve on the screen. These curves are defined by a
 * series of anchor and control points. x1 and y1 specify
 * the first anchor point and x4 and y4 specify the other
 * anchor point, which become the first and last points on the curve. (x2, y2)
 * and (x3, y3) specify the two control points which define the shape
 * of the curve. Approximately speaking, control points "pull" the curve
 * towards them.
 *
 * Bezier curves were developed by French automotive engineer Pierre Bezier,
 * and are commonly used in computer graphics to define gently sloping curves.
 * ```<curve>``` element.
 * @element bezier
 */ class $f83208cc1173e373$var$Bezier extends $f83208cc1173e373$var$addXYZ1234((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    constructor(){
        super([
            "x1, y1, x2, y2, x3, y3, x4, y4",
            "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4"
        ]);
    }
}
customElements.define("p-bezier", $f83208cc1173e373$var$Bezier);
class $f83208cc1173e373$var$Curve extends $f83208cc1173e373$var$addXYZ1234((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    constructor(){
        super([
            "x1, y1, x2, y2, x3, y3, x4, y4",
            "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4"
        ]);
    }
}
customElements.define("p-curve", $f83208cc1173e373$var$Curve);
class $f83208cc1173e373$var$Contour extends (0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)) {
    constructor(){
        super([
            ""
        ], "beginContour");
    }
    endRender() {
        this.pInst.endContour();
    }
}
customElements.define("p-contour", $f83208cc1173e373$var$Contour);
class $f83208cc1173e373$var$Shape extends (0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)) {
    constructor(){
        super([
            "[kind]"
        ], "beginShape");
    }
    collider = p5.prototype.collider_type.poly;
    get collision_args() {
        return [
            this.vertices.map($f83208cc1173e373$var$transformVertexFn(this))
        ];
    }
    endRender(assigned) {
        if (assigned.hasOwnProperty("mode")) this.pInst.endShape(assigned.mode);
        else this.pInst.endShape();
    }
    get vertices() {
        const arrayFromChildren = (el)=>{
            const ca = Array.from(el.children);
            return ca.concat(ca.map(arrayFromChildren)).flat();
        };
        const childArray = arrayFromChildren(this);
        const vertexChildren = childArray.filter((el)=>el instanceof $f83208cc1173e373$var$Vertex && el.this_element);
        const vertices = vertexChildren.map((el)=>{
            if (el instanceof $f83208cc1173e373$var$QuadraticVertex) {
                const { x3: x3 , y3: y3  } = el;
                return this.pInst.createVector(x3, y3);
            }
            const { x: x , y: y  } = el;
            return this.pInst.createVector(x, y);
        });
        return vertices.concat(vertices.slice(0));
    }
}
customElements.define("p-shape", $f83208cc1173e373$var$Shape);
class $f83208cc1173e373$var$Vertex extends (0, $f2731110a32ba8b7$export$339b9be62e060004)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)) {
    constructor(){
        super([
            "x, y, [z], [u], [v]"
        ]);
    }
}
customElements.define("p-vertex", $f83208cc1173e373$var$Vertex);
class $f83208cc1173e373$var$QuadraticVertex extends (0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33) {
    constructor(){
        super([
            "cx, cy, x3, y3",
            "cx, cy, cz, x3, y3, z3"
        ]);
    }
}
customElements.define("p-quadratic-vertex", $f83208cc1173e373$var$QuadraticVertex);
class $f83208cc1173e373$var$CurveVertex extends (0, $f2731110a32ba8b7$export$339b9be62e060004)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)) {
    constructor(){
        super([
            "x, y",
            "x, y, [z]"
        ]);
    }
}
customElements.define("p-curve-vertex", $f83208cc1173e373$var$CurveVertex);



p5.prototype.window_resized = false;
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onresize", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("window_resized", true);
    });
p5.prototype.registerMethod("post", function() {
    this._setProperty("window_resized", false);
});
p5.prototype._fullscreen = p5.prototype.fullscreen;
p5.prototype._width = p5.prototype.width;
p5.prototype._height = p5.prototype.height;
p5.prototype._createDescriptionContainer = function() {
    const cnvId = this.canvas.id;
    const descriptionContainer = document.createElement("div");
    descriptionContainer.setAttribute("id", `${cnvId}_Description`);
    descriptionContainer.setAttribute("role", "region");
    descriptionContainer.setAttribute("aria-label", "Canvas Description");
    const p = document.createElement("p");
    p.setAttribute("id", `${cnvId}_fallbackDesc`);
    descriptionContainer.append(p);
    this.canvas.append(descriptionContainer);
    return descriptionContainer;
};
const $9e35468b3662e610$var$fallbackDescId = "_fallbackDesc";
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_describeHTML", (base)=>function(type, text) {
        const cnvId = this.canvas.id;
        const describeId = `#${cnvId}_Description`;
        if (type === "fallback") {
            if (!this.dummyDOM.querySelector(describeId)) {
                const fallback = this._createDescriptionContainer().querySelector(`#${cnvId}_fallbackDesc`);
                fallback.innerHTML = text;
            } else base.call(this, type, text);
            //if the container for the description exists
            this.descriptions.fallback = this.dummyDOM.querySelector(`#${cnvId}${$9e35468b3662e610$var$fallbackDescId}`);
            this.descriptions.fallback.innerHTML = text;
        }
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_describeElementHTML", (base)=>function(type, name, text) {
        const cnvId = this.canvas.id;
        if (type === "fallback" && !this.dummyDOM.querySelector(`#${cnvId}_Description`)) this._createDescriptionContainer();
        base.call(this, type, name, text);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_createOutput", (base)=>function(type, display) {
        const cnvId = this.canvas.id;
        if (!this.dummyDOM) this.dummyDOM = document.getElementById(cnvId).parentNode;
        if ((type === "textOutput" || type === "gridOutput") && !this.dummyDOM.querySelector(`#${cnvId}accessibleOutput${display}`)) this._createDescriptionContainer();
        base.call(this, type, display);
    });
p5.prototype.registerMethod("post", function() {
    if (this.text_output || this.grid_output) this._updateAccsOutput();
});
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    frame_rate: {
        get: function() {
            return this._frameRate;
        },
        set: function(val) {
            this.frameRate(val);
        }
    },
    fullscreen: {
        get: function() {
            return this._fullscreen();
        },
        set: function(val) {
            this._fullscreen(val);
        }
    },
    window_width: {
        get: function() {
            return this.windowWidth;
        }
    },
    window_height: {
        get: function() {
            return this.windowHeight;
        }
    },
    grid_output: {
        get: function() {
            return this._accessibleOutputs.grid;
        },
        set: function(val) {
            if (val === true) this.gridOutput();
            else this.gridOutput(val);
        }
    },
    pixel_density: {
        get: function() {
            return this.pixelDensity();
        },
        set: function(val) {
            this.pixelDensity(val);
        }
    },
    description: {
        set: function(val) {
            this.describeElement(...val);
        }
    },
    display_density: {
        get: function() {
            return this.displayDensity();
        }
    },
    url: {
        get: function() {
            return this.getURL();
        }
    },
    url_path: {
        get: function() {
            return this.getURLPath();
        }
    },
    url_params: {
        get: function() {
            return this.getURLParams();
        }
    },
    log: {
        set: function(val) {
            this.print(val);
        }
    },
    text_output: {
        get: function() {
            return this._accessibleOutputs.text;
        },
        set: function(val) {
            if (val === true) this.textOutput();
            else this.textOutput(val);
        }
    }
});




/**
 * Clears the pixels within a buffer. This element only clears the canvas.
 * It will not clear objects created by create_x() functions such as
 * create_video() or create_div().
 * Unlike the main graphics context, pixels in additional graphics areas created
 * with create_graphics() can be entirely
 * or partially transparent. This element clears everything to make all of
 * the pixels 100% transparent.
 *
 * Note: In WebGL mode, this element can have attributes set to normalized RGBA
 * color values in order to clear the screen to a specific color.
 * In addition to color, it will also clear the depth buffer.
 * If you are not using the webGL renderer these color values will have no
 * effect.
 *
 * @element clear
 * @attribute {Number} r normalized red val.
 * @attribute {Number} g normalized green val.
 * @attribute {Number} b normalized blue val.
 * @attribute {Number} a normalized alpha val.
 */ class $6dd9f8b96c98a786$var$Clear extends (0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33) {
    constructor(){
        super([
            "",
            "r, g, b, a"
        ]);
    }
}
customElements.define("p-clear", $6dd9f8b96c98a786$var$Clear);
/**
 * The ```<paint-bucket>``` element fills the canvas with a particular color or
 * image.
 *
 * @element paint-bucket
 * @attribute {p5.Color} color  any value created by the <a href="#/p5/color">color
 * @attribute {String} colorstring color string, possible formats include: integer
 *                         rgb() or rgba(), percentage rgb() or rgba(),
 *                         3-digit hex, 6-digit hex
 * @attribute {Number} [a]         opacity of the background relative to current
 *                             color range (default is 0-255)
 * @attribute {Number} gray   specifies a value between white and black
 * @attribute {Number} v1     red or hue value (depending on the current color
 *                        mode)
 * @attribute {Number} v2     green or saturation value (depending on the current
 *                        color mode)
 * @attribute {Number} v3     blue or brightness value (depending on the current
 *                        color mode)
 * @attribute  {Number[]}      values  an array containing the red, green, blue
 *                                 and alpha components of the color
 * @attribute {p5.Image} image    image loaded via an ```<asset>``` (must be
 *                                  same size as the sketch window)
 */ class $6dd9f8b96c98a786$var$PaintBucket extends (0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33) {
    constructor(){
        super([
            "c",
            "colorstring, [a]",
            "gray, [a]",
            "v1, v2, v3, [a]"
        ], "background");
    }
}
customElements.define("p-paint-bucket", $6dd9f8b96c98a786$var$PaintBucket);



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
 */ class $109b9a5ca7a37440$var$Sketch extends HTMLLinkElement {
    static elementName = "p-sketch";
    constructor(){
        super();
        this.#loadXML(this.href);
    }
    #convertElement(xmlEl) {
        const xmlTag = xmlEl.tagName;
        const createElementArguments = this.#xmlTagToCreateElementArguments(xmlTag);
        const pEl = document.createElement(...createElementArguments);
        this.#copyAttributes(xmlEl, pEl);
        if (xmlTag === "custom") pEl.define();
        return pEl;
    }
    #convertAllElements(xmlEl1, parent = document.body) {
        const pEl1 = this.#convertElement(xmlEl1);
        parent.appendChild(pEl1);
        for(let i = 0; i < xmlEl1.children.length; i++)this.#convertAllElements(xmlEl1.children[i], pEl1);
    }
    #convertXML(e) {
        const xml = e.target.response.documentElement;
        this.#convertAllElements(xml);
        document.querySelectorAll("canvas").forEach((canvas)=>canvas.runCode());
    }
    #copyAttributes(orig, copy) {
        const attrs = orig.attributes;
        for(let i1 = 0; i1 < attrs.length; i1++){
            const attr = attrs[i1];
            copy.setAttribute(attr.name, attr.value);
        }
    }
    #loadXML(path) {
        if (!path) return console.error("p-sketch element is missing required path attribute");
        const request = new XMLHttpRequest();
        request.open("GET", path);
        request.responseType = "document";
        request.overrideMimeType("text/xml");
        request.addEventListener("load", this.#convertXML.bind(this));
        request.send();
    }
    #xmlTagToCreateElementArguments(xmlTag1) {
        if (xmlTag1.slice(0, 2) === "p-") return [
            xmlTag1
        ];
        if (xmlTag1 === "canvas") return [
            xmlTag1,
            {
                is: "p-canvas"
            }
        ];
        if (xmlTag1 === "canvas-3d") return [
            "canvas",
            {
                is: "p-canvas-3d"
            }
        ];
        return [
            "p-" + xmlTag1
        ];
    }
}
customElements.define("p-sketch", $109b9a5ca7a37440$var$Sketch, {
    extends: "link"
});
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
 */ class $109b9a5ca7a37440$var$Custom extends (0, $79ce0e365a23b6d5$export$82fefa1d40d42487) {
    constructor(){
        super();
        if (this.attributes.length) this.define(this);
    }
    /**
   * Defines the custom element created by this element.
   */ define() {
        const pCustomEl = this;
        const name = pCustomEl.getAttribute("name");
        //  Trick custom-elements-manifest into ignoring this
        customElements["define"](`p-${name}`, class extends (0, $79ce0e365a23b6d5$export$82fefa1d40d42487) {
            constructor(){
                super();
            }
            /**
         * Sets the default values for this element's attributes.
         */ setDefaults() {
                Array.from(pCustomEl.attributes).forEach((a)=>this.hasAttribute(a.name) === false && this.setAttribute(a.name, a.value));
                const childClones = Array.from(pCustomEl.children).map((child)=>child.cloneNode(true));
                this.prepend(...childClones);
            }
            renderToCanvas = null;
        });
    }
}
customElements.define("p-custom", $109b9a5ca7a37440$var$Custom);
class $109b9a5ca7a37440$var$Asset extends HTMLElement {
    static elementName = "p-asset";
    constructor(){
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
        shader: "loadShader"
    };
    async load(pInst) {
        if (this.data) return this.data;
        const loadFn = $109b9a5ca7a37440$var$Asset.loadFns[this.getAttribute("type").toLowerCase()];
        const path = this.getAttribute("path");
        this.data = await pInst[loadFn](path);
        return this.data;
    }
}
customElements.define("p-asset", $109b9a5ca7a37440$var$Asset);



const $c7ffc8b66df47534$var$pointTangentOverload = (fn)=>function() {
        const args = arguments;
        if (args.length !== 9) return fn(...args);
        return this.createVector(fn(args[0], args[2], args[4], args[6], args[8]), fn(args[1], args[3], args[5], args[7], args[8]));
    };
p5.prototype.bezierPoint = $c7ffc8b66df47534$var$pointTangentOverload(p5.prototype.bezierPoint);
p5.prototype.bezierTangent = $c7ffc8b66df47534$var$pointTangentOverload(p5.prototype.bezierTangent);
p5.prototype.curvePoint = $c7ffc8b66df47534$var$pointTangentOverload(p5.prototype.curvePoint);
p5.prototype.curveTangent = $c7ffc8b66df47534$var$pointTangentOverload(p5.prototype.curveTangent);
p5.prototype.yesSmooth = p5.prototype.smooth;
(0, $1b3618ac1b6555cf$export$44f806bc073ff27e)("ellipseMode", "rectMode", "curveTightness");
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    smooth: {
        get: function() {
            if (this._renderer?.isP3D) return this._renderer._pInst._glAttributes?.antialias;
            return this.drawingContext?.imageSmoothingEnabled;
        },
        set: function(val) {
            if (val) this.yesSmooth();
            else this.noSmooth();
        }
    },
    stroke_cap: {
        get: function() {
            if (this._renderer?.isP3D) return this._renderer.strokeCap();
            return this.drawingContext?.lineCap;
        },
        set: function(val) {
            this.strokeCap(val);
        }
    },
    stroke_join: {
        get: function() {
            if (this._renderer?.isP3D) return this._renderer.strokeJoin();
            return this.drawingContext?.lineJoin;
        },
        set: function(val) {
            this.strokeJoin(val);
        }
    },
    stroke_weight: {
        get: function() {
            if (this._renderer?.isP3D) return this._renderer.curStrokeWeight;
            return this.drawingContext?.lineWidth;
        },
        set: function(val) {
            this.strokeWeight(val);
        }
    },
    bezier_detail: {
        get: function() {
            return this._renderer?._pInst._bezierDetail;
        },
        set: function(val) {
            this.bezierDetail(val);
        }
    },
    curve_detail: {
        get: function() {
            return this._renderer?._pInst._curveDetail;
        },
        set: function(val) {
            this.curveDetail(val);
        }
    }
});



(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    animate: {
        get: function() {
            return this.isLooping();
        },
        set: function(val) {
            if (val) this.loop();
            else this.noLoop();
        }
    },
    remove_canvas: {
        get: function() {
            return false;
        },
        set: function() {
            this.remove();
        }
    }
});



(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("selectAll", "removeElements", "createDiv", "createP", "createSpan", "createImg", "createA", "createSlider", "createButton", "createCheckbox", "createSelect", "createRadio", "createColorPicker", "createInput", "createFileInput", "createVideo", "createAudio", "createCapture", "createElement");



(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("createStringDict", "createNumberDict", "matchAll", "splitTokens");
p5.prototype.storage = {};
p5.prototype.registerMethod("init", function() {
    this._setProperty("storage", new Proxy(this, {
        get (target, prop) {
            if (prop === "clear") return target.clearStorage;
            if (prop === "remove") return target.removeItem;
            return target.getItem(prop);
        },
        set (target, prop, val) {
            target.storeItem(prop, val);
            return true;
        }
    }));
});



(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("createVector");
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    angle_mode: {
        get: function() {
            return this._angleMode;
        },
        set: function(mode) {
            this._setProperty("_angleMode", mode);
        }
    },
    noise_detail: {
        set: function() {
            this.noiseDetail(...arguments);
        }
    },
    noise_seed: {
        set: function() {
            this.noiseSeed(...arguments);
        }
    },
    random_seed: {
        get: function() {
            return this._lcg_random_state;
        },
        set: function() {
            this.randomSeed(...arguments);
        }
    }
});



(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("createCanvas", "createGraphics");



const $3d1b09cc8252f1f2$var$defaultAnchor = p5.prototype.createVector();
const $3d1b09cc8252f1f2$var$defaultAngle = p5.prototype.createVector();
const $3d1b09cc8252f1f2$var$defaultShear = p5.prototype.createVector();
const $3d1b09cc8252f1f2$var$defaultScale = p5.prototype.createVector(1, 1, 1);
const $3d1b09cc8252f1f2$var$wrap = function(renderer) {
    function wrappedRenderer() {
        renderer.apply(this, arguments);
        this._anchorStack = [
            $3d1b09cc8252f1f2$var$defaultAnchor.copy()
        ];
        this._angleStack = [
            $3d1b09cc8252f1f2$var$defaultAngle.copy()
        ];
        this._scaleStack = [
            $3d1b09cc8252f1f2$var$defaultScale.copy()
        ];
        this._shearStack = [
            $3d1b09cc8252f1f2$var$defaultShear.copy()
        ];
    }
    wrappedRenderer.prototype = Object.create(renderer.prototype);
    return wrappedRenderer;
};
p5.Renderer = $3d1b09cc8252f1f2$var$wrap(p5.Renderer);
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("push", (base)=>function() {
        this._renderer._anchorStack.push($3d1b09cc8252f1f2$var$defaultAnchor.copy());
        this._renderer._angleStack.push($3d1b09cc8252f1f2$var$defaultAngle.copy());
        this._renderer._scaleStack.push($3d1b09cc8252f1f2$var$defaultScale.copy());
        this._renderer._shearStack.push($3d1b09cc8252f1f2$var$defaultShear.copy());
        base.call(this);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("pop", (base)=>function() {
        this._renderer._anchorStack.pop();
        this._renderer._angleStack.pop();
        this._renderer._scaleStack.pop();
        this._renderer._shearStack.pop();
        base.call(this);
    });
p5.prototype.RESET = "reset";
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    anchor: {
        get: function() {
            return this._renderer?._anchorStack[this._renderer._anchorStack.length - 1];
        },
        set: function(val) {
            if (Array.isArray(val)) this._renderer._anchorStack[this._renderer._anchorStack.length - 1].set(...val);
            else this._renderer._anchorStack[this._renderer._anchorStack.length - 1].set(val);
            this.translate(this.anchor);
        }
    },
    angle: {
        get: function() {
            return this._renderer?._angleStack.slice(-1)[0].z;
        },
        set: function(val) {
            this._renderer._angleStack[this._renderer._anchorStack.length - 1].z = val;
            this.rotate(this.angle);
        }
    },
    angle_x: {
        get: function() {
            return this._renderer?._angleStack.slice(-1)[0].x;
        },
        set: function(val) {
            this._renderer._angleStack[this._renderer._angleStack.length - 1].x = val;
            this.rotateX(this.angle_x);
        }
    },
    angle_y: {
        get: function() {
            return this._renderer?._angleStack.slice(-1)[0].y;
        },
        set: function(val) {
            this._renderer._angleStack[this._renderer._angleStack.length - 1].y = val;
            this.rotateY(this.angle_y);
        }
    },
    angle_z: {
        get: function() {
            return this._renderer?._angleStack.slice(-1)[0].z;
        },
        set: function(val) {
            this._renderer._angleStack[this._renderer._angleStack.length - 1].z = val;
            this.rotateZ(this.angle_z);
        }
    },
    angle_vector: {
        get: function() {
            return this._renderer?._angleStack.slice(-1)[0];
        },
        set: function(val) {
            this._renderer._angleStack[this._renderer._angleStack.length - 1] = val;
            if (this._renderer.isP3D) {
                this.rotateX(this.angle_x);
                this.rotateY(this.angle_y);
                this.rotateZ(this.angle_z);
            } else this.rotate(this.angle);
        }
    },
    scale_factor: {
        get: function() {
            return this._renderer?._scaleStack.slice(-1)[0];
        },
        set: function(val) {
            if (Array.isArray(val)) this._renderer._scaleStack[this._renderer._scaleStack.length - 1].set(...val);
            else this._renderer._scaleStack[this._renderer._scaleStack.length - 1].set(val, val, val);
            this.scale(this.scale_factor);
        }
    },
    shear: {
        get: function() {
            return this._renderer?._shearStack.slice(-1)[0];
        },
        set: function(val) {
            if (Array.isArray(val)) this._renderer._shearStack[this._renderer._shearStack.length - 1].set(...val);
            else this._renderer._shearStack[this._renderer._shearStack.length - 1].set(val);
            this.shearX(this.shear.x);
            this.shearY(this.shear.y);
        }
    },
    transform_matrix: {
        get: function() {
            if (this._renderer.isP3D) return this._renderer.uMVMatrix;
            return this.drawingContext?.getTransform();
        },
        set: function(val) {
            if (val === this.RESET) this.resetMatrix();
            else this.applyMatrix(val);
        }
    }
});
const $3d1b09cc8252f1f2$var$identityMatrix = new DOMMatrix([
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
]);
p5.prototype._transform_point_matrix = function(originalPoint, transMatrix) {
    const pixelDensityMatrix = new DOMMatrix($3d1b09cc8252f1f2$var$identityMatrix).scale(this.pixel_density);
    const scaledMatrix = transMatrix.multiply(pixelDensityMatrix);
    const transformedPoint = scaledMatrix.transformPoint(originalPoint);
    return transformedPoint;
};
p5.prototype.untransform_point = function(x, y, z) {
    const originalPoint = new DOMPoint(x, y, z);
    return this._transform_point_matrix(originalPoint, this.transform_matrix);
};
p5.prototype.transform_point = function(x, y, z) {
    const originalPoint = new DOMPoint(x, y, z);
    return this._transform_point_matrix(originalPoint, this.transform_matrix.inverse());
};



(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("deviceOrientation", "turnAxis", "keyIsDown");
//  TODO - test on mobile device
p5.prototype.device_moved = false;
//  TODO - test on mobile device
p5.prototype.device_turned = false;
p5.prototype.mouse_down = false;
p5.prototype.mouse_up = false;
p5.prototype.mouse_dragging = false;
p5.prototype.mouse_double_clicked = false;
p5.prototype._mouseWheel = 0;
p5.prototype.key_down = false;
p5.prototype.key_up = false;
//  TODO - test on mobile device
p5.prototype.touch_started = false;
p5.prototype.touch_moved = false;
p5.prototype.touch_ended = false;
p5.prototype._startAngleZ;
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_handleMotion", (base)=>function() {
        base.call(this);
        this._setProperty("deviced_moved", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onmousedown", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("mouse_down", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_ondbclick", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("mouse_double_clicked", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onmousemove", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("mouse_dragging", this.mouseIsPressed);
        this._setProperty("touch_moved", this.mouseIsPressed);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onwheel", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("_mouseWheel", this._mouseWheelDeltaY);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onkeyup", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("key_up", true);
        this._setProperty("key_held", false);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onkeydown", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("key_down", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_ontouchbase", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("touch_started", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_ontouchmove", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("touch_moved", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_ontouchend", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("touch_ended", true);
    });
p5.prototype.registerMethod("pre", function() {
    this._setProperty("mouse_up", this.mouseIsPressed == false && this.mouse_held == true);
    this._setProperty("mouse_held", this.mouseIsPressed);
    this._setProperty("key_held", this.key_down);
});
p5.prototype.registerMethod("post", function() {
    this._setProperty("device_moved", false);
    this._setProperty("mouse_down", false);
    this._setProperty("mouse_dragging", false);
    this._setProperty("mouse_double_clicked", false);
    this._setProperty("_mouseWheel", false);
    this._setProperty("key_up", false);
    this._setProperty("key_down", false);
    this._setProperty("touch_started", false);
    this._setProperty("touch_moved", false);
    this._setProperty("touch_ended", false);
});
//  Create properties with default value
p5.prototype._moveThreshold = 0.5;
p5.prototype._shakeThreshold = 30;
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    //  TODO - test on mobile device
    device_acceleration: {
        get: function() {
            return this.createVector(this.accelerationX, this.accelerationY, this.accelerationZ);
        }
    },
    //  TODO - test on mobile device
    device_prev_acceleration: {
        get: function() {
            return this.createVector(this.pAccelerationX, this.pAccelerationY, this.pAccelerationZ);
        }
    },
    //  TODO - test on mobile device
    device_rotation: {
        get: function() {
            return this.createVector(this.rotationX, this.rotationY, this.rotationZ);
        }
    },
    //  TODO - test on mobile device
    device_prev_rotation: {
        get: function() {
            return this.createVector(this.pRotationX, this.pRotationY, this.pRotationZ);
        }
    },
    //  TODO - test on mobile device
    device_turned: {
        get: function() {
            if (this.rotationX === null && this.rotationY === null && this.rotationZ === null) return false;
            return this.rotationX !== this.pRotationX || this.rotationY !== this.pRotationY || this.rotationZ !== this.pRotationZ;
        }
    },
    first_frame: {
        get: function() {
            return this.frameCount === 1;
        }
    },
    key_code: {
        get: function() {
            return this.keyCode;
        }
    },
    mouse_button: {
        get: function() {
            return this.mouseButton;
        }
    },
    mouse_pos: {
        get: function() {
            return this.createVector(this.mouseX, this.mouseY);
        }
    },
    mouse_pos_x: {
        get: function() {
            return this.mouseX;
        }
    },
    mouse_pos_y: {
        get: function() {
            return this.mouseY;
        }
    },
    mouse_prev_pos: {
        get: function() {
            return this.createVector(this.pmouseX, this.pmouseY);
        }
    },
    mouse_prev_pos_x: {
        get: function() {
            return this.pmouseX;
        }
    },
    mouse_prev_pos_y: {
        get: function() {
            return this.pmouseY;
        }
    },
    mouse_trans_pos: {
        get: function() {
            return this.transform_point(this.mouse_pos_x, this.mouse_pos_y);
        }
    },
    mouse_trans_pos_x: {
        get: function() {
            return this.mouse_trans_pos.x;
        }
    },
    mouse_trans_pos_y: {
        get: function() {
            return this.mouse_trans_pos.y;
        }
    },
    mouse_wheel: {
        get: function() {
            return this._mouseWheel;
        }
    },
    mouse_window_pos: {
        get: function() {
            return this.createVector(this.winMouseX, this.winMouseY);
        }
    },
    mouse_window_pos_x: {
        get: function() {
            return this.winMouseX;
        }
    },
    mouse_window_pos_y: {
        get: function() {
            return this.winMouseY;
        }
    },
    mouse_prev_window_pos: {
        get: function() {
            return this.createVector(this.pwinMouseX, this.pwinMouseY);
        }
    },
    mouse_window_prev_pos_x: {
        get: function() {
            return this.pwinMouseX;
        }
    },
    mouse_window_prev_pos_y: {
        get: function() {
            return this.pwinMouseY;
        }
    },
    move_threshold: {
        get: function() {
            return this._moveThreshold;
        },
        set: function(val) {
            this.setMoveThreshold(val);
        }
    },
    moved: {
        get: function() {
            return this.createVector(this.movedX, this.movedY);
        }
    },
    moved_x: {
        get: function() {
            return this.movedX;
        }
    },
    moved_y: {
        get: function() {
            return this.movedY;
        }
    },
    pointer_lock_request: {
        get: function() {
            return document.pointerLockElement === this._curElement.elt;
        },
        set: function(val) {
            if (val) this.requestPointerLock();
            else this.exitPointerLock();
        }
    },
    shake_threshold: {
        get: function() {
            return this._shakeThreshold;
        },
        set: function(val) {
            this.setShakeThreshold(val);
        }
    }
});





/**
 * Draw an image to the canvas.
 *
 * This element can be used with different numbers of attributes. The
 * simplest use requires only three attributes: img, x, and y—where (x, y) is
 * the position of the image. Two more attributes can optionally be added to
 * specify the width and height of the image.
 *
 * This element can also be used with eight Number attributes. To
 * differentiate between all these attributes, p5.js uses the language of
 * "destination rectangle" (which corresponds to "dx", "dy", etc.) and "source
 * image" (which corresponds to "sx", "sy", etc.) below. Specifying the
 * "source image" dimensions can be useful when you want to display a
 * subsection of the source image instead of the whole thing.
 *
 * This element can also be used to draw images without distorting the original aspect ratio,
 * by adding 9th attribute, fit, which can either be COVER or CONTAIN.
 * CONTAIN, as the name suggests, contains the whole image within the specified destination box
 * without distorting the image ratio.
 * COVER covers the entire destination box.
 *
 *
 *
 * @element image
 * @attribute  {p5.Image|p5.Element|p5.Texture} img    the image to display
 * @attribute  {p5.Image|p5.Element|p5.Texture} img
 * @attribute  {Number}   dx     the x-coordinate of the destination
 *                           rectangle in which to draw the source image
 * @attribute  {Number}   dy     the y-coordinate of the destination
 *                           rectangle in which to draw the source image
 * @attribute  {Number}   dWidth  the width of the destination rectangle
 * @attribute  {Number}   dHeight the height of the destination rectangle
 * @attribute  {Number}   sx     the x-coordinate of the subsection of the source
 * image to draw into the destination rectangle
 * @attribute  {Number}   sy     the y-coordinate of the subsection of the source
 * image to draw into the destination rectangle
 * @attribute {Number}    [sWidth] the width of the subsection of the
 *                           source image to draw into the destination
 *                           rectangle
 * @attribute {Number}    [sHeight] the height of the subsection of the
 *                            source image to draw into the destination rectangle
 * @attribute {Constant} [fit] either CONTAIN or COVER
 * @attribute {Constant} [xAlign] either LEFT, RIGHT or CENTER default is CENTER
 * @attribute {Constant} [yAlign] either TOP, BOTTOM or CENTER default is CENTER
 */ class $d41e5f38852d70c7$var$Image extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    constructor(){
        super([
            "img, x, y, [width], [height]",
            "img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight]"
        ]);
    }
    /**
   * Sets the fill value for displaying images. Images can be tinted to
   * specified colors or made transparent by including an alpha value.
   *
   * To apply transparency to an image without affecting its color, use
   * white as the tint color and specify an alpha value. For instance,
   * tint(255, 128) will make an image 50% transparent (assuming the default
   * alpha range of 0-255, which can be changed with color_mode.
   *
   * The value for the gray parameter must be less than or equal to the current
   * maximum value as specified by color_mode. The default maximum value is
   * 255.
   *
   * @type {p5.Color}
   */ get tint() {
        return this.pInst.color(this.pInst._renderer._tint);
    }
    set tint(val) {
        if (val === this.pInst.NONE) this.pInst.noTint();
        else this.pInst.tint(...arguments);
    }
}
customElements.define("p-image", $d41e5f38852d70c7$var$Image);
(0, $1b3618ac1b6555cf$export$44f806bc073ff27e)("imageMode");
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    canvas_pixels: {
        get: function() {
            this.loadPixels();
            return this.pixels;
        },
        set: function(px) {
            this.pixels = px;
            this.updatePixels();
        }
    }
});



(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("createWriter");
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    http_post: {
        set: function() {
            this.httpPost(...arguments);
        }
    },
    http_do: {
        set: function() {
            this.httpDo(...arguments);
        }
    },
    save_file: {
        set: function() {
            this.save(...arguments);
        }
    },
    save_json_file: {
        set: function() {
            this.saveJSON(...arguments);
        }
    },
    save_strings_file: {
        set: function() {
            this.saveStrings(...arguments);
        }
    },
    save_table_file: {
        set: function() {
            this.saveTable(...arguments);
        }
    }
});





(0, $1b3618ac1b6555cf$export$44f806bc073ff27e)("textAlign", "textLeading", "textSize", "textStyle", "textWrap", "textFont");
(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("textAscent", "textDescent");
class $aeaf4bbafe4a9ee3$var$Text extends (0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)) {
    constructor(){
        super([
            "content, x, y, [x2], [y2]"
        ]);
    }
}
customElements.define("p-text", $aeaf4bbafe4a9ee3$var$Text);






p5.prototype.DEFAULT = "default";
p5.prototype.AMBIENT = "ambient";
p5.prototype.SPECULAR = "specular";
p5.prototype.EMISSIVE = "emissive";
class $813871a5b290df44$export$547e390f3d648e59 extends (0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)) {
    #ambient_material;
    #emissive_material;
    #shininess;
    #specular_material;
    #no_lights;
    /**
   * Sets the ambient color of the material.
   *
   * The ambient_material color is the color the object will reflect
   * under **any** lighting.
   *
   * Consider an ambient_material with the color yellow (255, 255, 0).
   * If the light emits the color white (255, 255, 255), then the object
   * will appear yellow as it will reflect the red and green components
   * of the light. If the light emits the color red (255, 0, 0), then
   * the object will appear red as it will reflect the red component
   * of the light. If the light emits the color blue (0, 0, 255),
   * then the object will appear black, as there is no component of
   * the light that it can reflect.
   * @type {p5.Color}
   */ get ambient_material() {
        return this.#ambient_material;
    }
    set ambient_material(val) {
        if (Array.isArray(val)) this.pInst.ambientMaterial(...val);
        else this.pInst.ambientMaterial(val);
        this.#ambient_material = this.pInst.color(val);
    }
    /**
   * Sets the emissive color of the material.
   *
   * An emissive material will display the emissive color at
   * full strength regardless of lighting. This can give the
   * appearance that the object is glowing.
   *
   * Note, "emissive" is a misnomer in the sense that the material
   * does not actually emit light that will affect surrounding objects.
   *
   * @type {p5.Color}
   */ get emissive_material() {
        return this.#emissive_material;
    }
    set emissive_material(val) {
        if (Array.isArray(val)) this.pInst.emissiveMaterial(...val);
        else this.pInst.emissiveMaterial(val);
        this.#ambient_material = this.pInst.color(val);
    }
    /**
   * Sets the current material as a normal material.
   *
   * A normal material is not affected by light. It is often used as
   * a placeholder material when debugging.
   *
   * Surfaces facing the X-axis become red, those facing the Y-axis
   * become green, and those facing the Z-axis become blue.
   *
   * @type {boolean}
   */ get normal_material() {
        return this.pInst._renderer.useNormalMaterial;
    }
    set normal_material(val) {
        if (val) this.pInst.normalMaterial();
    }
    /**
   * Sets the <a href="#/p5.Shader">p5.Shader</a> object to
   * be used to render subsequent shapes.
   *
   * Custom shaders can be created using the
   * create_shader() method and
   * ```<shader>``` element.
   *
   * Set shader="DEFAULT" to restore the default shaders.
   *
   * Note, shaders can only be used in WEBGL mode.
   * @type {p5.Shader}
   */ get shader() {
        return [
            this.pInst._renderer.userStrokeShader,
            this.pInst._renderer.userFillShader
        ];
    }
    set shader(val) {
        const { pInst: pInst  } = this;
        if (val === pInst.DEFAULT) pInst.resetShader();
        else pInst.shader(val);
    }
    /**
   * Sets the amount of gloss ("shininess") of a
   * specular_material.
   *
   * The default and minimum value is 1.
   * @type {number}
   * */ get shininess() {
        return this.#shininess;
    }
    set shininess(val) {
        this.pInst.shininess(val);
        this.#shininess = val;
    }
    /**
   * Sets the specular color of the material.
   *
   * A specular material is reflective (shiny). The shininess can be
   * controlled by the shininess property.
   *
   * Like ambient_material,
   * the specular_material color is the color the object will reflect
   * under ```<ambient-light>```.
   * However unlike ambient_material, for all other types of lights
   * ```<directional-light>```,
   * ```<point-light>```,
   * ```spot-light>```,
   * a specular material will reflect the **color of the light source**.
   * This is what gives it its "shiny" appearance.
   *
   * @type {p5.Color}
   */ get specular_material() {
        return this.#specular_material;
    }
    set specular_material(val) {
        if (Array.isArray(val)) this.pInst.specularMaterial(...val);
        else this.pInst.specularMaterial(val);
        this.#specular_material = this.pInst.color(val);
    }
    /**
   * Sets the texture that will be used to render subsequent shapes.
   *
   * A texture is like a "skin" that wraps around a 3D geometry. Currently
   * supported textures are images, video, and offscreen renders.
   *
   * To texture a geometry created by a ```<shape>``` element,
   * you will need to specify uv coordinates in ```<vertex>``` element.
   *
   * Note, texture can only be used in WEBGL mode.
   *
   * @type {p5.Image|p5.MediaElement|p5.Graphics|p5.Texture}
   */ get texture() {
        return this.pInst._renderer._tex;
    }
    set texture(val) {
        this.pInst.texture(val);
    }
    /**
   * Sets the coordinate space for texture mapping. The default mode is IMAGE
   * which refers to the actual coordinates of the image.
   * NORMAL refers to a normalized space of values ranging from 0 to 1.
   *
   * With IMAGE, if an image is 100×200 pixels, mapping the image onto the
   * entire
   * size of a quad would require the points (0,0) (100, 0) (100,200) (0,200).
   * The same mapping in NORMAL is (0,0) (1,0) (1,1) (0,1).
   *
   * @type {IMAGE|NORMAL}
   */ get texture_mode() {
        return this.pInst._renderer.textureMode;
    }
    set texture_mode(val) {
        this.pInst.textureMode(val);
    }
    /**
   * Sets the global texture wrapping mode. This controls how textures behave
   * when their uv's go outside of the 0 to 1 range. There are three options:
   * CLAMP, REPEAT, and MIRROR.
   *
   * CLAMP causes the pixels at the edge of the texture to extend to the bounds.
   * REPEAT causes the texture to tile repeatedly until reaching the bounds.
   * MIRROR works similarly to REPEAT but it flips the texture with every new tile.
   *
   * REPEAT & MIRROR are only available if the texture
   * is a power of two size (128, 256, 512, 1024, etc.).
   *
   * This method will affect all textures in your sketch until another element
   * sets texture_mode.
   *
   * If only one value is provided, it will be applied to both the
   * horizontal and vertical axes.
   * @type {[CLAMP|REPEAT|MIRROR, CLAMP|REPEAT|MIRROR]}
   */ get texture_wrap() {
        return [
            this.pInst._renderer.textureWrapX,
            this.pInst._renderer.textureWrapY
        ];
    }
    set texture_wrap(val) {
        if (Array.isArray(val)) this.pInst.textureWrap(...val);
        else this.pInst.textureWrap(val);
    }
    /**
   * Removes all lights present in a sketch.
   *
   * All subsequent geometry is rendered without lighting (until a new
   * light is created with a lighting element (
   * ```<lights>```,
   * ```<ambient-light>```,
   * ```<directional-light>```,
   * ```<point-light>```,
   * ```<spot-light>```).
   * @type {boolean}
   */ get no_lights() {
        return this.#no_lights;
    }
    set no_lights(val) {
        this.#no_lights = val;
        if (val == true) this.pInst.noLights();
    }
}
class $813871a5b290df44$export$c1b6c06f00a3c53a extends (0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33) {
    draw(inherited) {
        //  Set no_lights to false so that children won't delete this light
        super.draw({
            ...inherited,
            no_lights: false
        });
    }
}
const $813871a5b290df44$export$fe226f30800ca89d = (baseClass)=>class extends baseClass {
        #specular_color;
        /**
     * Sets the color of the specular highlight of a non-ambient light
     * (i.e. all lights except ```<ambient-light>```).
     *
     * specular_color affects only the lights which are created by
     * this element or its children
     *
     * This property is used in combination with
     * <a href="#/p5/specularMaterial">specularMaterial()</a>.
     * If a geometry does not use specular_material, this property
     * will have no effect.
     *
     * The default color is white (255, 255, 255), which is used if
     * specular_color is not explicitly set.
     *
     * Note: specular_color is equivalent to the Processing function
     * <a href="https://processing.org/reference/lightSpecular_.
     * html">lightSpecular</a>.
     *
     * @type {p5.Color}
     */ get specular_color() {
            return this.#specular_color;
        }
        set specular_color(val) {
            const { pInst: pInst  } = this;
            const c = Array.isArray(val) ? pInst.color(...val) : pInst.color(val);
            pInst.specularColor(c);
            this.#specular_color = c;
        }
    };
const $813871a5b290df44$export$ebd05637ed7f2471 = (baseClass)=>class extends baseClass {
        #light_falloff;
        /**
     * Sets the falloff rate for ```<point-light>```
     * and ```<spot-light>```.
     *
     * light_falloff affects only this element and its children.
     *
     * The values are `constant`, `linear`, an `quadratic` and are used to calculate falloff as follows:
     *
     * d = distance from light position to vertex position
     *
     * falloff = 1 / (CONSTANT + d \* LINEAR + (d \* d) \* QUADRATIC)
     * @type {[number, number, number]}
     */ get light_falloff() {
            return this.#light_falloff;
        }
        set light_falloff([constant, linear, quadratic]) {
            const { pInst: pInst  } = this;
            pInst.lightFalloff(constant, linear, quadratic);
            this.#light_falloff = [
                pInst._renderer.constantAttenuation,
                pInst._renderer.linearAttenuation,
                pInst._renderer.quadraticAttenuation
            ];
        }
    };


class $0cebf34523a0dd8b$var$Normal extends (0, $f2731110a32ba8b7$export$339b9be62e060004)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)) {
    constructor(){
        super([
            "vector",
            "x, y, z"
        ]);
    }
}
customElements.define("p-normal", $0cebf34523a0dd8b$var$Normal);
class $0cebf34523a0dd8b$var$Plane extends (0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $813871a5b290df44$export$547e390f3d648e59)) {
    constructor(){
        super("[width], [height], [detail_x], [detail_y]");
    }
}
customElements.define("p-plane", $0cebf34523a0dd8b$var$Plane);
class $0cebf34523a0dd8b$var$Box extends (0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $813871a5b290df44$export$547e390f3d648e59)) {
    constructor(){
        super([
            "[width], [height], [depth], [detail_x], [detail_y]"
        ]);
    }
}
customElements.define("p-box", $0cebf34523a0dd8b$var$Box);
class $0cebf34523a0dd8b$var$Sphere extends (0, $813871a5b290df44$export$547e390f3d648e59) {
    constructor(){
        super([
            "[radius], [detail_x], [detail_y]"
        ]);
    }
}
customElements.define("p-sphere", $0cebf34523a0dd8b$var$Sphere);
class $0cebf34523a0dd8b$var$Cylinder extends (0, $813871a5b290df44$export$547e390f3d648e59) {
    constructor(){
        super([
            "[radius], [height], [detail_x], [detail_y], [bottomCap], [topCap]"
        ]);
    }
}
customElements.define("p-cylinder", $0cebf34523a0dd8b$var$Cylinder);
class $0cebf34523a0dd8b$var$Cone extends (0, $813871a5b290df44$export$547e390f3d648e59) {
    constructor(){
        super([
            "[radius], [height], [detail_x], [detail_y], [cap]"
        ]);
    }
}
customElements.define("p-cone", $0cebf34523a0dd8b$var$Cone);
class $0cebf34523a0dd8b$var$Ellipsoid extends (0, $813871a5b290df44$export$547e390f3d648e59) {
    constructor(){
        super([
            "[radius_x], [radius_y], [radius_z], [detail_x], [detail_y]"
        ]);
    }
}
customElements.define("p-ellipsoid", $0cebf34523a0dd8b$var$Ellipsoid);
class $0cebf34523a0dd8b$var$Torus extends (0, $813871a5b290df44$export$547e390f3d648e59) {
    constructor(){
        super([
            "[radius], [tubeRadius], [detailX], [detailY]"
        ]);
    }
}
customElements.define("p-torus", $0cebf34523a0dd8b$var$Torus);
//  TODO - test when preload implemented
class $0cebf34523a0dd8b$var$LoadModel extends (0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33) {
    constructor(){
        super([
            "path, normalize, [successCallback], [failureCallback], [fileType]",
            "path, [successCallback], [failureCallback], [fileType]"
        ]);
    }
}
customElements.define("p-load-model", $0cebf34523a0dd8b$var$LoadModel);
class $0cebf34523a0dd8b$var$Model extends (0, $813871a5b290df44$export$547e390f3d648e59) {
    constructor(){
        super([
            "model"
        ]);
    }
}
customElements.define("p-model", $0cebf34523a0dd8b$var$Model);



/**
 * Creates an ambient light with the given color.
 *
 * Ambient light does not come from a specific direction.
 * Objects are evenly lit from all sides. Ambient lights are
 * almost always used in combination with other types of lights.
 * @element ambient-light
 * @attribute {Number}   v1     red or hue value relative to the current color
 *                                range
 * @attribute {Number}   v2     green or saturation value relative to the
 *                                current color range
 * @attribute {Number}   v3     blue or brightness value relative to the current
 *                                color range
 * @attribute {Number}   alpha  alpha value relative to current color range
 *                                (default is 0-255)
 * @attribute {Number}   gray   number specifying value between
 *                                white and black
 * @attribute {String}   value  a color string
 * @attribute {Number[]} values an array containing the red,green,blue &
 *                                 and alpha components of the color
 * @attribute {p5.Color} color  color as a <a
 *                                 href="https://p5js.org/reference/#/p5.Color"
 *                                 target="_blank">p5.Color</a>
 */ class $12bf7ff6c321610b$var$AmbientLight extends (0, $813871a5b290df44$export$c1b6c06f00a3c53a) {
    constructor(){
        super([
            "v1, v2, v3, [alpha]",
            "gray, [alpha]",
            "value",
            "values",
            "color"
        ]);
    }
}
customElements.define("p-ambient-light", $12bf7ff6c321610b$var$AmbientLight);
/**
 * Creates a directional light with the given color and direction.
 *
 * Directional light comes from one direction.
 * The direction is specified as numbers inclusively between -1 and 1.
 * For example, setting the direction as (0, -1, 0) will cause the
 * geometry to be lit from below (since the light will be facing
 * directly upwards). Similarly, setting the direction as (1, 0, 0)
 * will cause the geometry to be lit from the left (since the light
 * will be facing directly rightwards).
 *
 * Directional lights do not have a specific point of origin, and
 * therefore cannot be positioned closer or farther away from a geometry.
 *
 * A maximum of **5** directional lights can be active at once.
 * @element    directional-light
 * @attribute  {Number}   v1     red or hue value relative to the current color
 *                                range
 * @attribute  {Number}   v2     green or saturation value relative to the
 *                                current color range
 * @attribute  {Number}   v3     blue or brightness value relative to the
 *                                current color range
 * @attribute  {Number}   x      x component of direction (inclusive range of
 *                                -1 to 1)
 * @attribute  {Number}   y      y component of direction (inclusive range of
 *                                -1 to 1)
 * @attribute  {Number}   z      z component of direction (inclusive range of
 *                                -1 to 1)
 * @attribute  {p5.Vector} direction  direction of light as a <a
 *                             href="https://p5js.org/reference/#/p5.Vector"
 *                             >p5.Vector</a>
 * @attribute {p5.Color} color  color as a <a
 *                                 href="https://p5js.org/reference/#/p5.Color"
 *                                 target="_blank">p5.Color</a>
 */ class $12bf7ff6c321610b$var$DirectionalLight extends (0, $813871a5b290df44$export$fe226f30800ca89d)((0, $813871a5b290df44$export$c1b6c06f00a3c53a)) {
    constructor(){
        super([
            "v1, v2, v3, x, y, z",
            "v1, v2, v3, direction",
            "color, x, y, z",
            "color, direction"
        ]);
    }
}
customElements.define("p-directional-light", $12bf7ff6c321610b$var$DirectionalLight);
/**
 * Creates a point light with the given color and position.
 *
 * A point light emits light from a single point in all directions.
 * Because the light is emitted from a specific point (position),
 * it has a different effect when it is positioned farther vs. nearer
 * an object.
 *
 * A maximum of **5** point lights can be active at once.
 *
 * @attribute  {Number}   v1   red or hue value relative to the current color
 *                                range
 * @attribute  {Number}   v2   green or saturation value relative to the
 *                                current color range
 * @attribute  {Number}   v3   blue or brightness value relative to the
 *                                current color range
 * @attribute  {Number}    x   x component of position
 * @attribute  {Number}    y   y component of position
 * @attribute  {Number}    z   z component of position
 * @attribute  {p5.Vector}  position position of light as a <a
 *                            href="https://p5js.org/reference/#/p5.Vector"
 *                            >p5.Vector</a>
 * @attribute  {p5.Color|Number[]|String} color  color as a <a
 *                href="https://p5js.org/reference/#/p5.Color">p5.Color</a>,
 *                as an array, or as a CSS string
 */ class $12bf7ff6c321610b$var$PointLight extends (0, $813871a5b290df44$export$ebd05637ed7f2471)((0, $813871a5b290df44$export$fe226f30800ca89d)((0, $813871a5b290df44$export$c1b6c06f00a3c53a))) {
    constructor(){
        super([
            "v1, v2, v3, x, y, z",
            "v1, v2, v3, position",
            "color, x, y, z",
            "color, position"
        ]);
    }
}
customElements.define("p-point-light", $12bf7ff6c321610b$var$PointLight);
/**
 * Places an ambient and directional light in the scene.
 * The lights are set to <ambient-light v1="128" v2="128" v3="128"> and
 * <directional-light v1="128" v2="128" v3'="128" x="0" y="0" z="-1">.
 * @element lights
 */ class $12bf7ff6c321610b$var$Lights extends (0, $813871a5b290df44$export$fe226f30800ca89d)((0, $813871a5b290df44$export$c1b6c06f00a3c53a)) {
    constructor(){
        super([
            ""
        ]);
    }
}
customElements.define("p-lights", $12bf7ff6c321610b$var$Lights);
/**
 * Creates a spot light with the given color, position,
 * light direction, angle, and concentration.
 *
 * Like a ```<point-light>```, a ```<spot-light>```
 * emits light from a specific point (position). It has a different effect
 * when it is positioned farther vs. nearer an object.
 *
 * However, unlike a ```<point-light>```, the light is emitted in **one
 * direction**
 * along a conical shape. The shape of the cone can be controlled using
 * the `angle` and `concentration` parameters.
 *
 * The `angle` parameter is used to
 * determine the radius of the cone. And the `concentration`
 * parameter is used to focus the light towards the center of
 * the cone. Both parameters are optional, however if you want
 * to specify `concentration`, you must also specify `angle`.
 * The minimum concentration value is 1.
 *
 * A maximum of **5** spot lights can be active at once.
 *
 * @element spot-light
 * @attribute  {Number}    v1             red or hue value relative to the
 *                                            current color range
 * @attribute  {Number}    v2             green or saturation value relative
 *                                            to the current color range
 * @attribute  {Number}    v3             blue or brightness value relative
 *                                            to the current color range
 * @attribute  {Number}    x              x component of position
 * @attribute  {Number}    y              y component of position
 * @attribute  {Number}    z              z component of position
 * @attribute  {Number}    rx             x component of light direction
 *                                            (inclusive range of -1 to 1)
 * @attribute  {Number}    ry             y component of light direction
 *                                            (inclusive range of -1 to 1)
 * @attribute  {Number}    rz             z component of light direction
 *                                            (inclusive range of -1 to 1)
 * @attribute  {Number}    angle          angle of cone. Defaults to PI/3
 * @attribute  {Number}    concentration  concentration of cone. Defaults to
 *                                            100
 */ class $12bf7ff6c321610b$var$SpotLight extends (0, $813871a5b290df44$export$ebd05637ed7f2471)((0, $813871a5b290df44$export$fe226f30800ca89d)((0, $813871a5b290df44$export$c1b6c06f00a3c53a))) {
    constructor(){
        super([
            "v1, v2, v3, x, y, z, rx, ry, rz, [angle], [concentration]",
            "color, position, direction, [angle], [concentration]",
            "v1, v2, v3, position, direction, [angle], [concentration]",
            "color, x, y, z, direction, [angle], [concentration]",
            "color, position, rx, ry, rz, [angle], [concentration]",
            "v1, v2, v3, x, y, z, direction, [angle], [concentration]",
            "v1, v2, v3, position, rx, ry, rz, [angle], [concentration]",
            "color, x, y, z, rx, ry, rz, [angle], [concentration]"
        ]);
    }
}
customElements.define("p-spot-light", $12bf7ff6c321610b$var$SpotLight);


"use strict";
const $cf838c15c8b009ba$var$customElementsDefined = new Event("customElementsDefined");
dispatchEvent($cf838c15c8b009ba$var$customElementsDefined);


//# sourceMappingURL=p5.marker.js.map
