import {
  defineRendererGetterSetters,
  defineSnakeAlias,
} from "../utils/p5Modifiers";
import { FillStrokeElement } from "./color";

defineRendererGetterSetters(
  "textAlign",
  "textLeading",
  "textSize",
  "textStyle",
  "textWrap",
  "textFont"
);

defineSnakeAlias("textAscent", "textDescent");

class Text extends FillStrokeElement {
  constructor() {
    super(["content, x, y, [x2], [y2]"]);
  }
}
customElements.define("p-text", Text);
