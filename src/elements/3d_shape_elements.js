import { RenderedElement } from "../core";
import {
  addXYZ,
  addWidthHeight,
  addXY,
  addCurveTightness,
  addXYZ1,
  addXYZ2,
  addXYZ3,
  addXYZ4,
} from "../properties/shape_props";
import { addFillStroke, addStroke } from "../properties/color_props";
import { add3DProps } from "../properties/3d_props";
import {
  addArcProps,
  addDiameter,
  addShapeElementProps,
} from "./2d_shape_elements";
import { addBezierMethods, addCurveMethods } from "../methods/shape_methods";

class WebGLGeometry extends addFillStroke(add3DProps(RenderedElement)) {}

class Normal extends addXYZ(RenderedElement) {
  static overloads = ["vector", "x, y, z"];
}
customElements.define("p-normal", Normal);

class Plane extends addWidthHeight(WebGLGeometry) {
  static overloads = "[width], [height], [detail_x], [detail_y]";
}
customElements.define("p-plane", Plane);

class Box extends addWidthHeight(WebGLGeometry) {
  static overloads = ["[width], [height], [depth], [detail_x], [detail_y]"];
}
customElements.define("p-box", Box);

class Sphere extends WebGLGeometry {
  static overloads = ["[radius], [detail_x], [detail_y]"];
}
customElements.define("p-sphere", Sphere);

class Cylinder extends WebGLGeometry {
  static overloads = [
    "[radius], [height], [detail_x], [detail_y], [bottomCap], [topCap]",
  ];
}
customElements.define("p-cylinder", Cylinder);

class Cone extends WebGLGeometry {
  static overloads = ["[radius], [height], [detail_x], [detail_y], [cap]"];
}
customElements.define("p-cone", Cone);

class Ellipsoid extends WebGLGeometry {
  static overloads = [
    "[radius_x], [radius_y], [radius_z], [detail_x], [detail_y]",
  ];
}
customElements.define("p-ellipsoid", Ellipsoid);

class Torus extends WebGLGeometry {
  static overloads = ["[radius], [tubeRadius], [detailX], [detailY]"];
}
customElements.define("p-torus", Torus);

//  TODO - test when preload implemented
class LoadModel extends RenderedElement {
  static overloads = [
    "path, normalize, [successCallback], [failureCallback], [fileType]",
    "path, [successCallback], [failureCallback], [fileType]",
  ];
}
customElements.define("p-load-model", LoadModel);

class Model extends WebGLGeometry {
  static overloads = ["model"];
}
customElements.define("p-model", Model);

const remove3DFromRenderFunctionName = (baseClass) =>
  class extends baseClass {
    constructor() {
      super();
      this.renderFunctionName = this.renderFunctionName.slice(0, -2);
    }
  };

const addDetail = (baseClass) =>
  class extends baseClass {
    #detail = 25;
    /**
     * specifies the number of vertices that makes up the perimeter of the shape.
     * Default value is 25. Won't draw a stroke for a detail of more than 50.
     * @type {Integer}
     */
    get detail() {
      return this.#detail;
    }
    set detail(val) {
      this.#detail = val;
    }
  };
const addDetailXY = (baseClass) =>
  class extends baseClass {
    #detail_x = 2;
    #detail_y = 2;
    /**
     * number of segments in the x-direction
     * @type {Integer}
     */
    get detail_x() {
      return this.#detail_x;
    }
    set detail_x(val) {
      this.#detail_x = val;
    }
    /**
     * number of segments in the y-direction
     * @type {Integer}
     */
    get detail_y() {
      return this.#detail_y;
    }
    set detail_y(val) {
      this.#detail_y = val;
    }
  };
/**
 * Draws an arc onto a ```<canvas-3d>```.
 * The origin may be changed with the ellipse_mode property.
 *
 * The arc is always drawn clockwise from wherever start falls to wherever
 * stop falls on the ellipse. Adding or subtracting TWO_PI to either angle
 * does not change where they fall. If both start and stop fall at the same
 * place, a full ellipse will be drawn. Be aware that the y-axis increases in
 * the downward direction, therefore angles are measured clockwise from the
 * positive x-direction ("3 o'clock").
 * @element arc-3d
 */
class Arc3D extends remove3DFromRenderFunctionName(
  addXY(addArcProps(addDetail(add3DProps(RenderedElement))))
) {
  static overloads = [
    "x, y, width, height, start_angle, stop_angle, [mode], [detail]",
  ];
}
customElements.define("p-arc-3d", Arc3D);

/**
 * Draws an ellipse (oval) onto a ```<canvas-3d>```. If no height is specified, the
 * value of width is used for both the width and height. If a
 * negative height or width is specified, the absolute value is taken.
 *
 * An ellipse with equal width and height is a circle. The origin may be
 * changed with the ellipseMode() function.
 * @element ellipse-3d
 */
class Ellipse3D extends remove3DFromRenderFunctionName(
  addXY(addWidthHeight(addFillStroke(add3DProps(RenderedElement))))
) {
  static overloads = ["x, y, width, [height], [detail]"];
}
customElements.define("p-ellipse-3d", Ellipse3D);

/**
 * Draws a circle onto a ```<canvas-3d>```. A circle is a simple closed shape. It is the
 * set of all points in a plane that are at a given distance from a given
 * point, the center.
 * @element circle
 */
class Circle3D extends remove3DFromRenderFunctionName(
  addXY(addDiameter(addFillStroke(add3DProps(RenderedElement))))
) {
  static overloads = ["x, y, diameter"];
}
customElements.define("p-circle-3d", Circle3D);

/**
 * Draws a line (a direct path between two points) onto a ```<canvas-3d>```. Its width
 * can be modified by using the stroke_weight property. A line cannot be
 * filled, therefore the fill_color property will not affect the color of a
 * line. So to color a line, use the stroke property.
 * @element line-3d
 */
class Line3D extends remove3DFromRenderFunctionName(
  addXYZ1(addXYZ2(addStroke(add3DProps(RenderedElement))))
) {
  static overloads = ["x1, y1, z1, x2, y2, z2"];
}
customElements.define("p-line-3d", Line3D);

/**
 * Draws a point, a coordinate in space at the dimension of one pixel onto a ```<canvas-3d>```.
 * The color of the point is changed with the stroke property. The size of
 * the point can be changed with the stroke_weight property.
 * @element point
 */
class Point3D extends remove3DFromRenderFunctionName(
  addXYZ(addStroke(add3DProps(RenderedElement)))
) {
  static overloads = ["x, y, z"];
}
customElements.define("p-point-3d", Point3D);

/**
 * Draws a quad onto a ```<canvas-3d>```. A quad is a quadrilateral, a four-sided
 * polygon. It is similar to a rectangle, but the angles between its edges
 * are not constrained to ninety degrees. The x1 and y1 properties set the
 * first vertex and the subsequent pairs should proceed clockwise or
 * counter-clockwise around the defined shape.
 * @element quad
 */
class Quad3D extends remove3DFromRenderFunctionName(
  addXYZ1(
    addXYZ2(
      addXYZ3(addXYZ4(addDetailXY(addFillStroke(add3DProps(RenderedElement)))))
    )
  )
) {
  static overloads = [
    "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, [detail_x], [detail_y]",
  ];
}
customElements.define("p-quad-3d", Quad3D);
/**
 * Draws a rectangle onto a ```<canvas-3d>```. A rectangle is a four-sided closed shape
 * with every angle at ninety degrees. By default, the x and y properties
 * set the location of the upper-left corner, w sets the width, and h sets
 * the height. The way these properties are interpreted may be changed with
 * the rect_mode property.
 * @element rect
 */
class Rect3D extends remove3DFromRenderFunctionName(
  addXY(addWidthHeight(addFillStroke(add3DProps(RenderedElement))))
) {
  static overloads = [
    "x, y, width, [height], [top_left_radius], [top_right_radius], [bottom_right_radius], [bottom_left_radius]",
  ];
}
customElements.define("p-rect-3d", Rect3D);

/**
 * Draws a triangle onto a ```<canvas-3d>```. A triangle is a plane created by connecting
 * three points. x1 and y1 specify the first point, x2 and y2 specify the
 * second point, and x3 and y3 specify the
 * third point.
 * @element triangle
 */
class Triangle3D extends remove3DFromRenderFunctionName(
  addXYZ1(addXYZ2(addXYZ3(addFillStroke(add3DProps(RenderedElement)))))
) {
  static overloads = ["x1, y1, z1, x2, y2, z2, x3, y3, z3"];
}
customElements.define("p-triangle-3d", Triangle3D);

/**
 * Draws a cubic Bezier curve onto a ```<canvas-3d>```. These curves are defined by a
 * series of anchor and control points. x1 and y1 specify
 * the first anchor point and x4 and y4 specify the other
 * anchor point, which become the first and last points on the curve. (x2, y2)
 * and (x3, y3) specify the two control points which define the shape
 * of the curve. Approximately speaking, control points "pull" the curve
 * towards them.
 *
 * Bezier curves were developed by French automotive engineer Pierre Bezier,
 * and are commonly used in computer graphics to define gently sloping curves.
 * @element bezier-3d
 */
class Bezier3D extends remove3DFromRenderFunctionName(
  addXYZ1(
    addXYZ2(
      addXYZ3(
        addXYZ4(addFillStroke(add3DProps(addBezierMethods(RenderedElement))))
      )
    )
  )
) {
  static overloads = ["x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4"];
}
customElements.define("p-bezier-3d", Bezier3D);

/**
 * Draws a curved line onto a ```<canvas-3d>``` between two points,
 * given as (x2, y2) and (x3, y3).
 * (x1, y1) is a control point, as
 * if the curve came from this point even though it's not drawn. (x4, y4) similarly describes
 * the other control point.
 *
 * Longer curves can be created by putting a series of ```<curve-3d>``` elements
 * together or using ```<curve-vertex>```. The curve_tightness property provides control
 * for the visual quality of the curve.
 * The ```<curve>``` element is an implementation of Catmull-Rom splines.
 * @element curve
 */
class Curve3D extends remove3DFromRenderFunctionName(
  addXYZ1(
    addXYZ2(
      addXYZ3(
        addXYZ4(
          addCurveTightness(
            addFillStroke(add3DProps(addCurveMethods(RenderedElement)))
          )
        )
      )
    )
  )
) {
  static overloads = ["x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4"];
}
customElements.define("p-curve-3d", Curve3D);
/**
 * Use the ```<contour-3d>``` element to create negative shapes
 * within a ```<shape-3d>``` element such as the center of the letter 'O'.
 * The vertices of the ```<contour-3d>``` are defined by its
 * ```<vertex-3d>``` and ```<curve-vertex-3d>``` children.
 * The vertices that define a negative shape must "wind" in the opposite direction
 * from the exterior shape. First draw vertices for the exterior clockwise order, then for internal shapes, draw vertices
 * shape in counter-clockwise.
 *
 * This element must be a child of a ```<shape-3d>```.
 * @element contour
 */
class Contour3D extends remove3DFromRenderFunctionName(
  addFillStroke(add3DProps(RenderedElement))
) {
  renderFunctionName = "beginContour";
  endRender() {
    this.pInst.endContour();
  }
}
customElements.define("contour-3d", Contour3D);
/**
 * Using the ```<shape-3d>``` element allow creating more
 * complex forms on a ```<canvas-3d>```.
 * The vertices of the shape are defined by its ```<vertex-3d>```,
 * ```<curve-vertex-3d>```, and/or ```<quadratic-vertex-3d>``` children.
 * The value of the kind property tells it which
 * types of shapes to create from the provided vertices. With no mode
 * specified, the shape can be any irregular polygon.
 *
 *
 * Transformations such as translate, angle, and scale do not work on children on ```<shape-3d>```.
 * It is also not possible to use other shapes, such as
 * ```<ellipse-3d>``` or ```<rect-3d>``` as children of ```<shape-3d>```.
 * @element shape-3d
 */
class Shape3D extends addShapeElementProps(
  addFillStroke(add3DProps(RenderedElement))
) {}
customElements.define("p-shape-3d", Shape3D);

const addUV = (baseClass) =>
  class extends baseClass {
    #u;
    #v;
    /**
     * the vertex's texture u-coordinate
     * @type {number}
     */
    get u() {
      return this.#u;
    }
    set u(val) {
      this.#u = val;
    }
    /**
     * the vertex's texture v-coordinate
     * @type {number}
     */
    get v() {
      return this.#v;
    }
    set v(val) {
      this.#v = val;
    }
  };
/**
 * All shapes are constructed by connecting a series of vertices. ```<vertex-3d>```
 * is used to specify the vertex coordinates for shapes on a ```<canvas-3d>```.
 * It is used exclusively as a child of the ```<shape-3d>``` element.
 * @element vertex
 */
class Vertex3D extends addXYZ(addUV(RenderedElement)) {
  static overloads = ["x, y, z, [u], [v]"];
}
customElements.define("p-vertex-3d", Vertex3D);
/**
 * Specifies vertex coordinates for quadratic Bezier curves on a ```<canvas-3d>```.
 * Each ```<quadratic-vertex-3d>```
 * defines the position of one control points and one
 * anchor point of a Bezier curve, adding a new segment to a line or shape.
 * The first ```<quadratic-vertex-3d>``` child of a ```<shape>``` element
 * must have a ```<vertex-3d>``` sibling above it to set the first anchor point.
 *
 * This element must be a child of a ```<shape-3d>``` element
 * and only when there is no MODE or POINTS property specified on the
 *  ```<shape-3d>```.
 */

class QuadraticVertex3D extends addXYZ3(RenderedElement) {
  static overloads = ["cx, cy, cz, x3, y3, z3"];
}
customElements.define("p-quadratic-vertex-3d", QuadraticVertex3D);

/**
 * Specifies vertex coordinates for curves. This function may only
 * be used as a child of the ```<shape-3d>``` element and only when there
 * is no MODE property specified on the ```<shape-3d>``.
 *
 * The first and last points in a series of ```<curve-vertex-3d>``` lines
 * will be used to
 * guide the beginning and end of the curve. A minimum of four
 * points is required to draw a tiny curve between the second and
 * third points. Adding a fifth point with ```<curve-vertex>``` will draw
 * the curve between the second, third, and fourth points. The
 * ```<curve-vertex>``` element is an implementation of Catmull-Rom
 * splines.
 */
class CurveVertex3D extends remove3DFromRenderFunctionName(
  addXYZ(addCurveTightness(addFillStroke(add3DProps(RenderedElement))))
) {
  static overloads = ["x, y, z"];
}
customElements.define("p-curve-vertex-3d", CurveVertex3D);
