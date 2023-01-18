import { defineProperties, defineSnakeAlias } from "../utils/p5Modifiers";

defineSnakeAlias("createCanvas", "createGraphics");

defineProperties({
  set_webgl_attr: {
    set: function () {
      this.setAttributes(...arguments);
    },
  },
});
