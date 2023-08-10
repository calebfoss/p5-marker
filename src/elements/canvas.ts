import { dimensions } from "../mixins/dimensions";
import { defaultFill, defaultStroke } from "../mixins/style";
import { MarkerElement } from "./base";
import { MarkerSVG } from "./svg";

export class MarkerCanvas extends dimensions(MarkerElement) {
  #dom_element: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  constructor() {
    super();
    this.#dom_element = document.createElement("canvas");
    const context = this.#dom_element.getContext("2d");
    if (context !== null) this.#context = context;
    this.#dom_element;
  }
  #background = MarkerCanvas.gray(220);
  get background() {
    return this.#background;
  }
  set background(value) {
    this.#background = value;
    this.setDocumentElementStyle("background", value);
    this.setSVGStyle("fill", value);
  }
  get canvas() {
    return this;
  }
  protected createDocumentElement(): HTMLCanvasElement {
    const element = document.createElement("canvas");
    element.addEventListener("click", (e) => {
      this.dispatchEvent(e);
    });
    return element;
  }
  protected createSVGElement(): SVGElement {
    const groupElement = super.createSVGGroup();
    const viewElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "view"
    );
    const backgroundElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    groupElement.appendChild(backgroundElement);
    groupElement.appendChild(viewElement);
    return groupElement;
  }
  get document_element() {
    return super.document_element as HTMLCanvasElement;
  }
  set download(filename: string) {
    const extension = filename.slice(filename.lastIndexOf(".") + 1);
    let mimeType = "image/png";
    let dataURL = "";
    switch (extension) {
      case "svg":
        const markerSVG = document.createElement("m-svg") as MarkerSVG;
        const svgParent = markerSVG.document_element;
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
    return this.document_element.getContext("2d");
  }
  renderToCanvas(context: CanvasRenderingContext2D): void {
    const canvasElement = context.canvas;
    if (
      canvasElement.width !== this.width ||
      canvasElement.height !== this.height
    ) {
      const contextCopy = JSON.parse(JSON.stringify(context));
      canvasElement.width = this.width;
      canvasElement.height = this.height;
      Object.assign(context, contextCopy);
    }
    if (this.background !== MarkerCanvas.NONE) {
      context.fillStyle = this.background;
      context.fillRect(0, 0, this.width, this.height);
    }
    context.fillStyle = defaultFill;
    context.strokeStyle = defaultStroke;
    super.renderToCanvas(context);
  }
  renderToDOM(parentElement: Node) {
    const canvasElement = this.document_element;
    if (parentElement !== canvasElement.parentElement)
      parentElement.appendChild(canvasElement);
    const context = canvasElement.getContext("2d");
    this.renderToCanvas(context);
  }
  styleSVGElement(): void {
    const [viewElement, backgroundElement] = this.svg_group.children;
    const currentViewBoxValue = viewElement.getAttributeNS(
      "http://www.w3.org/2000/svg",
      "viewBox"
    );
    const nextViewBoxValue = `0 0 ${this.width} ${this.height}`;
    if (currentViewBoxValue !== nextViewBoxValue) {
      viewElement.setAttribute("viewBox", nextViewBoxValue);
      backgroundElement.setAttribute("width", this.width.toString());
      backgroundElement.setAttribute("height", this.height.toString());
    }
  }
}
customElements.define("m-canvas", MarkerCanvas);
