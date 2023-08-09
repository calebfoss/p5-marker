import { visible } from "../mixins/visible";
import { position } from "../mixins/position";
import { stroke } from "../mixins/style";
import { MarkerElement } from "./base";
import { Collide, CollisionElement } from "../mixins/collide";
import { Vector } from "../mixins/vector";
import { Mouse } from "../mixins/mouse";
import { Rectangle } from "./rectangle";

export class Line
  extends position(stroke(visible(MarkerElement)))
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
      context.moveTo(this.position.x, this.position.y);
      context.lineTo(this.end.x, this.end.y);
    }
    this.styleContext(context);
    super.renderToCanvas(context);
  }
}
customElements.define("m-line", Line);
