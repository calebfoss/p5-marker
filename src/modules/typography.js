import {
  defineRendererGetterSetters,
  defineSnakeAlias,
} from "../utils/p5Modifiers";
import { RenderedElement } from "./core";

defineRendererGetterSetters(
  "textAlign",
  "textLeading",
  "textSize",
  "textStyle",
  "textWrap",
  "textFont"
);

defineSnakeAlias("textAscent", "textDescent");

class Text extends RenderedElement {
  constructor() {
    super(["content, x, y, [x2], [y2]"]);
  }
}
customElements.define("p-text", Text);
