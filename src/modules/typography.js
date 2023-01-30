import {
  defineRendererGetterSetters,
  defineSnakeAlias,
} from "../utils/p5Modifiers";

defineRendererGetterSetters("textFont");

defineSnakeAlias("textAscent", "textDescent");
