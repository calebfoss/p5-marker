import { MarkerElement } from "./base";
import { xy } from "../properties/space";
import { fill, stroke } from "../properties/color";

export class Rectangle extends xy(fill(stroke(MarkerElement))) {
  render(context: CanvasRenderingContext2D) {
    super.render(context);
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
