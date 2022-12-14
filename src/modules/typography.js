import {
  defineRendererGetterSetters,
  defineSnakeAlias,
  registerElements,
} from "../utils/p5Modifiers";
import { PositionedFunction } from "./core";

defineRendererGetterSetters(
  "textAlign",
  "textLeading",
  "textSize",
  "textStyle",
  "textWrap",
  "textFont"
);

defineSnakeAlias("textAscent", "textDescent");

(() => {
  class Text extends PositionedFunction {
    constructor() {
      super(["content, x, y, [x2], [y2]"]);
    }
  }
  registerElements(Text);
})();
