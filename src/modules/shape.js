import {
  defineProperties,
  defineRendererGetterSetters,
} from "../utils/p5Modifiers";
import { RenderedElement } from "./core";
import { StrokeElement, FillStrokeElement } from "./color";
import { WebGLGeometry } from "./3d";

const transformVertexFn = (el) => (v) => {
  const originalPoint = new DOMPoint(v.x, v.y);
  const { x, y } = el.pInst._transform_point_matrix(
    originalPoint,
    el.transform_matrix
  );
  return el.pInst.createVector(x, y);
};

export const addXY = (baseClass) =>
  class extends baseClass {
    #x;
    #y;
    /**
     * The x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get x() {
      return this.#x;
    }
    set x(val) {
      if (!isNaN(val)) this.#x = Number(val);
      else
        console.error(
          `${this.tagName}'s x property is being set to ${val}, but it may only be set to a number`
        );
    }
    /**
     * The y-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get y() {
      return this.#y;
    }
    set y(val) {
      if (!isNaN(val)) this.#y = Number(val);
      else
        console.error(
          `${this.tagName}'s y property is being set to ${val}, but it may only be set to a number`
        );
    }
  };

export const addXYZ = (baseClass) =>
  class extends addXY(baseClass) {
    #z;
    /**
     * The z-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get z() {
      return this.#z;
    }
    set z(val) {
      if (!isNaN(val)) this.#z = Number(val);
      else
        console.error(
          `${this.tagName}'s z property is being set to ${val}, but it may only be set to a number`
        );
    }
  };

export const addWidthHeight = (baseClass) =>
  class extends baseClass {
    #height;
    #width;
    /**
     * The height of the element in pixels.
     * @type {number}
     */
    get height() {
      return this.#height;
    }
    set height(val) {
      if (!isNaN(val)) this.#height = Number(val);
      else
        console.error(
          `${this.tagName}'s height is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The width of the element in pixels.
     * @type {number}
     */
    get width() {
      return this.#width;
    }
    set width(val) {
      if (!isNaN(val)) this.#width = Number(val);
      else
        console.error(
          `${this.tagName}'s width is being set to ${val}, but it may only be set to a number.`
        );
    }
  };

const addXY12 = (baseClass) =>
  class extends baseClass {
    #x1;
    #y1;
    #x2;
    #y2;
    /**
     * The first x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get x1() {
      return this.#x1;
    }
    set x1(val) {
      if (!isNaN(val)) this.#x1 = val;
      else
        console.error(
          `${this.tagName}'s x1 is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The first y-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get y1() {
      return this.#y1;
    }
    set y1(val) {
      if (!isNaN(val)) this.#y1 = val;
      else
        console.error(
          `${this.tagName}'s y1 is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The second x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get x2() {
      return this.#x2;
    }
    set x2(val) {
      if (!isNaN(val)) this.#x2 = val;
      else
        console.error(
          `${this.tagName}'s x2 is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The second y-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get y2() {
      return this.#y2;
    }
    set y2(val) {
      if (!isNaN(val)) this.#y2 = val;
      else
        console.error(
          `${this.tagName}'s y2 is being set to ${val}, but it may only be set to a number.`
        );
    }
  };

const addY3 = (baseClass) =>
  class extends baseClass {
    #x3;
    #y3;
    /**
     * The third x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get x3() {
      return this.#x3;
    }
    set x3(val) {
      if (!isNaN(val)) this.#x3 = val;
      else
        console.error(
          `${this.tagName}'s x3 is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The third y-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get y3() {
      return this.#y3;
    }
    set y3(val) {
      if (!isNaN(val)) this.#y3 = val;
      else
        console.error(
          `${this.tagName}'s y3 is being set to ${val}, but it may only be set to a number.`
        );
    }
  };

const addXY123 = (baseClass) => class extends addXY12(addY3(baseClass)) {};

const addXYZ12 = (baseClass) =>
  class extends addXY12(baseClass) {
    #z1;
    #z2;
    /**
     * The first x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get z1() {
      return this.#z1;
    }
    set z1(val) {
      if (!isNaN(val)) this.#z1 = val;
      else
        console.error(
          `${this.tagName}'s z1 is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The second x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get z2() {
      return this.#z2;
    }
    set z2(val) {
      if (!isNaN(val)) this.#z2 = val;
      else
        console.error(
          `${this.tagName}'s z2 is being set to ${val}, but it may only be set to a number.`
        );
    }
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
 * @attr {Number} x - x-coordinate of the arc's ellipse
 * @attr {Number} y - y-coordinate of the arc's ellipse
 * @attr {Number} w - width of the arc's ellipse by default (affected by ellipse_mode)
 * @attr {Number} h - height of the arc's ellipse by default (affected by ellipse_mode)
 * @attr {Number} start - angle to start the arc, specified in radians
 * @attr {Number} stop - angle to stop the arc, specified in radians
 * @attr {Constant} mode - determines the way of drawing the arc. either
 * CHORD, PIE or OPEN.
 * @attr {Integer} detail - optional parameter for WebGL mode only. This is
 * to specify the number of vertices that makes up the perimeter of the arc.
 * Default value is 25. Won't draw a stroke for a detail of more than 50.
 */
class Arc extends addXY(addWidthHeight(FillStrokeElement)) {
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
 * @attr {Number} x - x-coordinate of the center of the ellipse
 * @attr {Number} y - y-coordinate of the center of the ellipse
 * @attr {Number} w - width of the ellipse
 * @attr {Number} h - height of the ellipse
 * @attr {Integer} detail - For WEBGL mode only. This is to specify the
 * number of vertices that makes up the perimeter of the ellipse. Default
 * value is 25. Won't draw a stroke for a detail of more than 50.
 */
class Ellipse extends addXY(addWidthHeight(FillStrokeElement)) {
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
 * @attr {Number} x - x-coordinate of the center of the circle
 * @attr {Number} y - y-coordinate of the center of the circle
 * @attr {Number} d - diameter of the circle
 */
class Circle extends addXY(FillStrokeElement) {
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
 * @attr {Number} x1 - x-coordinate of the first point
 * @attr {Number} y1 - y-coordinate of the first point
 * @attr {Number} x2 - x-coordinate of the second point
 * @attr {Number} y2 - y-coordinate of the second point
 * @attr {Number} z1 - z-coordinate of the first point (WEBGL mode)
 * @attr {Number} z2 - z-coordinate of the second point (WEBGL mode)
 */
class Line extends addXYZ12(StrokeElement) {
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
 * @attr {Number} x - x-coordinate
 * @attr {Number} y - y-coordinate
 * @attr {Number} z - z-coordinate (WEBGL mode)
 */
class Point extends addXYZ(StrokeElement) {
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
 * @attr {Number} x1 - x-coordinate of the first point
 * @attr {Number} y1 - y-coordinate of the first point
 * @attr {Number} x2 - x-coordinate of the second point
 * @attr {Number} y2 - y-coordinate of the second point
 * @attr {Number} x3 - x-coordinate of the third point
 * @attr {Number} y3 - y-coordinate of the third point
 * @attr {Number} x4 - x-coordinate of the fourth point
 * @attr {Number} y4 - y-coordinate of the fourth point
 * @attr {Integer} detail_x - number of segments in the x-direction (WEBGL mode)
 * @attr {Integer} detail_y - number of segments in the y-direction (WEBGL mode)
 * @attr {Number} z1 - z-coordinate of the first point (WEBGL mode)
 * @attr {Number} z2 - z-coordinate of the second point (WEBGL mode)
 * @attr {Number} z3 - z-coordinate of the third point (WEBGL mode)
 * @attr {Number} z4 - z-coordinate of the fourth point (WEBGL mode)
 */
class Quad extends addXYZ1234(FillStrokeElement) {
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
 * @attr  {Number} x - x-coordinate of the rectangle.
 * @attr  {Number} y - y-coordinate of the rectangle.
 * @attr  {Number} w - width of the rectangle.
 * @attr  {Number} h - height of the rectangle.
 * @attr  {Number} tl - radius of top-left corner.
 * @attr  {Number} tr - radius of top-right corner.
 * @attr  {Number} br - radius of bottom-right corner.
 * @attr  {Number} bl - radius of bottom-left corner.
 */
class Rect extends addXY(addWidthHeight(FillStrokeElement)) {
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
 * @attr  {Number} x - x-coordinate of the square.
 * @attr  {Number} y - y-coordinate of the square.
 * @attr  {Number} s - side size of the square.
 * @attr  {Number} tl - radius of top-left corner.
 * @attr  {Number} tr - radius of top-right corner.
 * @attr  {Number} br - radius of bottom-right corner.
 * @attr  {Number} bl - radius of bottom-left corner.
 */
class Square extends addXY(FillStrokeElement) {
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
class Triangle extends addXY123(FillStrokeElement) {
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
class Bezier extends addXYZ1234(FillStrokeElement) {
  constructor() {
    super([
      "x1, y1, x2, y2, x3, y3, x4, y4",
      "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4",
    ]);
  }
}
customElements.define("p-bezier", Bezier);
class Curve extends addXYZ1234(FillStrokeElement) {
  constructor() {
    super([
      "x1, y1, x2, y2, x3, y3, x4, y4",
      "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4",
    ]);
  }
}
customElements.define("p-curve", Curve);
class Contour extends FillStrokeElement {
  constructor() {
    super([""], "beginContour");
  }
  endRender() {
    this.pInst.endContour();
  }
}
customElements.define("p-contour", Contour);
class Shape extends FillStrokeElement {
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
class Normal extends addXYZ(RenderedElement) {
  constructor() {
    super(["vector", "x, y, z"]);
  }
}
customElements.define("p-normal", Normal);
class Plane extends addWidthHeight(WebGLGeometry) {
  constructor() {
    super("[width], [height], [detail_x], [detail_y]");
  }
}
customElements.define("p-plane", Plane);
class Box extends addWidthHeight(WebGLGeometry) {
  constructor() {
    super(["[width], [height], [depth], [detail_x], [detail_y]"]);
  }
}
customElements.define("p-box", Box);
class Sphere extends WebGLGeometry {
  constructor() {
    super(["[radius], [detail_x], [detail_y]"]);
  }
}
customElements.define("p-sphere", Sphere);
class Cylinder extends WebGLGeometry {
  constructor() {
    super([
      "[radius], [height], [detail_x], [detail_y], [bottomCap], [topCap]",
    ]);
  }
}
customElements.define("p-cylinder", Cylinder);
class Cone extends WebGLGeometry {
  constructor() {
    super(["[radius], [height], [detail_x], [detail_y], [cap]"]);
  }
}
customElements.define("p-cone", Cone);
class Ellipsoid extends WebGLGeometry {
  constructor() {
    super(["[radius_x], [radius_y], [radius_z], [detail_x], [detail_y]"]);
  }
}
customElements.define("p-ellipsoid", Ellipsoid);
class Torus extends WebGLGeometry {
  constructor() {
    super(["[radius], [tubeRadius], [detailX], [detailY]"]);
  }
}
customElements.define("p-torus", Torus);
//  TODO - test when preload implemented
class LoadModel extends RenderedElement {
  constructor() {
    super([
      "path, normalize, [successCallback], [failureCallback], [fileType]",
      "path, [successCallback], [failureCallback], [fileType]",
    ]);
  }
}
customElements.define("p-load-model", LoadModel);
class Model extends WebGLGeometry {
  constructor() {
    super(["model"]);
  }
}
customElements.define("p-model", Model);

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
