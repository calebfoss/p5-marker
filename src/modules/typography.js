import {
  defineRendererGetterSetters,
  defineSnakeAlias,
  PositionedFunction,
  registerElements,
} from "./base";

defineRendererGetterSetters(
  "textAlign",
  "textLeading",
  "textSize",
  "textStyle",
  "textWrap",
  "textFont"
);

defineSnakeAlias("textAscent", "textDescent");

registerElements(
  class Text extends PositionedFunction {
    constructor() {
      super(["content, x, y, [x2], [y2]"]);
    }
  }
);
