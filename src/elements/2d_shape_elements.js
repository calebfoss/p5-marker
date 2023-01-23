import { RenderedElement } from "../core";
import { addStroke, addFillStroke } from "../properties/color_props";
import {
  addXY,
  addXYZ,
  addXYZ12,
  addXY123,
  addXYZ1234,
  addWidthHeight,
  addRectMode,
  add2DStrokeStyling,
} from "../properties/shape_props";

const add2DStroke = (baseClass) => addStroke(add2DStrokeStyling(baseClass));
const add2DFillStroke = (baseClass) =>
  addFillStroke(add2DStrokeStyling(baseClass));

const transformVertexFn = (el) => (v) => {
  const originalPoint = new DOMPoint(v.x, v.y);
  const { x, y } = el.pInst._transform_point_matrix(
    originalPoint,
    el.transform_matrix
  );
  return el.pInst.createVector(x, y);
};

const addArcProps = (baseClass) =>
  class extends baseClass {
    #start_angle;
    #stop_angle;
    #mode;
    #detail;
    static overloads = [
      "x, y, width, height, start_angle, stop_angle, [mode], [detail]",
    ];
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
    /**
     * Angle to start the arc. Units are radians by default but may be changed
     * to degrees with the degree_mode property.
     * @type {number}
     */
    get start_angle() {
      return this.#start_angle;
    }
    set start_angle(val) {
      this.#start_angle = val;
    }
    /**
     * Angle to stop the arc. Units are radians by default but may be changed
     * to degrees with the degree_mode property.
     * @type {number}
     */
    get stop_angle() {
      return this.#stop_angle;
    }
    set stop_angle(val) {
      this.#stop_angle = val;
    }
    /**
     * determines the way of drawing the arc:
     * - OPEN - like an open semi-circle
     * - CHORD - closed semi-circle
     * - PIE - closed pie segment
     * @type {CHORD|PIE|OPEN}
     */
    get mode() {
      return this.#mode;
    }
    set mode(val) {
      this.#mode = val;
    }
    /**
     * 3D mode only. This is to specify the number of vertices that makes up the
     * perimeter of the arc. Default value is 25. Won't draw a stroke for a detail
     * of more than 50. (on 3D canvas only)
     * @type {number}
     */
    get detail() {
      return this.#detail;
    }
    set detail(val) {
      this.#detail = val;
    }
  };
/**
 * Draws an arc to the screen.
 * The origin may be changed with the ellipse_mode property.
 *
 * The arc is always drawn clockwise from wherever start falls to wherever
 * stop falls on the ellipse. Adding or subtracting TWO_PI to either angle
 * does not change where they fall. If both start and stop fall at the same
 * place, a full ellipse will be drawn. Be aware that the y-axis increases in
 * the downward direction, therefore angles are measured clockwise from the
 * positive x-direction ("3 o'clock").
 * @element arc
 */
class Arc extends addXY(
  addWidthHeight(addArcProps(add2DFillStroke(RenderedElement)))
) {}
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
  static overloads = ["x, y, width, [height]", "x, y, width, height, [detail]"];
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
class Circle extends addXY(add2DFillStroke(RenderedElement)) {
  #diameter = 100;
  static overloads = ["x, y, diameter"];

  collider = p5.prototype.collider_type.circle;
  get collision_args() {
    const originalPoint = new DOMPoint(this.x, this.y);
    const { x, y } = this.pInst._transform_point_matrix(
      originalPoint,
      this.transform_matrix
    );
    const scaledDiameter =
      this.diameter * this.pInst.pow(this.pInst.pixel_density, 2);
    return [x, y, scaledDiameter];
  }
  /**
   * Diameter of the circle
   * @type {number}
   */
  get diameter() {
    return this.#diameter;
  }
  set diameter(val) {
    this.#diameter = val;
  }
  get mouse_over() {
    const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
    const { x, y, diameter } = this;
    return this.pInst.collide_point_circle(
      mouse_trans_pos_x,
      mouse_trans_pos_y,
      x,
      y,
      diameter
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
class Line extends addXYZ12(add2DStroke(RenderedElement)) {
  static overloads = ["x1, y1, x2, y2", "x1, y1, z1, x2, y2, z2"];
  collider = p5.prototype.collider_type.line;
  get collision_args() {
    const originalStart = new DOMPoint(this.x1, this.y1);
    const { x: x1, y: y1 } = this.pInst._transform_point_matrix(
      originalStart,
      this.transform_matrix
    );
    const originalEnd = new DOMPoint(this.x2, this.y2);
    const { x: x2, y: y2 } = this.pInst._transform_point_matrix(
      originalEnd,
      this.transform_matrix
    );
    return [x1, y1, x2, y2];
  }
  get mouse_over() {
    const { mouse_trans_pos_x, mouse_trans_pos_y } = this.pInst;
    const { x1, y1, x2, y2 } = this;
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
class Point extends addXYZ(add2DStroke(RenderedElement)) {
  static overloads = ["x, y, [z]"];
  collider = p5.prototype.collider_type.circle;
  get collision_args() {
    const originalPoint = new DOMPoint(this.x, this.y);
    const { x, y } = this.pInst._transform_point_matrix(
      originalPoint,
      this.transform_matrix
    );
    const { stroke_weight } = this;
    const { pixel_density } = this.pInst;
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
class Quad extends addXYZ1234(add2DFillStroke(RenderedElement)) {
  static overloads = [
    "x1, y1, x2, y2, x3, y3, x4, y4, [detail_x], [detail_y]",
    "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, [detail_x], [detail_y]",
  ];
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
const addCornerRadius = (baseClass) =>
  class extends baseClass {
    #top_left_radius = 0;
    #top_right_radius = 0;
    #bottom_left_radius = 0;
    #bottom_right_radius = 0;
    /**
     * radius of top-left corner
     * @type {number}
     */
    get top_left_radius() {
      return this.#top_left_radius;
    }
    set top_left_radius(val) {
      this.#top_left_radius = val;
    }
    /**
     * radius of top-right corner
     * @type {number}
     */
    get top_right_radius() {
      return this.#top_right_radius;
    }
    set top_right_radius(val) {
      this.#top_right_radius = val;
    }
    /**
     * radius of bottom-left corner
     * @type {number}
     */
    get bottom_left_radius() {
      return this.#bottom_left_radius;
    }
    set bottom_left_radius(val) {
      this.#bottom_left_radius = val;
    }
    /**
     * radius of bottom-right corner
     * @type {number}
     */
    get bottom_right_radius() {
      return this.#bottom_right_radius;
    }
    set bottom_right_radius(val) {
      this.#bottom_right_radius = val;
    }
  };
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
  addWidthHeight(addRectMode(addCornerRadius(add2DFillStroke(RenderedElement))))
) {
  static overloads = [
    "x, y, width, [height], [top_left_radius], [top_right_radius], [bottom_right_radius], [bottom_left_radius]",
  ];
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
class Square extends addXY(
  addRectMode(addCornerRadius(add2DFillStroke(RenderedElement)))
) {
  #size;
  static overloads = [
    "x, y, size, [top_left_radius], [top_right_radius], [bottom_right_radius], [bottom_left_radius]",
  ];
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
class Triangle extends addXY123(add2DFillStroke(RenderedElement)) {
  static overloads = ["x1, y1, x2, y2, x3, y3"];
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
class Bezier extends addXYZ1234(add2DFillStroke(RenderedElement)) {
  static overloads = [
    "x1, y1, x2, y2, x3, y3, x4, y4",
    "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4",
  ];
}
customElements.define("p-bezier", Bezier);
class Curve extends addXYZ1234(add2DFillStroke(RenderedElement)) {
  static overloads = [
    "x1, y1, x2, y2, x3, y3, x4, y4",
    "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4",
  ];
}
customElements.define("p-curve", Curve);
class Contour extends add2DFillStroke(RenderedElement) {
  renderFunctionName = "beginContour";
  endRender() {
    this.pInst.endContour();
  }
}
customElements.define("p-contour", Contour);
class Shape extends add2DFillStroke(RenderedElement) {
  renderFunctionName = "beginShape";
  static overloads = ["[kind]"];
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
  static overloads = ["x, y, [z], [u], [v]"];
}
customElements.define("p-vertex", Vertex);

class QuadraticVertex extends RenderedElement {
  static overloads = ["cx, cy, x3, y3", "cx, cy, cz, x3, y3, z3"];
}
customElements.define("p-quadratic-vertex", QuadraticVertex);
class CurveVertex extends addXYZ(RenderedElement) {
  static overloads = ["x, y", "x, y, [z]"];
}
customElements.define("p-curve-vertex", CurveVertex);
