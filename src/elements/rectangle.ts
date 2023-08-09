import { visible } from "./visible";
import { position } from "../mixins/position";
import { fill, stroke } from "../mixins/style";
import { dimensions } from "../mixins/dimensions";
import { MarkerElement } from "./base";
import { Collide, CollisionElement } from "../mixins/collide";
import { Vector } from "../mixins/vector";
import { Mouse } from "../mixins/mouse";
import { Line } from "./line";

export class Rectangle
  extends position(dimensions(fill(stroke(visible(MarkerElement)))))
  implements CollisionElement
{
  get clicked() {
    return this.window.mouse.up && this.hovered;
  }
  colliding(other: Mouse | Vector | Line | Rectangle) {
    if (other instanceof Vector) return Collide.rectangle.vector(this, other);
    if (other instanceof Rectangle)
      return Collide.rectangle.rectangle(this, other);
    if (other instanceof Line) return Collide.rectangle.line(this, other);
    console.warn(
      `Collision detection has not been implemented between ${
        (other as HTMLElement).tagName
      } and rectangle.`
    );
    return false;
  }
  get hovered() {
    return this.colliding(this.window.mouse);
  }
  renderToCanvas(context: CanvasRenderingContext2D) {
    this.transform_context(context);
    if (this.visible) {
      context.rect(this.position.x, this.position.y, this.width, this.height);
      if (this.clicked) this.dispatchEvent(new MouseEvent("click"));
    }
    this.styleContext(context);
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
