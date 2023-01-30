import {
  defineRendererGetterSetters,
  defineSnakeAlias,
} from "../utils/p5Modifiers";

defineRendererGetterSetters(
  "textAlign",
  "textLeading",
  "textSize",
  "textStyle",
  "textWrap",
  "textFont"
);

defineSnakeAlias("textAscent", "textDescent");
