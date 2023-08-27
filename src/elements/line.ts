import { visible } from "../mixins/visible";
import { stroke } from "../mixins/style";
import { MarkerElement } from "./base";
import { Collide, CollisionElement } from "../mixins/collide";
import { Vector } from "../classes/vector";
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
    const { start, end } = this;
    const width = end.x - start.x;
    const height = end.y - start.y;
    const centerX = start.x + width / 2;
    const centerY = start.y + height / 2;
    return {
      linear: [start.x, start.y, end.x, end.y],
      radial: [centerX, centerY, 0, centerX, centerY, width / 2],
    };
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
  get start(): Vector {
    return this.#start;
  }
  set start(value) {
    this.#start = value;
  }
  #previousStart = new Vector(null, null);
  #previousEnd = new Vector(null, null);
  styleDocumentElement(): void {
    const { start, end } = this;
    if (
      this.#previousStart.x !== start.x ||
      this.#previousStart.y !== start.y ||
      this.#previousEnd.x !== end.x ||
      this.#previousEnd.y !== end.y
    ) {
      const angle = Math.atan2(
        this.end.y - this.start.y,
        this.end.x - this.start.x
      );
      const length = Line.distance(this.start, this.end);
      this.setDocumentElementStyle("width", `${length}px`);
      this.setDocumentElementStyle(
        "transformOrigin",
        `-${this.start.x}px -${this.start.y}px`
      );
      this.setDocumentElementStyle("rotate", `${angle}rad`);
    }
    super.styleDocumentElement();
  }
  styleSVGElement(newElement?: boolean): void {
    this.setSVGElementAttribute("x1", this.start.x.toString());
    this.setSVGElementAttribute("y1", this.start.y.toString());
    this.setSVGElementAttribute("x2", this.end.x.toString());
    this.setSVGElementAttribute("y2", this.end.y.toString());
    super.styleSVGElement(newElement);
  }
  protected svgTag: keyof SVGElementTagNameMap = "line";
}
customElements.define("m-line", Line);
