import { MarkerElement } from "./base";
import { position } from "../mixins/position";
import { fill, stroke } from "../mixins/style";
import { dimensions } from "../mixins/dimensions";

export class Rectangle extends position(
  dimensions(fill(stroke(MarkerElement)))
) {
  renderToCanvas(context: CanvasRenderingContext2D) {
    this.transformCanvas(context);
    context.rect(this.position.x, this.position.y, this.width, this.height);
    super.renderToCanvas(context);
  }
  #DOM_Element: HTMLElement;
  #DOM_Parent: HTMLElement;
  renderToDOM(parentElement: Node): void {
    if (typeof this.#DOM_Element === "undefined") {
      this.#DOM_Element = document.createElement("div");
    }
    if (parentElement !== this.#DOM_Parent) {
      parentElement.appendChild(this.#DOM_Element);
    }
    this.styleDOMElement(this.#DOM_Element);
    super.renderToDOM(this.#DOM_Element);
  }
  renderToSVG(parentElement: SVGElement): void {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    parentElement.appendChild(element);
    element.setAttribute("x", this.position.x.toString());
    element.setAttribute("y", this.position.y.toString());
    element.setAttribute("width", this.width.toString());
    element.setAttribute("height", this.height.toString());
    super.renderToSVG(parentElement, element);
  }
}
customElements.define("m-rectangle", Rectangle);
