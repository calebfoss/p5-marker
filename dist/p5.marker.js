// p5-marker v0.0.0 Sat Jan 07 2023 https://github.com/calebfoss/p5-marker.git
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
        const isObject = items.some((item)=>item.match(/^[^\?\{]*:/gi));
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
        "yield", 
    ];
    static getOwnerName(el, prop) {
        if ($1e4b072929c69c2b$export$25a3dda2d7b8a35b.keywords.includes(prop) || prop in $1e4b072929c69c2b$export$25a3dda2d7b8a35b.escapes || prop in globalThis) return "none";
        if ($1e4b072929c69c2b$export$25a3dda2d7b8a35b.isP5(prop)) return "pInst";
        if (el.isPersistent(prop)) return "this.persistent";
        if (prop in el) return "this";
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
    this.resizeCanvas(c.width, c.height);
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
const $641a8979c6a6229d$var$attributePriorities = [
    "debug_attributes",
    "anchor",
    "angle",
    "scale_factor",
    "shear",
    "_default",
    "repeat",
    "change", 
];
const $641a8979c6a6229d$var$P5Extension = (baseClass)=>class P5Extension extends baseClass {
        /**
     * This element's parent canvas.
     * @private
     */ #canvas;
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
                target.#updateFunctions.set(prop, ()=>val);
                target.#state[prop] = val;
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
     */  #applyChange() {
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
                assignProp(this.#state, prop) || assignProp(this.persistent, prop) || assignProp(this.pInst, prop) || console.error(`${this.constructor.elementName}'s change attribute has a prop called ${prop} that is unknown`);
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
     * @private
     */  #callAttributeUpdater(inherited, attrName, thisArg) {
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
     * Checks if this element is colliding with the provided other element.
     * @method colliding_with
     * @param {P5Element} el - other element to check
     * @returns {boolean} true if elements are colliding
     */ colliding_with(el) {
            return this.pInst.collide_elements(this, el);
        }
        /**
     * @private
     */ get #comments() {
            return this.#html.split(/(?:\r\n|\r|\n)/).map((line)=>line.match(/.{1,80}/g)).flat().map((line)=>"//	" + line);
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
                repeat = this.#state.repeat;
                const { change: change  } = this.#state;
                if (Array.isArray(repeat)) {
                    const [key, ...conditions] = this.#updateAttribute(this.#state, "repeat");
                    repeat = key === WHILE === conditions.every((c)=>c);
                }
                if (repeat) {
                    this.pInst.pop();
                    this.pInst.push();
                    const updaters = this.#updateFunctions.entries();
                    for (const [attrName, updater] of updaters)if (attrName in change === false) this.#state[attrName] = this.#updateAttribute(inherited, attrName, this);
                    const changed = this.#applyChange();
                    if (!changed) repeat = false;
                }
                this.endRender?.(this.#state);
            }
            this.pInst.pop();
        }
        /**
     * Name of the HTML element generated from this class.
     * @type {string}
     */ static get elementName() {
            return `p-${(0, $7a53813bc2528edd$export$b797531657428303)(this.name)}`;
        }
        /**
     * @private
     */ get #html() {
            return this.outerHTML.replace(this.innerHTML, "");
        }
        /**
     * Checks if an attribute belongs to the parent canvas of this element.
     * @method isPersistent
     * @param {string} attributeName - name of the attribute to check
     * @returns {boolean} true if the attribute belongs to the parent canvas
     */ isPersistent(attributeName) {
            if (this instanceof HTMLCanvasElement) return this.hasAttribute(attributeName);
            return this.parentElement?.isPersistent?.(attributeName);
        }
        /**
     * List of attribute names in the order in which they will be evaluated.
     * Element attributes are not guaranteed to be in the order in which they
     * are written. Transformation attributes are prioritized before others
     * and use this order: anchor, angle, scale_factor, shear.
     * @type {Array}
     */ get orderedAttributeNames() {
            const ordered = Array.from(this.attributes).sort(({ name: a  }, { name: b  })=>($641a8979c6a6229d$var$attributePriorities.indexOf(a) + 1 || $641a8979c6a6229d$var$attributePriorities.indexOf("_default")) - ($641a8979c6a6229d$var$attributePriorities.indexOf(b) + 1 || $641a8979c6a6229d$var$attributePriorities.indexOf("_default"))).map(({ name: name  })=>name);
            this.transformDoneIndex = ordered.findLastIndex((attrName)=>$641a8979c6a6229d$var$attributePriorities.includes(attrName)) + 1;
            return ordered;
        }
        /**
     * Proxy for this element's parent canvas is a child with access to its
     * properties, methods, and attributes.
     * @type {proxy}
     */ get persistent() {
            return this.#canvas.this_element;
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
     * Sets this element up with a p5 instance and sets up its children.
     * @param {p5} pInst
     */ setup(pInst, canvas) {
            this.#pInst = pInst;
            this.#canvas = canvas;
            this.setDefaults?.();
            this.#setupEvalFns?.();
            this.setupRenderFunction?.();
            for (const child of this.children)child.setup(pInst, canvas);
        }
        /**
     * @private
     */  #setupEvalFn(attr) {
            //  The attribute's value will be modified, then run as JS
            const attrJsStr = attr.value;
            //  TODO - catch improperly ordered quote marks: "foo'var"'
            if ((0, $1e4b072929c69c2b$export$25a3dda2d7b8a35b).allQuotesMatched(attrJsStr) === false) console.error(`It looks like a ${this.constructor.elementName}'s ${attr.name} ` + `attribute has an open string. Check that each string has a beginning and end character.`);
            const owner = (0, $1e4b072929c69c2b$export$25a3dda2d7b8a35b).getOwnerName(this, attr.name);
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
     */  #setupEvalFns() {
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
     */  #updateAttribute(inherited1, attrName1, thisArg1) {
            if (attrName1 === "repeat" || attrName1 === "change") inherited1 = this.#state;
            const val = this.#callAttributeUpdater(inherited1, attrName1, thisArg1);
            //  Setting canvas width or height resets the drawing context
            //  Only set the attribute if it's not one of those
            if (this.pInst.debug_attributes === false) return val;
            if (this instanceof HTMLCanvasElement && (attrName1 !== "width" || attrName1 !== "height")) return val;
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
            this.#state = Object.assign({}, inherited);
            const updaters = this.#updateFunctions.entries();
            for (const [attrName, updateFunction] of updaters)this.#state[attrName] = this.#updateAttribute(inherited, attrName, this);
            return this.#state;
        }
    };
class $641a8979c6a6229d$export$82fefa1d40d42487 extends $641a8979c6a6229d$var$P5Extension(HTMLElement) {
}
class $641a8979c6a6229d$export$d546242e33fb8131 extends $641a8979c6a6229d$export$82fefa1d40d42487 {
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
   */  #getArgumentsFromOverloads() {
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
            overloadMatch = overloadParams.every((p)=>this.hasAttribute(p) || this.attributeInherited(p) || isOptional(p) || p === "" || i === overloadsSplitSorted.length - 1 && this.isPersistent(p));
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
                    //  If attribute is persistent, add it to filtered params
                    if (this.isPersistent(p)) return filterParams(overloadParams, filteredParams.concat({
                        owner: this.persistent,
                        param: p
                    }), ++i);
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
p5.prototype._defineCustomElement = function(pCustomEl) {
    const name = pCustomEl.getAttribute("name");
    customElements.define(`p-${name}`, class extends $641a8979c6a6229d$export$82fefa1d40d42487 {
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
};
/**
 * The blank `<_>` element renders nothing to the canvas. This is useful
 * for adjusting attributes for child elements.
 * @element _
 */ class $641a8979c6a6229d$var$_ extends $641a8979c6a6229d$export$82fefa1d40d42487 {
    constructor(){
        super();
    }
}
customElements.define("p-_", $641a8979c6a6229d$var$_);
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
 */ class $641a8979c6a6229d$var$Canvas extends $641a8979c6a6229d$var$P5Extension(HTMLCanvasElement) {
    constructor(){
        super();
        window.addEventListener("customElementsDefined", this.runCode.bind(this));
    }
    get orderedAttributeNames() {
        //  Remove 'is' and 'style' from attrNames
        return super.orderedAttributeNames.filter((v)=>v !== "is" && v != "style");
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
                change: {}
            };
            pInst.preload = ()=>pInst.loadAssets();
            pInst.setup = function() {
                const renderer = pInst[canvas.getAttribute("renderer")];
                canvas.setup(pInst, canvas);
                pInst.assignCanvas(canvas, renderer);
                const initialState = canvas.updateState({});
                Object.getOwnPropertyNames(initialState).forEach((name)=>delete canvas.defaults[name]);
            };
            pInst.draw = function() {
                for (const child of canvas.children)child.draw?.(canvas.defaults);
            };
        };
        new p5(sketch);
    }
    attributeInherited(attributeName) {
        if (this.hasAttribute(attributeName) || attributeName in this.defaults) return true;
        return super.attributeInherited(attributeName);
    }
}
customElements.define("p-canvas", $641a8979c6a6229d$var$Canvas, {
    extends: "canvas"
});
/**
 * The `<custom>` element generates a new element from a combination of existing
 * elements. This element should be placed outside the <canvas> element. The name attribute defines the name of the new element. For
 * example, if name is set to "my-element," <my-element>
 * @element custom
 * @example Clouds
 * ```html
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
 */ class $641a8979c6a6229d$var$Custom extends $641a8979c6a6229d$export$82fefa1d40d42487 {
    constructor(){
        super();
        if (this.attributes.length) p5.prototype._defineCustomElement(this);
    }
}
customElements.define("p-custom", $641a8979c6a6229d$var$Custom);
class $641a8979c6a6229d$var$Asset extends HTMLElement {
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
        const loadFn = $641a8979c6a6229d$var$Asset.loadFns[this.getAttribute("type").toLowerCase()];
        const path = this.getAttribute("path");
        this.data = await pInst[loadFn](path);
        return this.data;
    }
}
customElements.define("p-asset", $641a8979c6a6229d$var$Asset);
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
 */ class $641a8979c6a6229d$var$Sketch extends HTMLLinkElement {
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
        if (xmlTag === "custom") p5.prototype._defineCustomElement(pEl);
        return pEl;
    }
     #convertAllElements(xmlEl1, parent = document.body) {
        const pEl1 = this.#convertElement(xmlEl1);
        parent.appendChild(pEl1);
        for(let i1 = 0; i1 < xmlEl1.children.length; i1++)this.#convertAllElements(xmlEl1.children[i1], pEl1);
    }
     #convertXML(e) {
        const xml = e.target.response.documentElement;
        this.#convertAllElements(xml);
        document.querySelectorAll("canvas").forEach((canvas)=>canvas.runCode());
    }
     #copyAttributes(orig, copy) {
        const attrs = orig.attributes;
        for(let i2 = 0; i2 < attrs.length; i2++){
            const attr = attrs[i2];
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
        return [
            "p-" + xmlTag1
        ];
    }
}
customElements.define("p-sketch", $641a8979c6a6229d$var$Sketch, {
    extends: "link"
});



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
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_describeHTML", (base)=>function(type, text) {
        const cnvId = this.canvas.id;
        const describeId = `#${cnvId}_Description`;
        if (type === "fallback" && !this.dummyDOM.querySelector(describeId)) {
            const fallback = this._createDescriptionContainer().querySelector(`#${cnvId}_fallbackDesc`);
            fallback.innerHTML = text;
        } else base.call(this, type, text);
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
    cursor_type: {
        get: function() {
            return this.canvas?.style.cursor;
        },
        set: function(val) {
            if (val === this.NONE) this.noCursor();
            else if (Array.isArray(val)) this.cursor(...val);
            else this.cursor(val);
        }
    },
    delta_time: {
        get: function() {
            return this.deltaTime;
        }
    },
    display_width: {
        get: function() {
            return this.displayWidth;
        }
    },
    display_height: {
        get: function() {
            return this.displayHeight;
        }
    },
    frame_count: {
        get: function() {
            return this.frameCount;
        }
    },
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
        get: function() {
            return this.sketch_description;
        },
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
    width: {
        get: function() {
            return this._width;
        },
        set: function(val) {
            if (val !== this._width) {
                this._setProperty("_width", val);
                this.resizeCanvas(this._width, this._height);
            }
        }
    },
    height: {
        get: function() {
            return this._height;
        },
        set: function(val) {
            if (val !== this._height) {
                this._setProperty("_height", val);
                this.resizeCanvas(this._width, this._height);
            }
        }
    },
    log: {
        set: function(val) {
            this.print(val);
        }
    },
    sketch_description: {
        get: function() {
            const cnvId = this.canvas.id;
            const descContainer = this.dummyDOM.querySelector(`#${cnvId}_Description`);
            if (descContainer) return descContainer;
            const labelContainer = this.dummyDOM.querySelector(`#${cnvId}_Label`);
            return labelContainer;
        },
        set: function(val) {
            if (Array.isArray(val)) this.describe(...val);
            else this.describe(val);
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




(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("lerpColor");
p5.prototype.NONE = "none";
class $be018c00eb40bc53$export$f08b370029806897 extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(overloads, renderFunctionName){
        /**
     * @private
     */ overloads = [
            "v1, v2, v3, [alpha]",
            "value",
            "gray, [alpha]",
            "values",
            "c",
            ...overloads, 
        ];
        super(overloads, renderFunctionName);
    }
}
//  TODO - Less hacky way to set color before initializing p5?
const $be018c00eb40bc53$var$transparent = p5.prototype.color.call({
    _colorMode: "rgb",
    _colorMaxes: {
        rgb: [
            255,
            255,
            255,
            255
        ]
    }
}, 0, 0);
p5.prototype.setErase = p5.prototype.erase;
p5.prototype._background = $be018c00eb40bc53$var$transparent;
/**
 * The background property sets the color used
 * for the background of the canvas. The default background is transparent.
 * The color is either specified in terms of the RGB, HSB, or HSL color depending
 * on the current color_mode. (The default color space
 * is RGB, with each value in the range from 0 to 255). The alpha range by default
 * is also 0 to 255.<br><br>
 *
 * If a single string value is provided, RGB, RGBA and Hex CSS color strings
 * and all named color strings are supported. In this case, an alpha number
 * value as a second argument is not supported, the RGBA form should be used.
 *
 * A <a href="https://p5js.org/reference/#/p5.Color">p5.Color</a> object
 * can also be provided to set the background color.
 *
 * A <a href="https://p5js.org/reference/#/p5.Image">p5.Image</a> can also
 * be provided to set the background image.
 *
 * @external p5.prototype
 * @see https://p5js.org/reference
 * */ /**
 * @member external:p5.prototype.canvas_background
 * */ Object.defineProperties(p5.prototype, {
    canvas_background: {
        get: function() {
            return this._background;
        },
        set: function(val) {
            if (val === this.NONE) this._background = $be018c00eb40bc53$var$transparent;
            else if (val instanceof p5.Image) this._background = val;
            else this._background = this.color(val);
        }
    }
});
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    color_mode: {
        get: function() {
            return this._colorMode;
        },
        set: function(val) {
            this.colorMode(val);
        }
    },
    fill_color: {
        get: function() {
            if (!this.drawingContext) return "";
            return this.color(this.drawingContext.fillStyle);
        },
        set: function(val) {
            if (val === this.NONE) this.noFill();
            else this.fill(val);
        }
    },
    stroke_color: {
        get: function() {
            if (!this.drawingContext) return "";
            return this.color(this.drawingContext.strokeStyle);
        },
        set: function(val) {
            if (val === this.NONE) this.noStroke();
            else this.stroke(val);
        }
    },
    erase: {
        get: function() {
            return this._isErasing;
        },
        set: function(val) {
            if (val === true) this.setErase();
            else if (Array.isArray(val)) this.setErase(...val);
            else this.setErase(val);
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
 */ class $be018c00eb40bc53$var$Clear extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "",
            "r, g, b, a"
        ]);
    }
}
customElements.define("p-clear", $be018c00eb40bc53$var$Clear);
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
 */ class $be018c00eb40bc53$var$PaintBucket extends $be018c00eb40bc53$export$f08b370029806897 {
    constructor(){
        super([
            "colorstring, [a]",
            "gray, [a]",
            "image, [a]",
            "v1, v2, v3, [a]"
        ], "background");
    }
}
customElements.define("p-paint-bucket", $be018c00eb40bc53$var$PaintBucket);
p5.prototype.registerMethod("pre", function() {
    this.background(this.canvas_background);
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
    if (x + w >= x2 && x <= x2 + w2 && y + h >= y2 && y <= y2 + h2) // r1 bottom edge past r2 top
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
    if (pointX >= x && pointX <= x + xW && pointY >= y && pointY <= y + yW) // above the bottom
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




const $c7ffc8b66df47534$var$transformVertexFn = (el)=>(v)=>{
        const originalPoint = new DOMPoint(v.x, v.y);
        const { x: x , y: y  } = el.pInst._transform_point_matrix(originalPoint, el.transform_matrix);
        return el.pInst.createVector(x, y);
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
 * @attr {Number} x - x-coordinate of the arc's ellipse
 * @attr {Number} y - y-coordinate of the arc's ellipse
 * @attr {Number} w - width of the arc's ellipse by default (affected by ellipse_mode)
 * @attr {Number} h - height of the arc's ellipse by default (affected by ellipse_mode)
 * @attr {Number} start - angle to start the arc, specified in radians
 * @attr {Number} stop - angle to stop the arc, specified in radians
 * @attr {Constant} mode - determines the way of drawing the arc. either
 * CHORD, PIE or OPEN.
 * @attr {Integer} detail - optional parameter for WebGL mode only. This is
 * to specify the number of vertices that makes up the perimeter of the arc.
 * Default value is 25. Won't draw a stroke for a detail of more than 50.
 */ class $c7ffc8b66df47534$var$Arc extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "x, y, w, h, start_angle, stop_angle, [mode], [detail], [a]"
        ]);
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        const { x: x , y: y , w: w , h: h , start_angle: start_angle , stop_angle: stop_angle  } = this.this_element;
        console.assert(w === h, "mouse_over currently only works for arc's with equal width and height.");
        const arcRadius = w / 2;
        const arcAngle = stop_angle - start_angle;
        const arcRotation = start_angle + arcAngle / 2;
        return this.pInst.collide_point_arc(mouse_trans_pos_x, mouse_trans_pos_y, x, y, arcRadius, arcRotation, arcAngle);
    }
}
customElements.define("p-arc", $c7ffc8b66df47534$var$Arc);
/**
 * Draws an ellipse (oval) to the screen. If no height is specified, the
 * value of width is used for both the width and height. If a
 * negative height or width is specified, the absolute value is taken.
 *
 * An ellipse with equal width and height is a circle. The origin may be
 * changed with the ellipseMode() function.
 * @element ellipse
 * @attr {Number} x - x-coordinate of the center of the ellipse
 * @attr {Number} y - y-coordinate of the center of the ellipse
 * @attr {Number} w - width of the ellipse
 * @attr {Number} h - height of the ellipse
 * @attr {Integer} detail - For WEBGL mode only. This is to specify the
 * number of vertices that makes up the perimeter of the ellipse. Default
 * value is 25. Won't draw a stroke for a detail of more than 50.
 */ class $c7ffc8b66df47534$var$Ellipse extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "x, y, w, [h]",
            "x, y, w, h, [detail]"
        ]);
    }
    collider = p5.prototype.collider_type.ellipse;
    get collision_args() {
        const originalPoint = new DOMPoint(this.this_element.x, this.this_element.y);
        const { x: x , y: y  } = this.pInst._transform_point_matrix(originalPoint, this.transform_matrix);
        const { pixel_density: pixel_density  } = this.pInst;
        const { w: w  } = this.this_element * pixel_density;
        const { h: h  } = this.this_element.h * pixel_density || w;
        return [
            x,
            y,
            w,
            h
        ];
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        const { x: x , y: y , w: w , h: h  } = this.this_element;
        return this.pInst.collide_point_ellipse(mouse_trans_pos_x, mouse_trans_pos_y, x, y, w, h);
    }
}
customElements.define("p-ellipse", $c7ffc8b66df47534$var$Ellipse);
/**
 * Draws a circle to the screen. A circle is a simple closed shape. It is the
 * set of all points in a plane that are at a given distance from a given
 * point, the center.
 * @element circle
 * @attr {Number} x - x-coordinate of the center of the circle
 * @attr {Number} y - y-coordinate of the center of the circle
 * @attr {Number} d - diameter of the circle
 */ class $c7ffc8b66df47534$var$Circle extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "x, y, d"
        ]);
    }
    collider = p5.prototype.collider_type.circle;
    get collision_args() {
        const originalPoint = new DOMPoint(this.this_element.x, this.this_element.y);
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
customElements.define("p-circle", $c7ffc8b66df47534$var$Circle);
/**
 * Draws a line (a direct path between two points) to the screen. This width
 * can be modified by using the stroke_weight attribute. A line cannot be
 * filled, therefore the fill_color attribute will not affect the color of a
 * line. So to color a line, use the stroke_color attribute.
 * @element line
 * @attr {Number} x1 - x-coordinate of the first point
 * @attr {Number} y1 - y-coordinate of the first point
 * @attr {Number} x2 - x-coordinate of the second point
 * @attr {Number} y2 - y-coordinate of the second point
 * @attr {Number} z1 - z-coordinate of the first point (WEBGL mode)
 * @attr {Number} z2 - z-coordinate of the second point (WEBGL mode)
 */ class $c7ffc8b66df47534$var$Line extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
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
customElements.define("p-line", $c7ffc8b66df47534$var$Line);
/**
 * Draws a point, a coordinate in space at the dimension of one pixel. The
 * color of the point is changed with the stroke_color attribute. The size of
 * the point can be changed with the stroke_weight attribute.
 * @element point
 * @attr {Number} x - x-coordinate
 * @attr {Number} y - y-coordinate
 * @attr {Number} z - z-coordinate (WEBGL mode)
 */ class $c7ffc8b66df47534$var$Point extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "x, y, [z]",
            "coordinate_vector"
        ]);
    }
    collider = p5.prototype.collider_type.circle;
    get collision_args() {
        const originalPoint = new DOMPoint(this.this_element.x, this.this_element.y);
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
        const { x: x , y: y , stroke_weight: stroke_weight , pixel_density: pixel_density , mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y ,  } = this.this_element;
        const d = stroke_weight * this.pInst.pow(pixel_density, 2);
        return this.pInst.collide_point_circle(mouse_trans_pos_x, mouse_trans_pos_y, x, y, d);
    }
}
customElements.define("p-point", $c7ffc8b66df47534$var$Point);
/**
 * Draws a quad on the canvas. A quad is a quadrilateral, a four-sided
 * polygon. It is similar to a rectangle, but the angles between its edges
 * are not constrained to ninety degrees. The x1 and y1 attributes set the
 * first vertex and the subsequent pairs should proceed clockwise or
 * counter-clockwise around the defined shape. z attributes only work when
 * quad() is used in WEBGL mode.
 * @element quad
 * @attr {Number} x1 - x-coordinate of the first point
 * @attr {Number} y1 - y-coordinate of the first point
 * @attr {Number} x2 - x-coordinate of the second point
 * @attr {Number} y2 - y-coordinate of the second point
 * @attr {Number} x3 - x-coordinate of the third point
 * @attr {Number} y3 - y-coordinate of the third point
 * @attr {Number} x4 - x-coordinate of the fourth point
 * @attr {Number} y4 - y-coordinate of the fourth point
 * @attr {Integer} detail_x - number of segments in the x-direction (WEBGL mode)
 * @attr {Integer} detail_y - number of segments in the y-direction (WEBGL mode)
 * @attr {Number} z1 - z-coordinate of the first point (WEBGL mode)
 * @attr {Number} z2 - z-coordinate of the second point (WEBGL mode)
 * @attr {Number} z3 - z-coordinate of the third point (WEBGL mode)
 * @attr {Number} z4 - z-coordinate of the fourth point (WEBGL mode)
 */ class $c7ffc8b66df47534$var$Quad extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "x1, y1, x2, y2, x3, y3, x4, y4, [detail_x], [detail_y]",
            "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, [detail_x], [detail_y]", 
        ]);
    }
    collider = p5.prototype.collider_type.poly;
    get collision_args() {
        return [
            this.vertices.map($c7ffc8b66df47534$var$transformVertexFn(this))
        ];
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        return this.pInst.collide_point_poly(mouse_trans_pos_x, mouse_trans_pos_y, this.vertices);
    }
    get vertices() {
        const { x1: x1 , y1: y1 , x2: x2 , y2: y2 , x3: x3 , y3: y3 , x4: x4 , y4: y4  } = this.this_element;
        return [
            this.pInst.createVector(x1, y1),
            this.pInst.createVector(x2, y2),
            this.pInst.createVector(x3, y3),
            this.pInst.createVector(x4, y4), 
        ];
    }
}
customElements.define("p-quad", $c7ffc8b66df47534$var$Quad);
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
 * @attr  {Number} x - x-coordinate of the rectangle.
 * @attr  {Number} y - y-coordinate of the rectangle.
 * @attr  {Number} w - width of the rectangle.
 * @attr  {Number} h - height of the rectangle.
 * @attr  {Number} tl - radius of top-left corner.
 * @attr  {Number} tr - radius of top-right corner.
 * @attr  {Number} br - radius of bottom-right corner.
 * @attr  {Number} bl - radius of bottom-left corner.
 */ class $c7ffc8b66df47534$var$Rect extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "x, y, w, [h], [tl], [tr], [br], [bl]",
            "x, y, w, h, [detail_x], [detail_y]", 
        ]);
    }
    collider = p5.prototype.collider_type.rect;
    get collision_args() {
        const originalPoint = new DOMPoint(this.this_element.x, this.this_element.y);
        const { x: x , y: y  } = this.pInst._transform_point_matrix(originalPoint, this.transform_matrix);
        const { pixel_density: pixel_density  } = this.pInst;
        const w = this.this_element.w * this.pInst.pow(pixel_density, 2);
        const h = this.this_element.h * this.pInst.pow(pixel_density, 2);
        return [
            x,
            y,
            w,
            h
        ];
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        const { x: x , y: y , w: w , h: h  } = this.this_element;
        return this.pInst.collide_point_rect(mouse_trans_pos_x, mouse_trans_pos_y, x, y, w, h);
    }
}
customElements.define("p-rect", $c7ffc8b66df47534$var$Rect);
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
 * @attr  {Number} x - x-coordinate of the square.
 * @attr  {Number} y - y-coordinate of the square.
 * @attr  {Number} s - side size of the square.
 * @attr  {Number} tl - radius of top-left corner.
 * @attr  {Number} tr - radius of top-right corner.
 * @attr  {Number} br - radius of bottom-right corner.
 * @attr  {Number} bl - radius of bottom-left corner.
 */ class $c7ffc8b66df47534$var$Square extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "x, y, s, [tl], [tr], [br], [bl]"
        ]);
    }
    collider = p5.prototype.collider_type.rect;
    get collision_args() {
        const originalPoint = new DOMPoint(this.this_element.x, this.this_element.y);
        const { x: x , y: y  } = this.pInst._transform_point_matrix(originalPoint, this.transform_matrix);
        const { pixel_density: pixel_density  } = this.pInst;
        const { s: s  } = this.this_element;
        const w = s * this.pInst.pow(pixel_density, 2);
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
        const { x: x , y: y , s: s  } = this.this_element;
        return this.pInst.collide_point_rect(mouse_trans_pos_x, mouse_trans_pos_y, x, y, s, s);
    }
}
customElements.define("p-square", $c7ffc8b66df47534$var$Square);
class $c7ffc8b66df47534$var$Triangle extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        const overloads = [
            "x1, y1, x2, y2, x3, y3"
        ];
        super(overloads);
    }
    collider = p5.prototype.collider_type.poly;
    get collision_args() {
        return [
            this.vertices.map($c7ffc8b66df47534$var$transformVertexFn(this))
        ];
    }
    get mouse_over() {
        const { mouse_trans_pos_x: mouse_trans_pos_x , mouse_trans_pos_y: mouse_trans_pos_y  } = this.pInst;
        const { x1: x1 , y1: y1 , x2: x2 , y2: y2 , x3: x3 , y3: y3  } = this.this_element;
        return this.pInst.collide_point_triangle(mouse_trans_pos_x, mouse_trans_pos_y, x1, y1, x2, y2, x3, y3);
    }
    get vertices() {
        const { x1: x1 , y1: y1 , x2: x2 , y2: y2 , x3: x3 , y3: y3  } = this.this_element;
        return [
            this.pInst.createVector(x1, y1),
            this.pInst.createVector(x2, y2),
            this.pInst.createVector(x3, y3), 
        ];
    }
}
customElements.define("p-triangle", $c7ffc8b66df47534$var$Triangle);
class $c7ffc8b66df47534$var$Bezier extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "x1, y1, x2, y2, x3, y3, x4, y4",
            "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4", 
        ]);
    }
}
customElements.define("p-bezier", $c7ffc8b66df47534$var$Bezier);
class $c7ffc8b66df47534$var$Curve extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "x1, y1, x2, y2, x3, y3, x4, y4",
            "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4", 
        ]);
    }
}
customElements.define("p-curve", $c7ffc8b66df47534$var$Curve);
class $c7ffc8b66df47534$var$Contour extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            ""
        ], "beginContour");
    }
    endRender() {
        this.pInst.endContour();
    }
}
customElements.define("p-contour", $c7ffc8b66df47534$var$Contour);
class $c7ffc8b66df47534$var$Shape extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "[kind]"
        ], "beginShape");
    }
    collider = p5.prototype.collider_type.poly;
    get collision_args() {
        return [
            this.vertices.map($c7ffc8b66df47534$var$transformVertexFn(this))
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
        const vertexChildren = childArray.filter((el)=>el instanceof $c7ffc8b66df47534$var$Vertex && el.this_element);
        const vertices = vertexChildren.map((el)=>{
            if (el instanceof $c7ffc8b66df47534$var$QuadraticVertex) {
                const { x3: x3 , y3: y3  } = el.this_element;
                return this.pInst.createVector(x3, y3);
            }
            const { x: x , y: y  } = el.this_element;
            return this.pInst.createVector(x, y);
        });
        return vertices.concat(vertices.slice(0));
    }
}
customElements.define("p-shape", $c7ffc8b66df47534$var$Shape);
class $c7ffc8b66df47534$var$Vertex extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "x, y",
            "x, y, [z]",
            "x, y, [z], [u], [v]"
        ]);
    }
}
customElements.define("p-vertex", $c7ffc8b66df47534$var$Vertex);
class $c7ffc8b66df47534$var$QuadraticVertex extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "cx, cy, x3, y3",
            "cx, cy, cz, x3, y3, z3"
        ]);
    }
}
customElements.define("p-quadratic-vertex", $c7ffc8b66df47534$var$QuadraticVertex);
class $c7ffc8b66df47534$var$CurveVertex extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "x, y",
            "x, y, [z]"
        ]);
    }
}
customElements.define("p-curve-vertex", $c7ffc8b66df47534$var$CurveVertex);
class $c7ffc8b66df47534$var$Normal extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "vector",
            "x, y, z"
        ]);
    }
}
customElements.define("p-normal", $c7ffc8b66df47534$var$Normal);
class $c7ffc8b66df47534$var$Plane extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super("[w], [h], [detail_x], [detail_y]");
    }
}
customElements.define("p-plane", $c7ffc8b66df47534$var$Plane);
class $c7ffc8b66df47534$var$Box extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "[w], [h], [depth], [detail_x], [detail_y]"
        ]);
    }
}
customElements.define("p-box", $c7ffc8b66df47534$var$Box);
class $c7ffc8b66df47534$var$Sphere extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "[radius], [detail_x], [detail_y]"
        ]);
    }
}
customElements.define("p-sphere", $c7ffc8b66df47534$var$Sphere);
class $c7ffc8b66df47534$var$Cylinder extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "[radius], [h], [detail_x], [detail_y], [bottomCap], [topCap]"
        ]);
    }
}
customElements.define("p-cylinder", $c7ffc8b66df47534$var$Cylinder);
class $c7ffc8b66df47534$var$Cone extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "[radius], [h], [detail_x], [detail_y], [cap]"
        ]);
    }
}
customElements.define("p-cone", $c7ffc8b66df47534$var$Cone);
class $c7ffc8b66df47534$var$Ellipsoid extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "[radius_x], [radius_y], [radius_z], [detail_x], [detail_y]"
        ]);
    }
}
customElements.define("p-ellipsoid", $c7ffc8b66df47534$var$Ellipsoid);
class $c7ffc8b66df47534$var$Torus extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "[radius], [tubeRadius], [detailX], [detailY]"
        ]);
    }
}
customElements.define("p-torus", $c7ffc8b66df47534$var$Torus);
//  TODO - test when preload implemented
class $c7ffc8b66df47534$var$LoadModel extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "path, normalize, [successCallback], [failureCallback], [fileType]",
            "path, [successCallback], [failureCallback], [fileType]", 
        ]);
    }
}
customElements.define("p-load-model", $c7ffc8b66df47534$var$LoadModel);
class $c7ffc8b66df47534$var$Model extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "model"
        ]);
    }
}
customElements.define("p-model", $c7ffc8b66df47534$var$Model);
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
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    blend_mode: {
        get: function() {
            if (this._renderer?.isP3D) return this.curBlendMode;
            return this.drawingContext?.globalCompositeOperation;
        },
        set: function(val) {
            this.blendMode(val);
        }
    },
    drawing_context: {
        get: function() {
            return this.drawingContext;
        }
    },
    set_webgl_attr: {
        set: function() {
            this.setAttributes(...arguments);
        }
    }
});



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
p5.prototype.registerMethod("pre", function() {
    const { anchor: anchor , angle_vector: angle_vector , scale_factor: scale_factor , shear: shear  } = this;
    this._renderer._anchorStack = [
        anchor
    ];
    this.anchor = anchor;
    this._renderer._angleStack = [
        angle_vector
    ];
    this.angle_vector = angle_vector;
    this._renderer._scaleStack = [
        scale_factor
    ];
    this.scale_factor = scale_factor;
    this._renderer._shearStack = [
        shear
    ];
    this.shear = shear;
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
    1, 
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
        this._setProperty("touche_moved", true);
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
 * @attribute  {Number}   x     the x-coordinate of the top-left corner of the image
 * @attribute  {Number}   y     the y-coordinate of the top-left corner of the image
 * @attribute  {Number}   w  the width to draw the image
 * @attribute  {Number}   h the height to draw the image
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
 */ class $d41e5f38852d70c7$var$Image extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "img, x, y, [w], [h]",
            "img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight]", 
        ]);
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
    },
    image_tint: {
        get: function() {
            return this._renderer?._tint;
        },
        set: function(val) {
            if (val === p5.prototype.NONE) this.noTint();
            else this.tint(...arguments);
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
class $aeaf4bbafe4a9ee3$var$Text extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "content, x, y, [x2], [y2]"
        ]);
    }
}
customElements.define("p-text", $aeaf4bbafe4a9ee3$var$Text);





p5.prototype._orbitControl = {
    on: false,
    sensitivity: []
};
p5.prototype._debugMode = [];
p5.prototype.registerMethod("pre", function() {
    if (this._orbitControl.on) this.orbitControl(...this._orbitControl.sensitivity);
});
p5.prototype.DEFAULT = "default";
p5.prototype.AMBIENT = "ambient";
p5.prototype.SPECULAR = "specular";
p5.prototype.EMISSIVE = "emissive";
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    orbit_control: {
        get: function() {
            return this._orbitControl;
        },
        set: function(val) {
            if (val === false) return this._orbitControl = false;
            this._orbitControl.on = true;
            if (val === true) return;
            if (Array.isArray(val)) this._orbitControl.sensitivity = val;
            this._orbitControl.sensitivity = [
                val
            ];
        }
    },
    debug_mode: {
        get: function() {
            return this._debugMode;
        },
        set: function(val) {
            if (val === this.NONE) this.noDebugMode();
            else {
                this._debugMode = val;
                if (val === true) this.debugMode();
                else this.debugMode(val);
            }
        }
    },
    specular_color: {
        get: function() {
            return this._renderer.specularColors;
        },
        set: function(val) {
            if (Array.isArray(val)) this.specularColor(...val);
            else this.specularColor(val);
        }
    },
    light_falloff: {
        get: function() {
            return [
                this._renderer.constantAttenuation,
                this._renderer.linearAttenuation,
                this._renderer.quadraticAttenuation, 
            ];
        }
    },
    remove_lights: {
        set: function() {
            this.noLights();
        }
    },
    shader: {
        get: function() {
            return [
                this._renderer.userStrokeShader,
                this._renderer.userFillShader
            ];
        },
        set: function(val) {
            if (val === this.DEFAULT) this.resetShader();
            else this.shader(val);
        }
    },
    texture: {
        get: function() {
            return this._renderer._tex;
        },
        set: function(val) {
            this.texture(val);
        }
    },
    texture_mode: {
        get: function() {
            return this._renderer.textureMode;
        },
        set: function(val) {
            this.textureMode(val);
        }
    },
    texture_wrap: {
        get: function() {
            return [
                this._renderer.textureWrapX,
                this._renderer.textureWrapY
            ];
        },
        set: function(val) {
            if (Array.isArray(val)) this.textureWrap(...val);
            else this.textureWrap(val);
        }
    },
    material: {
        get: function() {
            if (this._renderer._useNormalMaterial) return this.NORMAL;
            if (this._renderer._useAmbientMaterial) return this.AMBIENT;
            if (this._renderer._useEmissiveMaterial) return this.EMISSIVE;
            if (this._renderer._useSpecularMaterial) return this.SPECULAR;
        },
        set: function(val) {
            switch(val){
                case this.NORMAL:
                    this.normalMaterial();
                    break;
                case this.AMBIENT:
                    this.ambientMaterial();
                    break;
                case this.EMISSIVE:
                    this.emissiveMaterial();
                    break;
                case this.SPECULAR:
                    this.specularMaterial();
                    break;
            }
        }
    },
    shininess: {
        get: function() {
            return this._renderer._useShininess;
        },
        set: function(val) {
            this.shininess(val);
        }
    },
    camera: {
        get: function() {
            return this._renderer._curCamera;
        },
        set: function(val) {
            this.setCamera(val);
        }
    }
});
(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("createShader", "createCamera");
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
 */ class $da8d19ba6ae4969b$var$AmbientLight extends (0, $be018c00eb40bc53$export$f08b370029806897) {
    constructor(){
        super([]);
    }
}
customElements.define("p-ambient-light", $da8d19ba6ae4969b$var$AmbientLight);
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
 */ class $da8d19ba6ae4969b$var$DirectionalLight extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "v1, v2, v3, x, y, z",
            "v1, v2, v3, direction",
            "color, x, y, z",
            "color, direction", 
        ]);
    }
}
customElements.define("p-directional-light", $da8d19ba6ae4969b$var$DirectionalLight);
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
 */ class $da8d19ba6ae4969b$var$PointLight extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "v1, v2, v3, x, y, z",
            "v1, v2, v3, position",
            "color, x, y, z",
            "color, position", 
        ]);
    }
}
customElements.define("p-point-light", $da8d19ba6ae4969b$var$PointLight);
/**
 * Places an ambient and directional light in the scene.
 * The lights are set to <ambient-light v1="128" v2="128" v3="128"> and
 * <directional-light v1="128" v2="128" v3'="128" x="0" y="0" z="-1">.
 * @element lights
 */ class $da8d19ba6ae4969b$var$Lights extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            ""
        ]);
    }
}
customElements.define("p-lights", $da8d19ba6ae4969b$var$Lights);
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
 */ class $da8d19ba6ae4969b$var$SpotLight extends (0, $641a8979c6a6229d$export$d546242e33fb8131) {
    constructor(){
        super([
            "v1, v2, v3, x, y, z, rx, ry, rz, [angle], [concentration]",
            "color, position, direction, [angle], [concentration]",
            "v1, v2, v3, position, direction, [angle], [concentration]",
            "color, x, y, z, direction, [angle], [concentration]",
            "color, position, rx, ry, rz, [angle], [concentration]",
            "v1, v2, v3, x, y, z, direction, [angle], [concentration]",
            "v1, v2, v3, position, rx, ry, rz, [angle], [concentration]",
            "color, x, y, z, rx, ry, rz, [angle], [concentration]", 
        ]);
    }
}
customElements.define("p-spot-light", $da8d19ba6ae4969b$var$SpotLight);


"use strict";
const $cf838c15c8b009ba$var$customElementsDefined = new Event("customElementsDefined");
dispatchEvent($cf838c15c8b009ba$var$customElementsDefined);


//# sourceMappingURL=p5.marker.js.map
 