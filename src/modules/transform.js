import { defineProperties, wrapMethod } from "./base";

const defaultAnchor = p5.prototype.createVector();
const defaultAngle = p5.prototype.createVector();
const defaultShear = p5.prototype.createVector(1, 1);
const defaultScale = p5.prototype.createVector(1, 1, 1);
const wrap = function (renderer) {
  function wrappedRenderer() {
    renderer.apply(this, arguments);
    this._anchorStack = [defaultAnchor.copy()];
    this._angleStack = [defaultAngle.copy()];
    this._scaleStack = [defaultScale.copy()];
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
      this._renderer._anchorStack.push(defaultAnchor.copy());
      this._renderer._angleStack.push(defaultAngle.copy());
      this._renderer._scaleStack.push(defaultScale.copy());
      this._renderer._shearStack.push(defaultShear.copy());
      base.call(this);
    }
);

wrapMethod(
  "pop",
  (base) =>
    function () {
      this._renderer._anchorStack.pop();
      this._renderer._angleStack.pop();
      this._renderer._scaleStack.pop();
      this._renderer._shearStack.pop();
      base.call(this);
    }
);

p5.prototype.RESET = "reset";

defineProperties({
  anchor: {
    get: function () {
      return this._renderer?._anchorStack[
        this._renderer._anchorStack.length - 1
      ];
    },
    set: function (val) {
      const len = this._renderer._anchorStack.length;
      if (Array.isArray(val))
        this._renderer._anchorStack[this._renderer._anchorStack.length - 1].set(
          ...val
        );
      else
        this._renderer._anchorStack[this._renderer._anchorStack.length - 1].set(
          val
        );
      this.translate(this.anchor);
    },
  },
  angle: {
    get: function () {
      return this._renderer?._angleStack.slice(-1)[0].z;
    },
    set: function (val) {
      this._renderer._angleStack[this._renderer._anchorStack.length - 1].z =
        val;
      this.rotate(this.angle);
    },
  },
  angle_x: {
    get: function () {
      return this._renderer?._angleStack.slice(-1)[0].x;
    },
    set: function (val) {
      this._renderer._angleStack[this._renderer._angleStack.length - 1].x = val;
      this.rotateX(this.angle_x);
    },
  },
  angle_y: {
    get: function () {
      return this._renderer?._angleStack.slice(-1)[0].y;
    },
    set: function (val) {
      this._renderer._angleStack[this._renderer._angleStack.length - 1].y = val;
      this.rotateY(this.angle_y);
    },
  },
  angle_z: {
    get: function () {
      return this._renderer?._angleStack.slice(-1)[0].z;
    },
    set: function (val) {
      this._renderer._angleStack[this._renderer._angleStack.length - 1].z = val;
      this.rotateZ(this.angle_z);
    },
  },
  angle_vector: {
    get: function () {
      return this._renderer?._angleStack.slice(-1)[0];
    },
    set: function (val) {
      this._renderer._angleStack[this._renderer._angleStack.length - 1] = val;
    },
  },
  scale_factor: {
    get: function () {
      return this._renderer?._scaleStack.slice(-1)[0];
    },
    set: function (val) {
      if (Array.isArray(val))
        this._renderer._scaleStack[this._renderer._scaleStack.length - 1].set(
          ...val
        );
      else
        this._renderer._scaleStack[this._renderer._scaleStack.length - 1].set(
          val
        );
      this.scale(this.scale_factor);
    },
  },
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
  transform_matrix: {
    get: function () {
      return this.drawingContext?.getTransform();
    },
    set: function (val) {
      if (val === this.RESET) this.resetMatrix();
      else this.applyMatrix(val);
    },
  },
});

p5.prototype.registerMethod("pre", function () {
  this._renderer._anchorStack = [this.anchor];
  this.translate(this.anchor);
  this.angle_vector = this.angle_vector;
  this._renderer._angleStack = [this.angle_vector.copy()];
  this.scale_factor = this.scale_factor;
  this._renderer._scaleStack = [this.scale_factor.copy()];
});
