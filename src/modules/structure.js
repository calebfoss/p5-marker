p5.prototype._defineProperties({
  animate: {
    get: function () {
      return this.isLooping();
    },
  },
  set: function (val) {
    if (val) this.loop();
    else this.noLoop();
  },
});
