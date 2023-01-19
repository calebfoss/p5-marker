import { addP5PropsAndMethods } from "../core";
import { addCanvasProperties } from "../properties/canvas_props";
import { addCanvasMethods } from "../methods/canvas_methods";

/**
 * The `<canvas>` element is a rectangular area of the window for rendering
 * imagery. All child elements are rendered to the canvas.
 *
 * This canvas will render 2D elements only. For a 3D canvas, use
 * ```<canvas-3d>```.
 */
class Canvas extends addCanvasMethods(
  addCanvasProperties(addP5PropsAndMethods(HTMLCanvasElement))
) {
  static renderer = "p2d";

  constructor() {
    super();
    window.addEventListener("customElementsDefined", this.runCode.bind(this));
  }
}
customElements.define("p-canvas", Canvas, { extends: "canvas" });

/**
 * The ```<canvas-3d>``` element is a ```<canvas>``` element
 * for rendering 3D elements.
 */
class WebGLCanvas extends addCanvasMethods(
  addCanvasProperties(addP5PropsAndMethods(HTMLCanvasElement))
) {
  #bezier_detail;
  #curve_detail;
  #debug_mode;
  #orbit_control;
  static renderer = "webgl";
  constructor() {
    super();
    window.addEventListener("customElementsDefined", this.runCode.bind(this));
  }
  /**
   * Sets the resolution at which Bezier's curve is displayed. The default value is 20.
   * @type {number}
   */
  get bezier_detail() {
    return this.#bezier_detail;
  }
  set bezier_detail(val) {
    this.pInst.bezierDetail(val);
    this.#bezier_detail = this.pInst._bezierDetail;
  }
  /**
   * Sets the current (active) camera of a 3D sketch.
   * Allows for switching between multiple cameras.
   *
   * Comma-separated arguments for
   * <a href="https://p5js.org/reference/#/p5/camera">camera()</a>
   * may also be provided to adjust the current camera.
   *
   * @type {p5.Camera}
   * */
  get camera() {
    return this.pInst._renderer._curCamera;
  }
  set camera(val) {
    const { pInst } = this;
    if (val instanceof p5.Camera) pInst.setCamera(val);
    else if (Array.isArray(val)) pInst.camera(...val);
    else pInst.camera(val);
  }
  /**
   * Sets the resolution at which curves display. The default value is 20 while
   * the minimum value is 3.
   * @type {number}
   */
  get curve_detail() {
    return this.#curve_detail;
  }
  set curve_detail(val) {
    this.pInst.curveDetail(val);
    this.#curve_detail = this.pInst._curveDetail;
  }
  /**
   * debug_mode helps visualize 3D space by adding a grid to indicate where the
   * ‘ground’ is in a sketch and an axes icon which indicates the +X, +Y, and +Z
   * directions. This property can be set to "true" to create a
   * default grid and axes icon, or it can be set to a comma-separated list
   * of values to pass into
   * <a href="https://p5js.org/reference/#/p5/debugMode">debugMode()</a>.
   *
   * By default, the grid will run through the origin (0,0,0) of the sketch
   * along the XZ plane
   * and the axes icon will be offset from the origin.  Both the grid and axes
   * icon will be sized according to the current canvas size.
   * Note that because the
   * grid runs parallel to the default camera view, it is often helpful to use
   * debug_mode along with orbit_control to allow full view of the grid.
   * @type {boolean}
   */
  get debug_mode() {
    return this.#debug_mode;
  }
  set debug_mode(val) {
    const { pInst } = this;
    if (val === false) {
      pInst.noDebugMode();
      this.#debug_mode = false;
      return;
    } else if (val === true) pInst.debugMode();
    else if (Array.isArray(val)) pInst.debugMode(...val);
    else pInst.debugMode(val);
    this.#debug_mode = true;
  }
  /**
   * Allows movement around a 3D sketch using a mouse or trackpad.
   * Left-clicking and dragging will rotate the camera position about the
   * center of the sketch,
   * right-clicking and dragging will pan the camera position without rotation,
   * and using the mouse wheel (scrolling) will move the camera closer or
   * further
   * from the center of the sketch. This property can be set with parameters
   * dictating sensitivity to mouse movement along the X, Y, and Z axes.
   * Setting orbit_control="true" is equivalent to setting
   * orbit_control="1, 1".
   * To reverse direction of movement in either axis, enter a negative number
   * for sensitivity.
   * @type {boolean}
   * */
  get orbit_control() {
    return this.#orbit_control;
  }
  set orbit_control(val) {
    if (val === false) return (this.#orbit_control = false);
    this.#orbit_control = true;
    if (Array.isArray(val)) return this.pInst.orbitControl(...val);
    this.pInst.orbitControl();
  }
  /**
   * Sets an orthographic projection for the current camera in a 3D sketch
   * and defines a box-shaped viewing frustum within which objects are seen.
   * In this projection, all objects with the same dimension appear the same
   * size, regardless of whether they are near or far from the camera.
   *
   * This may be set to a comma-separated list of arguments to
   * <a href="https://p5js.org/reference/#/p5/ortho">ortho()</a>
   *
   * If set to "true", the following default is used:
   * ortho(-width/2, width/2, -height/2, height/2).
   *
   * @type {boolean}
   */
  set ortho(val) {
    if (val === true) this.pInst.ortho();
    else if (Array.isArray(val)) this.pInst.ortho(...val);
    else if (val !== false) this.pInst.ortho(val);
  }
}
customElements.define("p-canvas-3d", WebGLCanvas, {
  extends: "canvas",
});
