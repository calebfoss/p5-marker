import { origin } from "../mixins/origin";
import { visible } from "../mixins/visible";
import { stroke } from "../mixins/style";
import { MarkerElement } from "./base";
import { Collide, CollisionElement } from "../mixins/collide";
import { Vector } from "../classes/vector";
import { Mouse } from "../mixins/mouse";
import { Rectangle } from "./rectangle";

export class Line
  extends origin(stroke(visible(MarkerElement)))
  implements CollisionElement
{
  get clicked() {
    return this.window.mouse.down && this.hovered;
  }
  colliding(other: Line | Vector | Mouse | Rectangle) {
    if (other instanceof Vector) return Collide.line.vector(this, other);
    if (other instanceof Rectangle) return Collide.rectangle.line(other, this);
    if (other instanceof Line) return Collide.line.line(this, other);
    console.warn(
      `Collision detection has not been implemented between ${
        (other as HTMLElement).tagName
      } and line.`
    );
    return false;
  }
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
  get end(): Vector {
    return this.#end;
  }
  set end(value) {
    this.#end = value;
  }
  protected get gradientCoordinates(): {
    linear: [number, number, number, number];
    radial: [number, number, number, number, number, number];
  } {
    const { origin, end } = this;
    const width = end.x - origin.x;
    const height = end.y - origin.y;
    const centerX = origin.x + width / 2;
    const centerY = origin.y + height / 2;
    return {
      linear: [origin.x, origin.y, end.x, end.y],
      radial: [centerX, centerY, 0, centerX, centerY, width / 2],
    };
  }
  get hovered() {
    return this.colliding(this.window.mouse);
  }
  renderToCanvas(context: CanvasRenderingContext2D): void {
    this.transform_context(context);
    if (this.visible) {
      context.moveTo(this.origin.x, this.origin.y);
      context.lineTo(this.end.x, this.end.y);
    }
    this.styleContext(context);
    super.renderToCanvas(context);
  }
  #previousOrigin = new Vector(null, null);
  #previousEnd = new Vector(null, null);
  styleDocumentElement(): void {
    const { origin, end } = this;
    if (
      this.#previousOrigin.x !== origin.x ||
      this.#previousOrigin.y !== origin.y ||
      this.#previousEnd.x !== end.x ||
      this.#previousEnd.y !== end.y
    ) {
      const angle = Math.atan2(end.y - origin.y, end.x - origin.x);
      const length = Line.distance(origin, end);

      this.setDocumentElementStyle("width", `${length}px`);
      super.styleDocumentElement();
      this.document_element.style.transform += `translate(${origin.x}px, ${
        origin.y
      }px) rotate(${angle}rad) translate(${-origin.x}px, -${origin.y}px)`;
    } else {
      super.styleDocumentElement();
    }
  }
  styleSVGElement(newElement?: boolean): void {
    this.setSVGElementAttribute("x1", this.origin.x.toString());
    this.setSVGElementAttribute("y1", this.origin.y.toString());
    this.setSVGElementAttribute("x2", this.end.x.toString());
    this.setSVGElementAttribute("y2", this.end.y.toString());
    super.styleSVGElement(newElement);
  }
  protected svgTag: keyof SVGElementTagNameMap = "line";
}
customElements.define("m-line", Line);
