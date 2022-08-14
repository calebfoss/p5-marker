import { P5Function, PositionedFunction } from "./base";

p5.prototype._defineProperties({
  text_size: {
    get: function () {
      return this._renderer?._textSize;
    },
    set: function () {
      this.textSize(...arguments);
    },
  },
});

p5.prototype._registerElements(
  class Text extends PositionedFunction {
    constructor() {
      super(["content, x, y, [x2], [y2]"]);
    }
  }
);
