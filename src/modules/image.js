import {
  defineProperties,
  defineRendererGetterSetters,
  registerElements,
} from "../utils/p5Modifiers";
import { PositionedFunction } from "./core";

(() => {
  class Image extends PositionedFunction {
    constructor() {
      super([
        "img, x, y, [w], [h]",
        "img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight]",
      ]);
    }
  }
  registerElements(Image);
})();

defineRendererGetterSetters("imageMode");

defineProperties({
  canvas_pixels: {
    get: function () {
      this.loadPixels();
      return this.pixels;
    },
    set: function (px) {
      this.pixels = px;
      this.updatePixels();
    },
  },
  image_tint: {
    get: function () {
      return this._renderer?._tint;
    },
    set: function (val) {
      if (val === p5.prototype.NONE) this.noTint();
      else this.tint(...arguments);
    },
  },
});
