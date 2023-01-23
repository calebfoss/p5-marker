import {
  defineRendererGetterSetters,
  defineSnakeAlias,
} from "../utils/p5Modifiers";
import { RenderedElement } from "../core";
import { addFillStroke } from "../properties/color_props";

defineRendererGetterSetters(
  "textAlign",
  "textLeading",
  "textSize",
  "textStyle",
  "textWrap",
  "textFont"
);

defineSnakeAlias("textAscent", "textDescent");

class Text extends addFillStroke(RenderedElement) {
  static overloads = ["content, x, y, [x2], [y2]"];
}
customElements.define("p-text", Text);
