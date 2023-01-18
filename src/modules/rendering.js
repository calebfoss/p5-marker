import { defineProperties, defineSnakeAlias } from "../utils/p5Modifiers";

defineSnakeAlias("createCanvas", "createGraphics");

defineProperties({
  blend_mode: {
    get: function () {
      if (this._renderer?.isP3D) return this.curBlendMode;
      return this.drawingContext?.globalCompositeOperation;
    },
    set: function (val) {
      this.blendMode(val);
    },
  },
  set_webgl_attr: {
    set: function () {
      this.setAttributes(...arguments);
    },
  },
});
