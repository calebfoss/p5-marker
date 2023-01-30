import { P5Element } from "../core";
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
    if (xmlTag === "custom") pEl.define();
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
/**
 * The ```<custom>``` element generates a new element from a combination of existing
 * elements. This element should be placed outside the ```<canvas>``` element.
 * The name attribute defines the name of the new element. For
 * example, if name is set to "my-element," you can add ```<my-element>``` to your sketch.
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
 *      background="100, 140, 200"
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
    if (this.attributes.length) this.define(this);
  }
  /**
   * Defines the custom element created by this element.
   */
  define() {
    const pCustomEl = this;
    const name = pCustomEl.getAttribute("name");
    //  Trick custom-elements-manifest into ignoring this
    customElements["define"](
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
