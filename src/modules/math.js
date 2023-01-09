import { defineProperties, defineSnakeAlias } from "../utils/p5Modifiers";

defineSnakeAlias("createVector");

defineProperties({
  angle_mode: {
    get: function () {
      return this._angleMode;
    },
    set: function (mode) {
      this._setProperty("_angleMode", mode);
    },
  },
  noise_detail: {
    set: function () {
      this.noiseDetail(...arguments);
    },
  },
  noise_seed: {
    set: function () {
      this.noiseSeed(...arguments);
    },
  },
  random_seed: {
    get: function () {
      return this._lcg_random_state;
    },
    set: function () {
      this.randomSeed(...arguments);
    },
  },
});
