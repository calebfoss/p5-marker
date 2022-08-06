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
});
