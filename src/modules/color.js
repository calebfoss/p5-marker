import { defineSnakeAlias, defineProperties } from "../utils/p5Modifiers";
import { P5Function } from "./core";

defineSnakeAlias("lerpColor");

p5.prototype.NONE = "none";

export class ColorFunction extends P5Function {
  constructor(overloads, renderFunctionName) {
    overloads = [
      "v1, v2, v3, [alpha]",
      "value",
      "gray, [alpha]",
      "values",
      "c",
      ...overloads,
    ];
    super(overloads, renderFunctionName);
  }
}

//  TODO - Less hacky way to set color before initializing p5?
const transparent = p5.prototype.color.call(
  {
    _colorMode: "rgb",
    _colorMaxes: { rgb: [255, 255, 255, 255] },
  },
  0,
  0
);
p5.prototype.setErase = p5.prototype.erase;
p5.prototype._background = transparent;
defineProperties({
  canvas_background: {
    get: function () {
      return this._background;
    },
    set: function (val) {
      if (val === this.NONE) this._background = transparent;
      else if (val instanceof p5.Image) this._background = val;
      else this._background = this.color(val);
    },
  },
  color_mode: {
    get: function () {
      return this._colorMode;
    },
    set: function (val) {
      this.colorMode(val);
    },
  },
  fill_color: {
    get: function () {
      if (!this.drawingContext) return "";
      return this.color(this.drawingContext.fillStyle);
    },
    set: function (val) {
      if (val === this.NONE) this.noFill();
      else this.fill(val);
    },
  },
  stroke_color: {
    get: function () {
      if (!this.drawingContext) return "";
      return this.color(this.drawingContext.strokeStyle);
    },
    set: function (val) {
      if (val === this.NONE) this.noStroke();
      else this.stroke(val);
    },
  },
  erase: {
    get: function () {
      return this._isErasing;
    },
    set: function (val) {
      if (val === true) this.setErase();
      else if (Array.isArray(val)) this.setErase(...val);
      else this.setErase(val);
    },
  },
});

class Clear extends P5Function {
  constructor() {
    super(["", "r, g, b, a"]);
  }
}
customElements.define("p-clear", Clear);

class PaintBucket extends ColorFunction {
  constructor() {
    super(["colorstring, [a]", "gray, [a]", "v1, v2, v3, [a]"], "background");
  }
}
customElements.define("p-paint-bucket", PaintBucket);

p5.prototype.registerMethod("pre", function () {
  this.background(this.canvas_background);
});
