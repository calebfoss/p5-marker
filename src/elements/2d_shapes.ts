import { MarkerElement } from "./base";
import { xy } from "../properties/coordinates";
import { fill, stroke } from "../properties/color";

export class Rectangle extends xy(fill(stroke(MarkerElement))) {
  render(context: CanvasRenderingContext2D) {
    super.render(context);
    if (this.stroke !== null)
      context.strokeRect(this.x, this.y, this.width, this.height);
    if (this.fill !== null)
      context.fillRect(this.x, this.y, this.width, this.height);
  }
}
