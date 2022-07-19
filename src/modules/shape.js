import { PositionedFunction } from "./base.js";

export default [
  class Arc extends PositionedFunction {
    constructor() {
      const overloads = [
        "x, y, w, h, start, stop, [mode], [detail], image, [a]",
      ];
      super(overloads);
    }
  },
  class Ellipse extends PositionedFunction {
    constructor() {
      const overloads = ["x, y, w, [h]", "x, y, w, h, [detail]"];
      super(overloads);
    }
  },
  class Circle extends PositionedFunction {
    constructor() {
      const overloads = ["x, y, d"];
      super(overloads);
      console.log(this);
    }
  },
  class Line extends PositionedFunction {
    constructor() {
      const overloads = ["x1, y1, x2, y2", "x1, y1, z1, x2, y2, z2"];
      super(overloads);
    }
  },
  class Point extends PositionedFunction {
    constructor() {
      const overloads = ["x, y, [z]", "coordinate_vector"];
      super(overloads);
    }
  },
  class Quad extends PositionedFunction {
    constructor() {
      const overloads = [
        "x1, y1, x2, y2, x3, y3, x4, y4, [detailX], [detailY]",
        "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, [detailX], [detailY]",
      ];
      super(overloads);
    }
  },
  class Rect extends PositionedFunction {
    constructor() {
      const overloads = [
        "x, y, w, [h], [tl], [tr], [br], [bl]",
        "x, y, w, h, [detailX], [detailY]",
      ];
      super(overloads);
    }
  },
  class Square extends PositionedFunction {
    constructor() {
      const overloads = ["x, y, s, [tl], [tr], [br], [bl]"];
      super(overloads);
    }
  },
  class Triangle extends PositionedFunction {
    constructor() {
      const overloads = ["x1, y1, x2, y2, x3, y3"];
      super(overloads);
    }
  },
];
