import { position } from "../mixins/position";
import { stroke, fill } from "../mixins/style";
import { dimensions } from "../mixins/dimensions";
import { MarkerElement } from "./base";
import { visible } from "./visible";

export class Setting extends position(
  dimensions(stroke(fill(visible(MarkerElement))))
) {
  renderToCanvas(context: CanvasRenderingContext2D): void;
  renderToCanvas(context: CanvasRenderingContext2D): void {
    this.transformCanvas(context);
    this.styleContext(context);
    super.renderToCanvas(context);
  }
}
customElements.define("m-setting", Setting);
