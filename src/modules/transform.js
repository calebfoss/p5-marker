import { defineProperties, wrapMethod } from "../utils/p5Modifiers";

const defaultShear = p5.prototype.createVector();
const wrap = function (renderer) {
  function wrappedRenderer() {
    renderer.apply(this, arguments);
    this._shearStack = [defaultShear.copy()];
  }
  wrappedRenderer.prototype = Object.create(renderer.prototype);
  return wrappedRenderer;
};
p5.Renderer = wrap(p5.Renderer);

wrapMethod(
  "push",
  (base) =>
    function () {
      this._renderer._shearStack.push(defaultShear.copy());
      base.call(this);
    }
);

wrapMethod(
  "pop",
  (base) =>
    function () {
      this._renderer._shearStack.pop();
      base.call(this);
    }
);

p5.prototype.RESET = "reset";

defineProperties({
  shear: {
    get: function () {
      return this._renderer?._shearStack.slice(-1)[0];
    },
    set: function (val) {
      if (Array.isArray(val))
        this._renderer._shearStack[this._renderer._shearStack.length - 1].set(
          ...val
        );
      else
        this._renderer._shearStack[this._renderer._shearStack.length - 1].set(
          val
        );
      this.shearX(this.shear.x);
      this.shearY(this.shear.y);
    },
  },
});
