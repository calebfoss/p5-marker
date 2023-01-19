import { RenderedElement } from "../core";
import { addStroke, addFillStroke } from "../properties/color_props";
import {
  addXY,
  addXYZ,
  addXYZ12,
  addY3,
  addXY123,
  addWidthHeight,
  addRectMode,
} from "../properties/shape_props";

const transformVertexFn = (el) => (v) => {
  const originalPoint = new DOMPoint(v.x, v.y);
  const { x, y } = el.pInst._transform_point_matrix(
    originalPoint,
    el.transform_matrix
  );
  return el.pInst.createVector(x, y);
};

const addXYZ1234 = (baseClass) =>
  class extends addXYZ12(addY3(baseClass)) {
    #z3;
    #z4;
    #y4;
    /**
     * The fourth y-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get y4() {
      return this.#y4;
    }
    set y4(val) {
      if (!isNaN(val)) this.#y4 = val;
      else
        console.error(
          `${this.tagName}'s y4 is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The first x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get z3() {
      return this.#z3;
    }
    set z3(val) {
      if (!isNaN(val)) this.#z3 = val;
      else
        console.error(
          `${this.tagName}'s z3 is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The fourth z-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get z4() {
      return this.#z4;
    }
    set z4(val) {
      if (!isNaN(val)) this.#z4 = val;
      else
        console.error(
          `${this.tagName}'s z4 is being set to ${val}, but it may only be set to a number.`
        );
    }
  };
/**
 * Draws an arc to the screen. If called with only x, y, w, h, start and stop
 * the arc will be drawn and filled as an open pie segment. If a mode
 * parameter is provided, the arc will be filled like an open semi-circle
 * (OPEN), a closed semi-circle (CHORD), or as a closed pie segment (PIE).
 * The origin may be changed with the ellipseMode() function.
 *
 * The arc is always drawn clockwise from wherever start falls to wherever
 * stop falls on the ellipse. Adding or subtracting TWO_PI to either angle
 * does not change where they fall. If both start and stop fall at the same
 * place, a full ellipse will be drawn. Be aware that the y-axis increases in
 * the downward direction, therefore angles are measured clockwise from the
 * positive x-direction ("3 o'clock").
 * @element arc
 */
class Arc extends addXY(addWidthHeight(addFillStroke(RenderedElement))) {
  constructor() {
    super([
      "x, y, width, height, start_angle, stop_angle, [mode], [detail], [a]",
    ]);
  }
  get mouse_over() {
    const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
    const { x, y, width, height, start_angle, stop_angle } = this;
    console.assert(
      width === height,
      "mouse_over currently only works for arc's with equal width and height."
    );
    const arcRadius = width / 2;
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
}
customElements.define("p-arc", Arc);
/**
 * Draws an ellipse (oval) to the screen. If no height is specified, the
 * value of width is used for both the width and height. If a
 * negative height or width is specified, the absolute value is taken.
 *
 * An ellipse with equal width and height is a circle. The origin may be
 * changed with the ellipseMode() function.
 * @element ellipse
 */
class Ellipse extends addXY(addWidthHeight(addFillStroke(RenderedElement))) {
  constructor() {
    super(["x, y, width, [height]", "x, y, width, height, [detail]"]);
  }
  collider = p5.prototype.collider_type.ellipse;
  get collision_args() {
    const originalPoint = new DOMPoint(
      this.this_element.x,
      this.this_element.y
    );
    const { x, y } = this.pInst._transform_point_matrix(
      originalPoint,
      this.transform_matrix
    );
    const { pixel_density } = this.pInst;
    const { w } = this.width * pixel_density;
    const { h } = this.height * pixel_density || w;
    return [x, y, w, h];
  }
  get mouse_over() {
    const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
    const { x, y, width, height } = this.this_element;
    return this.pInst.collide_point_ellipse(
      mouse_trans_pos_x,
      mouse_trans_pos_y,
      x,
      y,
      width,
      height
    );
  }
}
customElements.define("p-ellipse", Ellipse);
/**
 * Draws a circle to the screen. A circle is a simple closed shape. It is the
 * set of all points in a plane that are at a given distance from a given
 * point, the center.
 * @element circle
 */
class Circle extends addXY(addFillStroke(RenderedElement)) {
  constructor() {
    super(["x, y, d"]);
  }
  collider = p5.prototype.collider_type.circle;
  get collision_args() {
    const originalPoint = new DOMPoint(this.x, this.y);
    const { x, y } = this.pInst._transform_point_matrix(
      originalPoint,
      this.transform_matrix
    );
    const d = this.this_element.d * this.pInst.pow(this.pInst.pixel_density, 2);
    return [x, y, d];
  }
  get mouse_over() {
    const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
    const { x, y, d } = this.this_element;
    return this.pInst.collide_point_circle(
      mouse_trans_pos_x,
      mouse_trans_pos_y,
      x,
      y,
      d
    );
  }
}
customElements.define("p-circle", Circle);
/**
 * Draws a line (a direct path between two points) to the screen. This width
 * can be modified by using the stroke_weight attribute. A line cannot be
 * filled, therefore the fill_color attribute will not affect the color of a
 * line. So to color a line, use the stroke attribute.
 * @element line
 */
class Line extends addXYZ12(addStroke(RenderedElement)) {
  constructor() {
    super(["x1, y1, x2, y2", "x1, y1, z1, x2, y2, z2"]);
  }
  collider = p5.prototype.collider_type.line;
  get collision_args() {
    const originalStart = new DOMPoint(
      this.this_element.x1,
      this.this_element.y1
    );
    const { x: x1, y: y1 } = this.pInst._transform_point_matrix(
      originalStart,
      this.transform_matrix
    );
    const originalEnd = new DOMPoint(
      this.this_element.x2,
      this.this_element.y2
    );
    const { x: x2, y: y2 } = this.pInst._transform_point_matrix(
      originalEnd,
      this.transform_matrix
    );
    return [x1, y1, x2, y2];
  }
  get mouse_over() {
    const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
    const { x1, y1, x2, y2 } = this.this_element;
    return this.pInst.collide_point_line(
      mouse_trans_pos_x,
      mouse_trans_pos_y,
      x1,
      y1,
      x2,
      y2
    );
  }
}
customElements.define("p-line", Line);
/**
 * Draws a point, a coordinate in space at the dimension of one pixel. The
 * color of the point is changed with the stroke attribute. The size of
 * the point can be changed with the stroke_weight attribute.
 * @element point
 */
class Point extends addXYZ(addStroke(RenderedElement)) {
  constructor() {
    super(["x, y, [z]"]);
  }
  collider = p5.prototype.collider_type.circle;
  get collision_args() {
    const originalPoint = new DOMPoint(this.x, this.y);
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
    } = this;
    const d = stroke_weight * this.pInst.pow(pixel_density, 2);
    return this.pInst.collide_point_circle(
      mouse_trans_pos_x,
      mouse_trans_pos_y,
      x,
      y,
      d
    );
  }
}
customElements.define("p-point", Point);
/**
 * Draws a quad on the canvas. A quad is a quadrilateral, a four-sided
 * polygon. It is similar to a rectangle, but the angles between its edges
 * are not constrained to ninety degrees. The x1 and y1 attributes set the
 * first vertex and the subsequent pairs should proceed clockwise or
 * counter-clockwise around the defined shape. z attributes only work when
 * quad() is used in WEBGL mode.
 * @element quad
 */
class Quad extends addXYZ1234(addFillStroke(RenderedElement)) {
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
    const { x1, y1, x2, y2, x3, y3, x4, y4 } = this;
    return [
      this.pInst.createVector(x1, y1),
      this.pInst.createVector(x2, y2),
      this.pInst.createVector(x3, y3),
      this.pInst.createVector(x4, y4),
    ];
  }
}
customElements.define("p-quad", Quad);
/**
 * Draws a rectangle on the canvas. A rectangle is a four-sided closed shape
 * with every angle at ninety degrees. By default, the x and y attributes
 * set the location of the upper-left corner, w sets the width, and h sets
 * the height. The way these attributes are interpreted may be changed with
 * the rect_mode attribute.
 *
 * The tl, tr, br and bl attributes, if specified, determine
 * corner radius for the top-left, top-right, lower-right and lower-left
 * corners, respectively. An omitted corner radius parameter is set to the
 * value of the previously specified radius value in the attribute list.
 * @element rect
 */
class Rect extends addXY(
  addWidthHeight(addRectMode(addFillStroke(RenderedElement)))
) {
  constructor() {
    super([
      "x, y, width, [h], [tl], [tr], [br], [bl]",
      "x, y, width, height, [detail_x], [detail_y]",
    ]);
  }
  collider = p5.prototype.collider_type.rect;
  get collision_args() {
    const originalPoint = new DOMPoint(this.x, this.y);
    const { x, y } = this.pInst._transform_point_matrix(
      originalPoint,
      this.transform_matrix
    );
    const { pixel_density } = this.pInst;
    const w = this.width * this.pInst.pow(pixel_density, 2);
    const h = this.height * this.pInst.pow(pixel_density, 2);
    return [x, y, w, h];
  }
  get mouse_over() {
    const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
    const { x, y, width, height } = this;
    return this.pInst.collide_point_rect(
      mouse_trans_pos_x,
      mouse_trans_pos_y,
      x,
      y,
      width,
      height
    );
  }
}
customElements.define("p-rect", Rect);
/**
 * Draws a square to the screen. A square is a four-sided shape with every
 * angle at ninety degrees, and equal side size. This element is a special
 * case of the rect element, where the width and height are the same, and the
 * attribute is called "s" for side size. By default, the x and y attributes
 * set the location of the upper-left corner, and s sets the side size of the
 * square. The way these attributes are interpreted, may be changed with the
 * rect_mode attribute.
 *
 * The tl, tr, br, and bl attributes, if specified, determine corner radius
 * for the top-left, top-right, lower-right and lower-left corners,
 * respectively. An omitted corner radius attribute is set to the value of
 * the previously specified radius value in the attribute list.
 *
 * @element square
 */
class Square extends addXY(addRectMode(addFillStroke(RenderedElement))) {
  #size;
  constructor() {
    super(["x, y, size, [tl], [tr], [br], [bl]"]);
  }
  collider = p5.prototype.collider_type.rect;
  get collision_args() {
    const originalPoint = new DOMPoint(this.x, this.y);
    const { x, y } = this.pInst._transform_point_matrix(
      originalPoint,
      this.transform_matrix
    );
    const { pixel_density } = this.pInst;
    const { size } = this;
    const w = size * this.pInst.pow(pixel_density, 2);
    const h = w;
    return [x, y, w, h];
  }
  get mouse_over() {
    const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
    const { x, y, s } = this;
    return this.pInst.collide_point_rect(
      mouse_trans_pos_x,
      mouse_trans_pos_y,
      x,
      y,
      s,
      s
    );
  }
  /**
   * The side size of the square
   * @type {number}
   */
  get size() {
    return this.#size;
  }
  set size(val) {
    if (!isNaN(val)) this.#size = Number(val);
    else
      console.error(
        `${this.tagName}'s size is being set to ${val}, but it may only be set to a number.`
      );
  }
}
customElements.define("p-square", Square);
/**
 * Draws a triangle to the canvas. A triangle is a plane created by connecting
 * three points. x1 and y1 specify the first point, x2 and y2 specify the
 * second point, and x3 and y3 specify the
 * third point.
 * @element triangle
 */
class Triangle extends addXY123(addFillStroke(RenderedElement)) {
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
    const { x1, y1, x2, y2, x3, y3 } = this;
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
    const { x1, y1, x2, y2, x3, y3 } = this;
    return [
      this.pInst.createVector(x1, y1),
      this.pInst.createVector(x2, y2),
      this.pInst.createVector(x3, y3),
    ];
  }
}
customElements.define("p-triangle", Triangle);

/**
 * Draws a cubic Bezier curve on the screen. These curves are defined by a
 * series of anchor and control points. x1 and y1 specify
 * the first anchor point and x4 and y4 specify the other
 * anchor point, which become the first and last points on the curve. (x2, y2)
 * and (x3, y3) specify the two control points which define the shape
 * of the curve. Approximately speaking, control points "pull" the curve
 * towards them.
 *
 * Bezier curves were developed by French automotive engineer Pierre Bezier,
 * and are commonly used in computer graphics to define gently sloping curves.
 * ```<curve>``` element.
 * @element bezier
 */
class Bezier extends addXYZ1234(addFillStroke(RenderedElement)) {
  constructor() {
    super([
      "x1, y1, x2, y2, x3, y3, x4, y4",
      "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4",
    ]);
  }
}
customElements.define("p-bezier", Bezier);
class Curve extends addXYZ1234(addFillStroke(RenderedElement)) {
  constructor() {
    super([
      "x1, y1, x2, y2, x3, y3, x4, y4",
      "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4",
    ]);
  }
}
customElements.define("p-curve", Curve);
class Contour extends addFillStroke(RenderedElement) {
  constructor() {
    super([""], "beginContour");
  }
  endRender() {
    this.pInst.endContour();
  }
}
customElements.define("p-contour", Contour);
class Shape extends addFillStroke(RenderedElement) {
  constructor() {
    super(["[kind]"], "beginShape");
  }
  collider = p5.prototype.collider_type.poly;
  get collision_args() {
    return [this.vertices.map(transformVertexFn(this))];
  }
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
      (el) => el instanceof Vertex && el.this_element
    );
    const vertices = vertexChildren.map((el) => {
      if (el instanceof QuadraticVertex) {
        const { x3, y3 } = el;
        return this.pInst.createVector(x3, y3);
      }
      const { x, y } = el;
      return this.pInst.createVector(x, y);
    });
    return vertices.concat(vertices.slice(0));
  }
}
customElements.define("p-shape", Shape);
class Vertex extends addXYZ(RenderedElement) {
  constructor() {
    super(["x, y, [z], [u], [v]"]);
  }
}
customElements.define("p-vertex", Vertex);

class QuadraticVertex extends RenderedElement {
  constructor() {
    super(["cx, cy, x3, y3", "cx, cy, cz, x3, y3, z3"]);
  }
}
customElements.define("p-quadratic-vertex", QuadraticVertex);
class CurveVertex extends addXYZ(RenderedElement) {
  constructor() {
    super(["x, y", "x, y, [z]"]);
  }
}
customElements.define("p-curve-vertex", CurveVertex);
