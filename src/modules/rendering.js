p5.prototype._defineSnakeAlias("createCanvas", "createGraphics");

p5.prototype._defineProperties({
  blend_mode: {
    get: function () {
      if (this._renderer?.isP3D) return this.curBlendMode;
      return this.drawingContext?.globalCompositeOperation;
    },
    set: function (val) {
      this.blendMode(val);
    },
  },
  drawing_context: {
    get: function () {
      return this.drawingContext;
    },
  },
  set_drawing_context_prop: {
    set: function () {
      const [arg] = arguments;
      if (Array.isArray(arg)) {
        const [prop, val] = arg;
        this.set_obj_prop = [this.drawingContext, prop, val];
      } else {
        this.set_obj_prop = [this.drawingContext, arg];
      }
    },
  },
  set_webgl_attr: {
    set: function (val) {
      this.setAttributes(val);
    },
  },
});
