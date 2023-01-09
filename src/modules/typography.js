import {
  defineRendererGetterSetters,
  defineSnakeAlias,
} from "../utils/p5Modifiers";
import { P5Function } from "./core";

defineRendererGetterSetters(
  "textAlign",
  "textLeading",
  "textSize",
  "textStyle",
  "textWrap",
  "textFont"
);

defineSnakeAlias("textAscent", "textDescent");

class Text extends P5Function {
  constructor() {
    super(["content, x, y, [x2], [y2]"]);
  }
}
customElements.define("p-text", Text);
