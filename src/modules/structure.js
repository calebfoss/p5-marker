import { defineProperties } from "../utils/p5Modifiers";

defineProperties({
  animate: {
    get: function () {
      return this.isLooping();
    },
    set: function (val) {
      if (val) this.loop();
      else this.noLoop();
    },
  },
  remove_canvas: {
    get: function () {
      return false;
    },
    set: function () {
      this.remove();
    },
  },
});
