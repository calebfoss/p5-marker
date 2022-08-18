import {
  defineProperties,
  defineRendererGetterSetters,
  registerElements,
} from "../utils/p5Modifiers";
import { P5Function, PositionedFunction } from "./core";

registerElements(
  class Arc extends PositionedFunction {
    constructor() {
      super(["x, y, w, h, start, stop, [mode], [detail], image, [a]"]);
    }
  },
  class Ellipse extends PositionedFunction {
    constructor() {
      super(["x, y, w, [h]", "x, y, w, h, [detail]"]);
    }
  },
  class Circle extends PositionedFunction {
    constructor() {
      super(["x, y, d"]);
    }
  },
  class Line extends PositionedFunction {
    constructor() {
      super(["x1, y1, x2, y2", "x1, y1, z1, x2, y2, z2"]);
    }
  },
  class Point extends PositionedFunction {
    constructor() {
      super(["x, y, [z]", "coordinate_vector"]);
    }
  },
  class Quad extends PositionedFunction {
    constructor() {
      super([
        "x1, y1, x2, y2, x3, y3, x4, y4, [detail_x], [detail_y]",
        "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, [detail_x], [detail_y]",
      ]);
    }
  },
  class Rect extends PositionedFunction {
    constructor() {
      super([
        "x, y, w, [h], [tl], [tr], [br], [bl]",
        "x, y, w, h, [detail_x], [detail_y]",
      ]);
    }
  },
  class Square extends PositionedFunction {
    constructor() {
      super(["x, y, s, [tl], [tr], [br], [bl]"]);
    }
  },
  class Triangle extends PositionedFunction {
    constructor() {
      const overloads = ["x1, y1, x2, y2, x3, y3"];
      super(overloads);
    }
  },
  class Bezier extends PositionedFunction {
    constructor() {
      super([
        "x1, y1, x2, y2, x3, y3, x4, y4",
        "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4",
      ]);
    }
  },
  class Curve extends PositionedFunction {
    constructor() {
      super([
        "x1, y1, x2, y2, x3, y3, x4, y4",
        "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4",
      ]);
    }
  },
  class Contour extends PositionedFunction {
    constructor() {
      super([""]);
    }
    fnName = "beginContour";
    endRender(p) {
      p.endContour();
    }
  },
  class Shape extends PositionedFunction {
    constructor() {
      super(["[kind]"]);
    }
    fnName = "beginShape";
    endRender(p, assigned) {
      if (assigned.hasOwnProperty("mode")) p.endShape(assigned.mode);
      else p.endShape();
    }
  },
  class Vertex extends P5Function {
    constructor() {
      super(["x, y", "x, y, [z]", "x, y, [z], [u], [v]"]);
    }
  },
  class CurveVertex extends P5Function {
    constructor() {
      super(["x, y", "x, y, [z]"]);
    }
  },
  class QuadraticVertex extends P5Function {
    constructor() {
      super(["cx, cy, x3, y3", "cx, cy, cz, x3, y3, z3"]);
    }
  },
  class Normal extends P5Function {
    constructor() {
      super(["vector", "x, y, z"]);
    }
  },
  class Plane extends P5Function {
    constructor() {
      super("[w], [h], [detail_x], [detail_y]");
    }
  },
  class Box extends P5Function {
    constructor() {
      super(["[w], [h], [depth], [detail_x], [detail_y]"]);
    }
  },
  class Sphere extends P5Function {
    constructor() {
      super(["[radius], [detail_x], [detail_y]"]);
    }
  },
  class Cylinder extends P5Function {
    constructor() {
      super(["[radius], [h], [detail_x], [detail_y], [bottomCap], [topCap]"]);
    }
  },
  class Cone extends P5Function {
    constructor() {
      super(["[radius], [h], [detail_x], [detail_y], [cap]"]);
    }
  },
  class Ellipsoid extends P5Function {
    constructor() {
      super(["[radius_x], [radius_y], [radius_z], [detail_x], [detail_y]"]);
    }
  },
  class Torus extends P5Function {
    constructor() {
      super(["[radius], [tubeRadius], [detailX], [detailY]"]);
    }
  },
  //  TODO - test when preload implemented
  class LoadModel extends P5Function {
    constructor() {
      super([
        "path, normalize, [successCallback], [failureCallback], [fileType]",
        "path, [successCallback], [failureCallback], [fileType]",
      ]);
    }
  },
  class Model extends P5Function {
    constructor() {
      super(["model"]);
    }
  }
);
const pointTangentOverload = (fn) =>
  function () {
    const args = arguments;
    if (args.length !== 9) return fn(...args);
    return this.createVector(
      fn(args[0], args[2], args[4], args[6], args[8]),
      fn(args[1], args[3], args[5], args[7], args[8])
    );
  };
p5.prototype.bezierPoint = pointTangentOverload(p5.prototype.bezierPoint);
p5.prototype.bezierTangent = pointTangentOverload(p5.prototype.bezierTangent);
p5.prototype.curvePoint = pointTangentOverload(p5.prototype.curvePoint);
p5.prototype.curveTangent = pointTangentOverload(p5.prototype.curveTangent);
p5.prototype.yesSmooth = p5.prototype.smooth;

defineRendererGetterSetters("ellipseMode", "rectMode", "curveTightness");

defineProperties({
  smooth: {
    get: function () {
      if (this._renderer?.isP3D)
        return this._renderer._pInst._glAttributes?.antialias;
      return this.drawingContext?.imageSmoothingEnabled;
    },
    set: function (val) {
      if (val) this.yesSmooth();
      else this.noSmooth();
    },
  },
  stroke_cap: {
    get: function () {
      if (this._renderer?.isP3D) return this._renderer.strokeCap();
      return this.drawingContext?.lineCap;
    },
    set: function (val) {
      this.strokeCap(val);
    },
  },
  stroke_join: {
    get: function () {
      if (this._renderer?.isP3D) return this._renderer.strokeJoin();
      return this.drawingContext?.lineJoin;
    },
    set: function (val) {
      this.strokeJoin(val);
    },
  },
  stroke_weight: {
    get: function () {
      if (this._renderer?.isP3D) return this._renderer.curStrokeWeight;
      return this.drawingContext?.lineWidth;
    },
    set: function (val) {
      this.strokeWeight(val);
    },
  },
  bezier_detail: {
    get: function () {
      return this._renderer?._pInst._bezierDetail;
    },
    set: function (val) {
      this.bezierDetail(val);
    },
  },
  curve_detail: {
    get: function () {
      return this._renderer?._pInst._curveDetail;
    },
    set: function (val) {
      this.curveDetail(val);
    },
  },
});
