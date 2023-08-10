import { MarkerElement } from "./base";
import { dimensions } from "../mixins/dimensions";

export class MarkerSVG extends dimensions(MarkerElement) {
  constructor(...args: any[]) {
    super(...args);
  }
  protected createDocumentElement(): SVGSVGElement {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    element.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    element.addEventListener("click", (e) => {
      this.dispatchEvent(new MouseEvent("click", e));
    });
    return element;
  }
  set download(filename: string) {
    const anchor = document.createElement("a");
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(this.document_element);
    const blob = new Blob([xmlString], { type: "image/svg" });
    anchor.href = URL.createObjectURL(blob);
    const extension = filename.slice(filename.lastIndexOf(".") + 1);
    anchor.download = extension === "svg" ? filename : `${filename}.svg`;
    anchor.click();
  }
  renderToDOM(parentElement: Node): void {
    const element = this.document_element;
    if (parentElement !== element.parentElement)
      parentElement.appendChild(element);
    this.styleDocumentElement(element);
    for (const child of this.children) {
      if (child instanceof MarkerElement) child.draw(element);
    }
  }
  styleDocumentElement(element: Element): void {
    const currentViewBoxValue = element.getAttributeNS(
      "http://www.w3.org/2000/svg",
      "viewBox"
    );
    const nextViewBoxValue = `0 0 ${this.width} ${this.height}`;
    if (currentViewBoxValue !== nextViewBoxValue)
      element.setAttributeNS(
        "http://www.w3.org/2000/svg",
        "viewBox",
        nextViewBoxValue
      );
    element.setAttribute("width", `${this.width}px`);
    element.setAttribute("height", `${this.height}px`);
  }
}
customElements.define("m-svg", MarkerSVG);
