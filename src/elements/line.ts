import { visible } from "../mixins/visible";
import { stroke } from "../mixins/style";
import { MarkerElement } from "./base";
import { Collide, CollisionElement } from "../mixins/collide";
import { Vector } from "../mixins/vector";
import { Mouse } from "../mixins/mouse";
import { Rectangle } from "./rectangle";

const origin = new Vector(0, 0);

export class Line
  extends stroke(visible(MarkerElement))
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
  get end() {
    return this.#end;
  }
  set end(value) {
    this.#end = value;
  }
  get hovered() {
    return this.colliding(this.window.mouse);
  }
  renderToCanvas(context: CanvasRenderingContext2D): void {
    this.transform_context(context);
    if (this.visible) {
      context.moveTo(this.start.x, this.start.y);
      context.lineTo(this.end.x, this.end.y);
    }
    this.styleContext(context);
    super.renderToCanvas(context);
  }
  #start_x = null;
  #start_y = null;
  #start = new Vector(
    () =>
      this.#start_x === null ? this.inherit("start", origin).x : this.#start_x,
    (value) => {
      this.#start_x = value;
    },
    () =>
      this.#start_y === null ? this.inherit("start", origin).y : this.#start_y,
    (value) => {
      this.#start_y = value;
    }
  );
  get start() {
    return this.#start;
  }
  set start(value) {
    this.#start = value;
  }
  #previousStart = new Vector(null, null);
  #previousEnd = new Vector(null, null);
  styleDocumentElement(element: Element): void {
    const { start, end } = this;
    if (
      this.#previousStart.x !== start.x ||
      this.#previousStart.y !== start.y ||
      this.#previousEnd.x !== end.x ||
      this.#previousEnd.y !== end.y
    ) {
      const theta1 = Math.atan2(
        this.end.y - this.start.y,
        this.end.x - this.start.x
      );
      const halfWidth = this.line_width / 2;
      const xShift = Math.sin(theta1) * halfWidth;
      const yShift = Math.cos(theta1) * halfWidth;
      const clipPath =
        `path('` +
        `M ${start.x - xShift} ${start.y + yShift} ` +
        `L ${start.x + xShift} ${start.y - yShift} ` +
        `L ${end.x + xShift} ${end.y - yShift} ` +
        `L ${end.x - xShift} ${end.y + yShift} Z` +
        `')`;
      this.document_element.style.clipPath = clipPath;
      this.setDocumentElementStyle("clipPath", clipPath);
      this.#previousStart.x = start.x;
      this.#previousStart.y = start.y;
      this.#previousEnd.x = end.x;
      this.#previousEnd.y = end.y;
      this.setDocumentElementStyle(
        "height",
        `${Math.max(end.y, start.y) + yShift}px`
      );
    }
    this.setDocumentElementStyle("background", this.stroke);
    super.styleDocumentElement(element);
  }
}
customElements.define("m-line", Line);
