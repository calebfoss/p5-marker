import { defineProperties, PositionedFunction, registerElements } from "./base";

defineProperties({
  text_size: {
    get: function () {
      return this._renderer?._textSize;
    },
    set: function () {
      this.textSize(...arguments);
    },
  },
});

registerElements(
  class Text extends PositionedFunction {
    constructor() {
      super(["content, x, y, [x2], [y2]"]);
    }
  }
);
