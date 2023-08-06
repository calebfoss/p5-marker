import { visible } from "./visible";
import { position } from "../mixins/position";
import { fill, stroke } from "../mixins/style";
import { dimensions } from "../mixins/dimensions";
import { clickable } from "../mixins/click";
import { MarkerElement } from "./base";

export class Rectangle extends position(
  dimensions(fill(stroke(clickable(visible(MarkerElement)))))
) {
  renderToCanvas(context: CanvasRenderingContext2D) {
    this.transformCanvas(context);
    Object.assign(context, this.canvas_style);
    if (this.visible) {
      context.rect(this.position.x, this.position.y, this.width, this.height);
      this.checkClick(context);
    }
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
    if (typeof this.#svg_element === "undefined")
      this.#svg_element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
    const element = this.#svg_element;
    parentElement.appendChild(element);
    element.setAttribute("x", this.position.x.toString());
    element.setAttribute("y", this.position.y.toString());
    element.setAttribute("width", this.width.toString());
    element.setAttribute("height", this.height.toString());
    super.renderToSVG(parentElement, element);
  }
  #svg_element: SVGRectElement;
}
customElements.define("m-rectangle", Rectangle);
