import { visible } from "../mixins/visible";
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
  protected createSVGGroup(): SVGGElement {
    const groupElement = super.createSVGGroup();
    const rectElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    groupElement.appendChild(rectElement);
    return groupElement;
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
  get svg_element(): SVGRectElement {
    const groupElement = this.svg_group;
    const rectElement = groupElement.firstElementChild;
    if (!(rectElement instanceof SVGRectElement))
      throw new Error(
        "Rectangle's svg_group's first child is not a rect element"
      );
    return rectElement;
  }
}
customElements.define("m-rectangle", Rectangle);
