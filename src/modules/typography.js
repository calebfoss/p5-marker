import {
  defineRendererGetterSetters,
  defineSnakeAlias,
} from "../utils/p5Modifiers";

defineRendererGetterSetters("textStyle", "textWrap", "textFont");

defineSnakeAlias("textAscent", "textDescent");
