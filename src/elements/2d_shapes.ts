import { visible } from "./visible";
import { position } from "../mixins/position";
import { fill, stroke } from "../mixins/style";
import { dimensions } from "../mixins/dimensions";
import { clickable } from "../mixins/click";
import { MarkerElement } from "./base";
import { Collide } from "../mixins/collide";
import { Vector } from "../mixins/vector";

export class Rectangle extends position(
  dimensions(fill(stroke(clickable(visible(MarkerElement)))))
) {
  colliding(element: MarkerElement) {
    if (element instanceof Rectangle)
      return Collide.rectangleRectangle(this, element);

    console.warn(
      `Collision detection has not been implemented between ${element.tagName} and rectangle.`
    );
    return false;
  }
  renderToCanvas(context: CanvasRenderingContext2D) {
    this.transform_context(context);
    if (this.visible) {
      context.rect(this.position.x, this.position.y, this.width, this.height);
      this.checkClick(context);
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

export class Line extends position(stroke(visible(MarkerElement))) {
  #end_x = null;
  #end_y = null;
  #end = new Vector(
    () =>
      this.#end_x === null
        ? this.inherit("end", new Vector(this.window.width, this.window.height))
            .x
        : this.#end_x,
    (value) => {
      this.#end.x = value;
    },
    () =>
      this.#end_y === null
        ? this.inherit("end", new Vector(this.window.width, this.window.height))
            .y
        : this.#end_y,
    (value) => {
      this.#end.y = value;
    }
  );
  get end() {
    return this.#end;
  }
  set end(value) {
    this.#end = value;
  }
  renderToCanvas(context: CanvasRenderingContext2D): void {
    this.transform_context(context);
    if (this.visible) {
      context.moveTo(this.position.x, this.position.y);
      context.lineTo(this.end.x, this.end.y);
    }
    this.styleContext(context);
    super.renderToCanvas(context);
  }
}
customElements.define("m-line", Line);
