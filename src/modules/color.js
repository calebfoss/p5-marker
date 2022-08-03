import { P5Function } from "./base.js";

p5.prototype.NONE = "none";

class ColorFunction extends P5Function {
  constructor(overloads) {
    overloads = [
      "v1, v2, v3, [alpha]",
      "value",
      "gray, [alpha]",
      "values",
      "c",
      ...overloads,
    ];
    super(overloads);
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
p5.prototype._backgroundColor = transparent;
p5.prototype._defineProperties({
  background_color: {
    get: function () {
      return this._backgroundColor;
    },
    set: function (val) {
      if (val === this.NONE) this._backgroundColor = transparent;
      else this._backgroundColor = this.color(val);
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
      if (typeof val === "array") this.setErase(...val);
      this.setErase(val);
    },
  },
});

p5.prototype._registerElements(
  class Alpha extends P5Function {
    constructor() {
      super(["c"]);
    }
    returnsVal = true;
  },
  class Blue extends P5Function {
    constructor() {
      super(["c"]);
    }
    returnsVal = true;
  },
  class Brightness extends P5Function {
    constructor() {
      super(["c"]);
    }
    returnsVal = true;
  },
  class Color extends ColorFunction {
    constructor() {
      super([]);
    }
    returnsVal = true;
  },
  class Green extends P5Function {
    constructor() {
      super([]);
    }
    returnsVal = true;
  },
  class Hue extends P5Function {
    constructor() {
      super(["c"]);
    }
    returnsVal = true;
  },
  class LerpColor extends P5Function {
    constructor() {
      super(["c1, c2, amt"]);
    }
    returnsVal = true;
  },
  class Lightness extends P5Function {
    constructor() {
      super(["c"]);
    }
    returnsVal = true;
  },
  class Red extends P5Function {
    constructor() {
      super(["c"]);
    }
    returnsVal = true;
  },
  class Saturation extends P5Function {
    constructor() {
      super(["c"]);
    }
    returnsVal = true;
  },
  class Clear extends P5Function {
    constructor() {
      super(["", "r, g, b, a"]);
    }
  },
  class PaintBucket extends ColorFunction {
    constructor() {
      super(["colorstring, [a]", "gray, [a]", "v1, v2, v3, [a]"]);
    }
    fnName = "background";
  }
);

p5.prototype.registerMethod("pre", function () {
  this.background(this.background_color);
});
