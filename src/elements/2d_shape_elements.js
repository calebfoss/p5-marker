import { RenderedElement } from "../core";
import { addBezierPoint, addCurvePoint } from "../methods/shape_methods";
import { addStroke, addFillStroke } from "../properties/color_props";
import {
  addXY,
  addXYZ,
  addXY12,
  addWidthHeight,
  addRectMode,
  add2DStrokeStyling,
  addCurveTightness,
  addCXY,
  addXY3,
  addXY4,
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

export const addArcProps = (baseClass) =>
  class extends baseClass {
    #start_angle = 0;
    #stop_angle = Math.PI;
    #mode;
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
) {
  static overloads = ["x, y, width, height, start_angle, stop_angle, [mode]"];
}
customElements.define("p-arc", Arc);

const addEllipse2DCollisionProps = (baseClass) =>
  class extends baseClass {
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
  };
/**
 * Draws an ellipse (oval) to a 3D canvas. If no height is specified, the
 * value of width is used for both the width and height. If a
 * negative height or width is specified, the absolute value is taken.
 *
 * An ellipse with equal width and height is a circle. The origin may be
 * changed with the ellipseMode() function.
 * @element ellipse
 */
class Ellipse extends addXY(
  addWidthHeight(addFillStroke(addEllipse2DCollisionProps(RenderedElement)))
) {
  static overloads = ["x, y, width, [height]"];
}
customElements.define("p-ellipse", Ellipse);

const addCircle2DCollisionProps = (baseClass) =>
  class extends baseClass {
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
      const d =
        this.this_element.d * this.pInst.pow(this.pInst.pixel_density, 2);
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
  };
export const addDiameter = (baseClass) =>
  class extends baseClass {
    #diameter = 100;
    get diameter() {
      return this.#diameter;
    }
    set diameter(val) {
      this.#diameter = val;
    }
  };
/**
 * Draws a circle to the screen. A circle is a simple closed shape. It is the
 * set of all points in a plane that are at a given distance from a given
 * point, the center.
 * @element circle
 */
class Circle extends addXY(
  addDiameter(add2DFillStroke(addCircle2DCollisionProps(RenderedElement)))
) {
  static overloads = ["x, y, diameter"];
}
customElements.define("p-circle", Circle);

const addLine2DCollisionProps = (baseClass) =>
  class extends baseClass {
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
  };
/**
 * Draws a line (a direct path between two points) to the screen. Its width
 * can be modified by using the stroke_weight property. A line cannot be
 * filled, therefore the fill_color property will not affect the color of a
 * line. So to color a line, use the stroke property.
 * @element line
 */
class Line extends addXY12(
  add2DStroke(addLine2DCollisionProps(RenderedElement))
) {
  static overloads = ["x1, y1, x2, y2"];
}
customElements.define("p-line", Line);

const addPointCollisionProps = (baseClass) =>
  class extends baseClass {
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
  };
/**
 * Draws a point, a coordinate in space at the dimension of one pixel. The
 * color of the point is changed with the stroke property. The size of
 * the point can be changed with the stroke_weight property.
 * @element point
 */
class Point extends addXY(
  add2DStroke(addPointCollisionProps(RenderedElement))
) {
  static overloads = ["x, y"];
}
customElements.define("p-point", Point);

const addQuad2DCollisionProps = (baseClass) =>
  class extends baseClass {
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
  };
/**
 * Draws a quad on the canvas. A quad is a quadrilateral, a four-sided
 * polygon. It is similar to a rectangle, but the angles between its edges
 * are not constrained to ninety degrees. The x1 and y1 properties set the
 * first vertex and the subsequent pairs should proceed clockwise or
 * counter-clockwise around the defined shape.
 * @element quad
 */
class Quad extends addXY12(
  addXY3(addXY4(add2DFillStroke(addQuad2DCollisionProps(RenderedElement))))
) {
  static overloads = ["x1, y1, x2, y2, x3, y3, x4, y4"];
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
 * with every angle at ninety degrees. By default, the x and y properties
 * set the location of the upper-left corner, w sets the width, and h sets
 * the height. The way these properties are interpreted may be changed with
 * the rect_mode property.
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
    const { x, y, size } = this;
    return this.pInst.collide_point_rect(
      mouse_trans_pos_x,
      mouse_trans_pos_y,
      x,
      y,
      size,
      size
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
class Triangle extends addXY12(addXY3(add2DFillStroke(RenderedElement))) {
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
 * @element bezier
 */
class Bezier extends addXY12(
  addXY3(addXY4(add2DFillStroke(addBezierPoint(RenderedElement))))
) {
  static overloads = ["x1, y1, x2, y2, x3, y3, x4, y4"];
}
customElements.define("p-bezier", Bezier);

/**
 * Draws a curved line on the screen between two points, given as (x2, y2) and (x3, y3).
 * (x1, y1) is a control point, as
 * if the curve came from this point even though it's not drawn. (x4, y4) similarly describes
 * the other control point.
 *
 * Longer curves can be created by putting a series of ```<curve>``` elements
 * together or using ```<curve-vertex>```. The curve_tightness property provides control
 * for the visual quality of the curve.
 * The ```<curve>``` element is an implementation of Catmull-Rom splines.
 * @element curve
 */
class Curve extends addXY12(
  addXY3(
    addXY4(addCurveTightness(add2DFillStroke(addCurvePoint(RenderedElement))))
  )
) {
  static overloads = ["x1, y1, x2, y2, x3, y3, x4, y4"];
}
customElements.define("p-curve", Curve);
/**
 * Use the ```<contour>``` element to create negative shapes
 * within a ```<shape>``` element such as the center of the letter 'O'.
 * The vertices of the ```<contour>``` are defined by its
 * ```<vertex>``` and ```<curve-vertex>``` children.
 * The vertices that define a negative shape must "wind" in the opposite direction
 * from the exterior shape. First draw vertices for the exterior clockwise order, then for internal shapes, draw vertices
 * shape in counter-clockwise.
 *
 * This element must be a child of a ```<shape>```.
 * @element contour
 * @example Rectangular cut out
 * ```html
 * <canvas
 *    width="400"
 *    height="400"
 *    background="120, 140, 80"
 *    loop="false"
 * >
 *  <shape
 *      anchor="width/2, height/2"
 *      mode="CLOSE"
 *      fill="240, 200, 180"
 *      stroke="200, 100, 60"
 *      stroke_weight="4"
 *  >
 *    <vertex x="-100" y="-100">
 *      <vertex x="100">
 *        <vertex y="100">
 *          <vertex x="-100" />
 *        </vertex>
 *      </vertex>
 *    </vertex>
 *    <contour>
 *      <vertex x="-50" y="-50">
 *        <vertex y="50">
 *          <vertex x="50">
 *            <vertex y="-50" />
 *          </vertex>
 *        </vertex>
 *      </vertex>
 *    </contour>
 *  </shape>
 * </canvas>
 * ```
 */
class Contour extends add2DFillStroke(RenderedElement) {
  renderFunctionName = "beginContour";
  endRender() {
    this.pInst.endContour();
  }
}
customElements.define("p-contour", Contour);

const addShape2DCollisionProps = (baseClass) =>
  class extends baseClass {
    collider = p5.prototype.collider_type.poly;
    get collision_args() {
      return [this.vertices.map(transformVertexFn(this))];
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
  };
export const addShapeElementProps = (baseClass) =>
  class extends baseClass {
    #kind;
    renderFunctionName = "beginShape";
    static overloads = ["[kind]"];

    endRender(assigned) {
      if (assigned.hasOwnProperty("mode")) this.pInst.endShape(assigned.mode);
      else this.pInst.endShape();
    }
    /**
     * The options available for kind are
     *
     * POINTS
     * Draw a series of points
     *
     * LINES
     * Draw a series of unconnected line segments (individual lines)
     *
     * TRIANGLES
     * Draw a series of separate triangles
     *
     * TRIANGLE_FAN
     * Draw a series of connected triangles sharing the first vertex in a fan-like fashion
     *
     * TRIANGLE_STRIP
     * Draw a series of connected triangles in strip fashion
     *
     * QUADS
     * Draw a series of separate quads
     *
     * QUAD_STRIP
     * Draw quad strip using adjacent edges to form the next quad
     *
     * TESS (WEBGL only)
     * Handle irregular polygon for filling curve by explicit tessellation
     * @type {POINTS|LINES|TRIANGLES|TRIANGLE_FAN TRIANGLE_STRIP|QUADS|QUAD_STRIP|TESS}
     */
    get kind() {
      return this.#kind;
    }
    set kind(val) {
      this.#kind = val;
    }
  };
/**
 * Using the ```<shape>``` element allow creating more
 * complex forms. The vertices of the shape are defined by its ```<vertex>```,
 * ```<curve-vertex>```, and/or ```<quadratic-vertex>``` children.
 * The value of the kind property tells it which
 * types of shapes to create from the provided vertices. With no mode
 * specified, the shape can be any irregular polygon.
 *
 * Transformations such as translate, angle, and scale do not work on children on ```<shape>```.
 * It is also not possible to use other shapes, such as
 * ```<ellipse>``` or ```<rect>``` as children of ```<shape>```.
 * @element shape
 */
class Shape extends addShapeElementProps(
  add2DFillStroke(addShape2DCollisionProps(RenderedElement))
) {}
customElements.define("p-shape", Shape);

/**
 * All shapes are constructed by connecting a series of vertices. ```<vertex>```
 * is used to specify the vertex coordinates for points, lines, triangles,
 * quads, and polygons. It is used exclusively as a child of the ```<shape>``` element.
 * @element vertex
 */
class Vertex extends addXY(RenderedElement) {
  static overloads = ["x, y"];
}
customElements.define("p-vertex", Vertex);
/**
 * Specifies vertex coordinates for quadratic Bezier curves. Each ```<quadratic-vertex>```
 * defines the position of one control points and one
 * anchor point of a Bezier curve, adding a new segment to a line or shape.
 * The first ```<quadratic-vertex>``` child of a ```<shape>``` element
 * must have a ```<vertex>``` sibling above it to set the first anchor point.
 *
 * This element must be a child of a ```<shape>``` element
 * and only when there is no MODE or POINTS property specified on the
 *  ```<shape>```.
 */
class QuadraticVertex extends addCXY(addXY3(RenderedElement)) {
  static overloads = ["cx, cy, x3, y3"];
}
customElements.define("p-quadratic-vertex", QuadraticVertex);
/**
 * Specifies vertex coordinates for curves. This function may only
 * be used as a child of the ```<shape>``` element and only when there
 * is no MODE property specified on the ```<shape>``.
 *
 * The first and last points in a series of ```<curve-vertex>``` lines
 * will be used to
 * guide the beginning and end of the curve. A minimum of four
 * points is required to draw a tiny curve between the second and
 * third points. Adding a fifth point with ```<curve-vertex>``` will draw
 * the curve between the second, third, and fourth points. The
 * ```<curve-vertex>``` element is an implementation of Catmull-Rom
 * splines.
 */
class CurveVertex extends addXYZ(addCurveTightness(RenderedElement)) {
  static overloads = ["x, y"];
}
customElements.define("p-curve-vertex", CurveVertex);
