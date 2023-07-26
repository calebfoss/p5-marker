import { dimensions } from "../mixins/dimensions";
import { MarkerElement, identity, property } from "./base";

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
  #background = property(this.gray(220));
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
        const doc = this.renderToSVG();
        const serializer = new XMLSerializer();
        const xmlString = serializer.serializeToString(doc);
        const blob = new Blob([xmlString], { type: "image/svg" });
        dataURL = URL.createObjectURL(blob);
        break;
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
  renderToSVG() {
    const svgDoc = document.implementation.createDocument(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const root = svgDoc.documentElement as HTMLElement & SVGElement;
    root.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
    if (this.background !== null) {
      const backgroundElement = svgDoc.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      backgroundElement.setAttribute("stroke", "none");
      backgroundElement.setAttribute("fill", this.background);
      backgroundElement.setAttribute("width", this.width.toString());
      backgroundElement.setAttribute("height", this.height.toString());
      root.appendChild(backgroundElement);
    }
    super.renderToSVG(root);
    return svgDoc;
  }
}
customElements.define("m-canvas", Canvas);
