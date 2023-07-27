import { dimensions } from "../mixins/dimensions";
import { MarkerElement, identity, createProperty } from "./base";
import { MarkerSVG } from "./svg";

export class Canvas extends dimensions(MarkerElement) {
  #dom_element: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  constructor() {
    super();
    this.propertyManager.background = this.#background;
    this.#dom_element = document.createElement("canvas");
    const context = this.#dom_element.getContext("2d");
    if (context !== null) this.#context = context;
  }
  #background = createProperty(Canvas.gray(220));
  get background() {
    return this.#background.get();
  }
  set background(value) {
    this.#background.get = identity(value);
  }
  get canvas() {
    return this;
  }
  get dom_element() {
    return this.#dom_element;
  }
  set download(filename: string) {
    const extension = filename.slice(filename.lastIndexOf(".") + 1);
    let mimeType = "image/png";
    let dataURL = "";
    switch (extension) {
      case "svg":
        const markerSVG = document.createElement("m-svg") as MarkerSVG;
        const svgParent = markerSVG.dom_element;
        this.renderToSVG(svgParent);
        markerSVG.download = filename;
        return;
      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg";
      case "png":
      default:
        dataURL = this.#dom_element.toDataURL(mimeType);
    }
    const anchor = document.createElement("a");
    anchor.href = dataURL;
    anchor.download = filename;
    anchor.click();
  }
  get drawing_context() {
    return this.#context;
  }
  declare propertyManager: PropertyManager<Canvas>;
  renderToCanvas(context: CanvasRenderingContext2D): void {
    const canvas = this.#dom_element as HTMLCanvasElement;
    if (canvas.width !== this.width || canvas.height !== this.height) {
      const contextCopy = JSON.parse(JSON.stringify(context));
      canvas.width = this.width;
      canvas.height = this.height;
      Object.assign(context, contextCopy);
    }
    if (this.background !== null) {
      context.fillStyle = this.background;
      context.fillRect(0, 0, this.width, this.height);
    }
    super.renderToCanvas(context);
  }
  renderToDOM(parentElement: Node) {
    if (typeof this.#dom_element === "undefined")
      this.#dom_element = document.createElement("canvas");
    if (parentElement !== this.#dom_element.parentElement)
      parentElement.appendChild(this.#dom_element);
    if (typeof this.#context === "undefined") {
      const context = this.#dom_element.getContext("2d");
      if (context === null) return;
      this.#context = context;
    }
    this.renderToCanvas(this.#context);
  }
  #svg_element: SVGElement;
  #svg_background_element: SVGElement;
  renderToSVG(parentElement: SVGElement) {
    if (typeof this.#svg_element === "undefined") {
      this.#svg_element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "view"
      );
    }
    this.#svg_element.setAttribute(
      "viewBox",
      `0 0 ${this.width} ${this.height}`
    );
    if (parentElement !== this.#svg_element.parentNode)
      parentElement.appendChild(this.#svg_element);
    const backgroundElementDefined =
      typeof this.#svg_background_element !== "undefined";
    if (this.background !== null) {
      if (!backgroundElementDefined) {
        this.#svg_background_element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        this.#svg_element.appendChild(this.#svg_background_element);
      }
      this.#svg_background_element.style.stroke = "none";
      this.#svg_background_element.style.fill = this.background;
      this.#svg_background_element.style.width = this.width.toString();
      this.#svg_background_element.style.height = this.height.toString();
    } else if (backgroundElementDefined) this.#svg_background_element.remove();
    super.renderToSVG(parentElement, this.#svg_background_element);
  }
}
customElements.define("m-canvas", Canvas);
