import {
  defineRendererGetterSetters,
  defineSnakeAlias,
} from "../utils/p5Modifiers";

defineRendererGetterSetters("textSize", "textStyle", "textWrap", "textFont");

defineSnakeAlias("textAscent", "textDescent");
