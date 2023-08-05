import { VisibleElement } from "./visible";
import { position } from "../mixins/position";
import { stroke, fill } from "../mixins/style";
import { dimensions } from "../mixins/dimensions";
import { MarkerElement } from "./base";

export class Setting extends position(
  dimensions(stroke(fill(VisibleElement)))
) {
  renderToCanvas(context: CanvasRenderingContext2D): void;
  renderToCanvas(context: CanvasRenderingContext2D): void {
    for (const child of this.children) {
      if (child instanceof MarkerElement) child.draw(context);
    }
  }
}
customElements.define("m-setting", Setting);
