import { MarkerElement } from "./base";
import { position } from "../properties/position";
import { fill, stroke } from "../properties/style";

export class Rectangle extends position(fill(stroke(MarkerElement))) {
  render(context: CanvasRenderingContext2D) {
    super.render(context);
    if (this.stroke !== null)
      context.strokeRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    if (this.fill !== null)
      context.fillRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }
}
