import { defineProperties } from "./base";

defineProperties({
  angle_mode: {
    get: function () {
      return this._angleMode;
    },
    set: function (mode) {
      this._setProperty("_angleMode", mode);
    },
  },
});
