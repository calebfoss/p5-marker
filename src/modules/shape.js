import {
  defineProperties,
  defineRendererGetterSetters,
  registerElements,
} from "../utils/p5Modifiers";
import { P5Function, PositionedFunction } from "./core";

const transformVertexFn = (el) => (v) => {
  const originalPoint = new DOMPoint(v.x, v.y);
  const { x, y } = el.pInst._transform_point_matrix(
    originalPoint,
    el.transform_matrix
  );
  return el.pInst.createVector(x, y);
};

const vertexElement = class Vertex extends P5Function {
  constructor() {
    super(["x, y", "x, y, [z]", "x, y, [z], [u], [v]"]);
  }
};

const quadraticVertexElement = class QuadraticVertex extends vertexElement {
  constructor() {
    super(["cx, cy, x3, y3", "cx, cy, cz, x3, y3, z3"]);
  }
};

registerElements(
  class Arc extends PositionedFunction {
    constructor() {
      super(["x, y, w, h, start_angle, stop_angle, [mode], [detail], [a]"]);
    }
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x, y, w, h, start_angle, stop_angle } = this.state;
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
    collider = p5.prototype.collider_type.ellipse;
    get collision_args() {
      const originalPoint = new DOMPoint(this.state.x, this.state.y);
      const { x, y } = this.pInst._transform_point_matrix(
        originalPoint,
        this.transform_matrix
      );
      const { pixel_density } = this.pInst;
      const { w } = this.state * pixel_density;
      const { h } = this.state.h * pixel_density || w;
      return [x, y, w, h];
    }
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x, y, w, h } = this.state;
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
    get collision_args() {
      const originalPoint = new DOMPoint(this.state.x, this.state.y);
      const { x, y } = this.pInst._transform_point_matrix(
        originalPoint,
        this.transform_matrix
      );
      const d = this.state.d * this.pInst.pow(this.pInst.pixel_density, 2);
      return [x, y, d];
    }
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x, y, d } = this.state;
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
    get collision_args() {
      const originalStart = new DOMPoint(this.state.x1, this.state.y1);
      const { x: x1, y: y1 } = this.pInst._transform_point_matrix(
        originalStart,
        this.transform_matrix
      );
      const originalEnd = new DOMPoint(this.state.x2, this.state.y2);
      const { x: x2, y: y2 } = this.pInst._transform_point_matrix(
        originalEnd,
        this.transform_matrix
      );
      return [x1, y1, x2, y2];
    }
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x1, y1, x2, y2 } = this.state;
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
    collider = p5.prototype.collider_type.circle;
    get collision_args() {
      const originalPoint = new DOMPoint(this.state.x, this.state.y);
      const { x, y } = this.pInst._transform_point_matrix(
        originalPoint,
        this.transform_matrix
      );
      const { stroke_weight, pixel_density } = this.pInst;
      const d = stroke_weight * this.pInst.pow(pixel_density, 2);
      return [x, y, d];
    }
    get mouse_over() {
      const {
        x,
        y,
        stroke_weight,
        pixel_density,
        mouse_trans_pos_x,
        mouse_trans_pos_y,
      } = this.state;
      const d = stroke_weight * this.pInst.pow(pixel_density, 2);
      return this.pInst.collide_point_circle(
        mouse_trans_pos_x,
        mouse_trans_pos_y,
        x,
        y,
        d
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
    get collision_args() {
      return [this.vertices.map(transformVertexFn(this))];
    }
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      return this.pInst.collide_point_poly(
        mouse_trans_pos_x,
        mouse_trans_pos_y,
        this.vertices
      );
    }
    get vertices() {
      const { x1, y1, x2, y2, x3, y3, x4, y4 } = this.state;
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
    get collision_args() {
      const originalPoint = new DOMPoint(this.state.x, this.state.y);
      const { x, y } = this.pInst._transform_point_matrix(
        originalPoint,
        this.transform_matrix
      );
      const { pixel_density } = this.pInst;
      const w = this.state.w * this.pInst.pow(pixel_density, 2);
      const h = this.state.h * this.pInst.pow(pixel_density, 2);
      return [x, y, w, h];
    }
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x, y, w, h } = this.state;
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
    get collision_args() {
      const originalPoint = new DOMPoint(this.state.x, this.state.y);
      const { x, y } = this.pInst._transform_point_matrix(
        originalPoint,
        this.transform_matrix
      );
      const { pixel_density } = this.pInst;
      const { s } = this.state;
      const w = s * this.pInst.pow(pixel_density, 2);
      const h = w;
      return [x, y, w, h];
    }
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x, y, s } = this.state;
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
    get collision_args() {
      return [this.vertices.map(transformVertexFn(this))];
    }
    get mouse_over() {
      const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
      const { x1, y1, x2, y2, x3, y3 } = this.state;
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
      const { x1, y1, x2, y2, x3, y3 } = this.state;
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
    collider = p5.prototype.collider_type.poly;
    get collision_args() {
      return [this.vertices.map(transformVertexFn(this))];
    }
    fnName = "beginShape";
    endRender(assigned) {
      if (assigned.hasOwnProperty("mode")) this.pInst.endShape(assigned.mode);
      else this.pInst.endShape();
    }
    get vertices() {
      const arrayFromChildren = (el) => {
        const ca = Array.from(el.children);
        return ca.concat(ca.map(arrayFromChildren)).flat();
      };
      const childArray = arrayFromChildren(this);
      const vertexChildren = childArray.filter(
        (el) => el instanceof vertexElement && el.state
      );
      const vertices = vertexChildren.map((el) => {
        if (el instanceof quadraticVertexElement) {
          const { x3, y3 } = el.state;
          return this.pInst.createVector(x3, y3);
        }
        const { x, y } = el.state;
        return this.pInst.createVector(x, y);
      });
      return vertices.concat(vertices.slice(0));
    }
  },
  vertexElement,
  class CurveVertex extends vertexElement {
    constructor() {
      super(["x, y", "x, y, [z]"]);
    }
  },
  quadraticVertexElement,
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
