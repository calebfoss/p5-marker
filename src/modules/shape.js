import {
  defineProperties,
  defineRendererGetterSetters,
  registerElements,
} from "../utils/p5Modifiers";
import { P5Function, PositionedFunction } from "./core";

registerElements(
  class Arc extends PositionedFunction {
    constructor() {
      super(["x, y, w, h, start_angle, stop_angle, [mode], [detail], [a]"]);
    }
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x, y, w, h, start_angle, stop_angle } = this.proxy;
      console.assert(
        w === h,
        "mouse_over currently only works for arc's with equal width and height."
      );
      const arcRadius = w / 2;
      const arcAngle = stop_angle - start_angle;
      const arcRotation = start_angle + arcAngle / 2;

      return this.pInst.collide_point_arc(
        mouse_trans_pos_x,
        mouse_trans_pos_y,
        x,
        y,
        arcRadius,
        arcRotation,
        arcAngle
      );
    }
  },
  class Ellipse extends PositionedFunction {
    constructor() {
      super(["x, y, w, [h]", "x, y, w, h, [detail]"]);
    }
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x, y, w, h } = this.proxy;
      return this.pInst.collide_point_ellipse(
        mouse_trans_pos_x,
        mouse_trans_pos_y,
        x,
        y,
        w,
        h
      );
    }
  },
  class Circle extends PositionedFunction {
    constructor() {
      super(["x, y, d"]);
    }
    collider = p5.prototype.collider_type.circle;
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x, y, d } = this.proxy;
      return this.pInst.collide_point_circle(
        mouse_trans_pos_x,
        mouse_trans_pos_y,
        x,
        y,
        d
      );
    }
  },
  class Line extends PositionedFunction {
    constructor() {
      super(["x1, y1, x2, y2", "x1, y1, z1, x2, y2, z2"]);
    }
    collider = p5.prototype.collider_type.line;
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x1, y1, x2, y2 } = this.proxy;
      return this.pInst.collide_point_line(
        mouse_trans_pos_x,
        mouse_trans_pos_y,
        x1,
        y1,
        x2,
        y2
      );
    }
  },
  class Point extends PositionedFunction {
    constructor() {
      super(["x, y, [z]", "coordinate_vector"]);
    }
    collider = p5.prototype.collider_type.line;
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x, y, stroke_weight } = this.proxy;
      return this.pInst.collide_point_circle(
        mouse_trans_pos_x,
        mouse_trans_pos_y,
        x,
        y,
        stroke_weight
      );
    }
  },
  class Quad extends PositionedFunction {
    constructor() {
      super([
        "x1, y1, x2, y2, x3, y3, x4, y4, [detail_x], [detail_y]",
        "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, [detail_x], [detail_y]",
      ]);
    }
    collider = p5.prototype.collider_type.poly;
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      return this.pInst.collide_point_poly(
        mouse_trans_pos_x,
        mouse_trans_pos_y,
        this.vertices
      );
    }
    get vertices() {
      const { x1, y1, x2, y2, x3, y3, x4, y4 } = this.proxy;
      return [
        this.pInst.createVector(x1, y1),
        this.pInst.createVector(x2, y2),
        this.pInst.createVector(x3, y3),
        this.pInst.createVector(x4, y4),
      ];
    }
  },
  class Rect extends PositionedFunction {
    constructor() {
      super([
        "x, y, w, [h], [tl], [tr], [br], [bl]",
        "x, y, w, h, [detail_x], [detail_y]",
      ]);
    }
    collider = p5.prototype.collider_type.rect;
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x, y, w, h } = this.proxy;
      return this.pInst.collide_point_rect(
        mouse_trans_pos_x,
        mouse_trans_pos_y,
        x,
        y,
        w,
        h
      );
    }
  },
  class Square extends PositionedFunction {
    constructor() {
      super(["x, y, s, [tl], [tr], [br], [bl]"]);
    }
    collider = p5.prototype.collider_type.rect;
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x, y, s } = this.proxy;
      return this.pInst.collide_point_rect(
        mouse_trans_pos_x,
        mouse_trans_pos_y,
        x,
        y,
        s,
        s
      );
    }
  },
  class Triangle extends PositionedFunction {
    constructor() {
      const overloads = ["x1, y1, x2, y2, x3, y3"];
      super(overloads);
    }
    collider = p5.prototype.collider_type.poly;
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x1, y1, x2, y2, x3, y3 } = this.proxy;
      return this.pInst.collide_point_triangle(
        mouse_trans_pos_x,
        mouse_trans_pos_y,
        x1,
        y1,
        x2,
        y2,
        x3,
        y3
      );
    }
    get vertices() {
      const { x1, y1, x2, y2, x3, y3 } = this.proxy;
      return [
        this.pInst.createVector(x1, y1),
        this.pInst.createVector(x2, y2),
        this.pInst.createVector(x3, y3),
      ];
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
    endRender() {
      this.pInst.endContour();
    }
  },
  class Shape extends PositionedFunction {
    constructor() {
      super(["[kind]"]);
    }
    fnName = "beginShape";
    endRender(assigned) {
      if (assigned.hasOwnProperty("mode")) this.pInst.endShape(assigned.mode);
      else this.pInst.endShape();
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
