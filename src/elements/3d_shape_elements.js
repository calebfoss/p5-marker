import { RenderedElement } from "../core";
import {
  addXYZ,
  addWidthHeight,
  addXY,
  addXYZ12,
  addXYZ1234,
  addXYZ123,
} from "../properties/shape_props";
import { addFillStroke, addStroke } from "../properties/color_props";
import { add3DProps } from "../properties/3d_props";
import { addArcProps, addDiameter } from "./2d_shape_elements";

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
  addArcProps(addDetail(add3DProps(RenderedElement)))
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
  addXYZ12(addStroke(add3DProps(RenderedElement)))
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
  addXYZ1234(addDetailXY(addFillStroke(add3DProps(RenderedElement))))
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
class Triangle3D extends addXYZ123(addFillStroke(add3DProps(RenderedElement))) {
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
  addXYZ1234(addFillStroke(add3DProps(RenderedElement)))
) {
  static overloads = ["x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4"];
}
customElements.define("p-bezier-3d", Bezier3D);
