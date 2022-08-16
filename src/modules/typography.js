import {
  defineProperties,
  defineRendererGetterSetters,
  PositionedFunction,
  registerElements,
} from "./base";

defineRendererGetterSetters(
  "textAlign",
  "textLeading",
  "textSize",
  "textStyle"
);

registerElements(
  class Text extends PositionedFunction {
    constructor() {
      super(["content, x, y, [x2], [y2]"]);
    }
  }
);
