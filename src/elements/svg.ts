import { MarkerElement } from "./base";
import { dimensions } from "../mixins/dimensions";

export class MarkerSVG extends dimensions(MarkerElement) {
  #dom_element: SVGElement;
  constructor(...args: any[]) {
    super(...args);
    this.#dom_element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
  }
  get dom_element() {
    return this.#dom_element;
  }
  set download(filename: string) {
    const anchor = document.createElement("a");
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(this.#dom_element);
    const blob = new Blob([xmlString], { type: "image/svg" });
    anchor.href = URL.createObjectURL(blob);
    const extension = filename.slice(filename.lastIndexOf(".") + 1);
    anchor.download = extension === "svg" ? filename : `${filename}.svg`;
    anchor.click();
  }
  renderToDOM(parentElement: Node): void {
    if (parentElement !== this.#dom_element.parentElement)
      parentElement.appendChild(this.#dom_element);
    this.styleDocumentElement(this.#dom_element);
    super.renderToSVG(this.#dom_element);
  }
}
customElements.define("m-svg", MarkerSVG);
