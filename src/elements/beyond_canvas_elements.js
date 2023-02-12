import { interpret } from "../interpreter/interpreter";

export const defineCustomElement = (el) => {
  const name = interpret(el, "name", el.getAttribute("name"))();
  //  Trick custom-elements-manifest into ignoring this
  customElements["define"](
    `p-${name}`,
    class extends el.constructor {
      renderFunctionName = el.renderFunctionName;
      constructor() {
        super();
      }
      /**
       * Sets the default values for this element's attributes.
       */
      setDefaults() {
        Array.from(el.attributes).forEach(
          (a) =>
            this.hasAttribute(a.name) === false &&
            this.setAttribute(a.name, a.value)
        );
        const childClones = Array.from(el.children).map((child) =>
          child.cloneNode(true)
        );
        this.prepend(...childClones);
      }
      renderToCanvas = null;
    }
  );
};
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
    for (const childNode of xmlEl.childNodes) {
      if (childNode.nodeType === 1)
        pEl.appendChild(this.#convertElement(childNode));
      else pEl.appendChild(childNode.cloneNode());
    }
    if (pEl.hasAttribute("name")) defineCustomElement(pEl);
    return pEl;
  }
  #convertXML(e) {
    const xml = e.target.response.documentElement;
    document.body.appendChild(this.#convertElement(xml));
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
