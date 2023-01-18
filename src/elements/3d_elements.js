import {
  WebGLLight,
  addLightFalloff,
  addSpecularColor,
} from "../properties/3d_props";
import { addP5PropsAndMethods } from "../core";
import { addCanvasProperties } from "../properties/canvas_props";
import { addCanvasMethods } from "../methods/canvas_methods";

/**
 * Creates an ambient light with the given color.
 *
 * Ambient light does not come from a specific direction.
 * Objects are evenly lit from all sides. Ambient lights are
 * almost always used in combination with other types of lights.
 * @element ambient-light
 * @attribute {Number}   v1     red or hue value relative to the current color
 *                                range
 * @attribute {Number}   v2     green or saturation value relative to the
 *                                current color range
 * @attribute {Number}   v3     blue or brightness value relative to the current
 *                                color range
 * @attribute {Number}   alpha  alpha value relative to current color range
 *                                (default is 0-255)
 * @attribute {Number}   gray   number specifying value between
 *                                white and black
 * @attribute {String}   value  a color string
 * @attribute {Number[]} values an array containing the red,green,blue &
 *                                 and alpha components of the color
 * @attribute {p5.Color} color  color as a <a
 *                                 href="https://p5js.org/reference/#/p5.Color"
 *                                 target="_blank">p5.Color</a>
 */
class AmbientLight extends WebGLLight {
  constructor() {
    super(["v1, v2, v3, [alpha]", "gray, [alpha]", "value", "values", "color"]);
  }
}
customElements.define("p-ambient-light", AmbientLight);

/**
 * Creates a directional light with the given color and direction.
 *
 * Directional light comes from one direction.
 * The direction is specified as numbers inclusively between -1 and 1.
 * For example, setting the direction as (0, -1, 0) will cause the
 * geometry to be lit from below (since the light will be facing
 * directly upwards). Similarly, setting the direction as (1, 0, 0)
 * will cause the geometry to be lit from the left (since the light
 * will be facing directly rightwards).
 *
 * Directional lights do not have a specific point of origin, and
 * therefore cannot be positioned closer or farther away from a geometry.
 *
 * A maximum of **5** directional lights can be active at once.
 * @element    directional-light
 * @attribute  {Number}   v1     red or hue value relative to the current color
 *                                range
 * @attribute  {Number}   v2     green or saturation value relative to the
 *                                current color range
 * @attribute  {Number}   v3     blue or brightness value relative to the
 *                                current color range
 * @attribute  {Number}   x      x component of direction (inclusive range of
 *                                -1 to 1)
 * @attribute  {Number}   y      y component of direction (inclusive range of
 *                                -1 to 1)
 * @attribute  {Number}   z      z component of direction (inclusive range of
 *                                -1 to 1)
 * @attribute  {p5.Vector} direction  direction of light as a <a
 *                             href="https://p5js.org/reference/#/p5.Vector"
 *                             >p5.Vector</a>
 * @attribute {p5.Color} color  color as a <a
 *                                 href="https://p5js.org/reference/#/p5.Color"
 *                                 target="_blank">p5.Color</a>
 */
class DirectionalLight extends addSpecularColor(WebGLLight) {
  constructor() {
    super([
      "v1, v2, v3, x, y, z",
      "v1, v2, v3, direction",
      "color, x, y, z",
      "color, direction",
    ]);
  }
}
customElements.define("p-directional-light", DirectionalLight);

/**
 * Creates a point light with the given color and position.
 *
 * A point light emits light from a single point in all directions.
 * Because the light is emitted from a specific point (position),
 * it has a different effect when it is positioned farther vs. nearer
 * an object.
 *
 * A maximum of **5** point lights can be active at once.
 *
 * @attribute  {Number}   v1   red or hue value relative to the current color
 *                                range
 * @attribute  {Number}   v2   green or saturation value relative to the
 *                                current color range
 * @attribute  {Number}   v3   blue or brightness value relative to the
 *                                current color range
 * @attribute  {Number}    x   x component of position
 * @attribute  {Number}    y   y component of position
 * @attribute  {Number}    z   z component of position
 * @attribute  {p5.Vector}  position position of light as a <a
 *                            href="https://p5js.org/reference/#/p5.Vector"
 *                            >p5.Vector</a>
 * @attribute  {p5.Color|Number[]|String} color  color as a <a
 *                href="https://p5js.org/reference/#/p5.Color">p5.Color</a>,
 *                as an array, or as a CSS string
 */
class PointLight extends addLightFalloff(addSpecularColor(WebGLLight)) {
  constructor() {
    super([
      "v1, v2, v3, x, y, z",
      "v1, v2, v3, position",
      "color, x, y, z",
      "color, position",
    ]);
  }
}
customElements.define("p-point-light", PointLight);

/**
 * Places an ambient and directional light in the scene.
 * The lights are set to <ambient-light v1="128" v2="128" v3="128"> and
 * <directional-light v1="128" v2="128" v3'="128" x="0" y="0" z="-1">.
 * @element lights
 */
class Lights extends addSpecularColor(WebGLLight) {
  constructor() {
    super([""]);
  }
}
customElements.define("p-lights", Lights);

/**
 * Creates a spot light with the given color, position,
 * light direction, angle, and concentration.
 *
 * Like a ```<point-light>```, a ```<spot-light>```
 * emits light from a specific point (position). It has a different effect
 * when it is positioned farther vs. nearer an object.
 *
 * However, unlike a ```<point-light>```, the light is emitted in **one
 * direction**
 * along a conical shape. The shape of the cone can be controlled using
 * the `angle` and `concentration` parameters.
 *
 * The `angle` parameter is used to
 * determine the radius of the cone. And the `concentration`
 * parameter is used to focus the light towards the center of
 * the cone. Both parameters are optional, however if you want
 * to specify `concentration`, you must also specify `angle`.
 * The minimum concentration value is 1.
 *
 * A maximum of **5** spot lights can be active at once.
 *
 * @element spot-light
 * @attribute  {Number}    v1             red or hue value relative to the
 *                                            current color range
 * @attribute  {Number}    v2             green or saturation value relative
 *                                            to the current color range
 * @attribute  {Number}    v3             blue or brightness value relative
 *                                            to the current color range
 * @attribute  {Number}    x              x component of position
 * @attribute  {Number}    y              y component of position
 * @attribute  {Number}    z              z component of position
 * @attribute  {Number}    rx             x component of light direction
 *                                            (inclusive range of -1 to 1)
 * @attribute  {Number}    ry             y component of light direction
 *                                            (inclusive range of -1 to 1)
 * @attribute  {Number}    rz             z component of light direction
 *                                            (inclusive range of -1 to 1)
 * @attribute  {Number}    angle          angle of cone. Defaults to PI/3
 * @attribute  {Number}    concentration  concentration of cone. Defaults to
 *                                            100
 */
class SpotLight extends addLightFalloff(addSpecularColor(WebGLLight)) {
  constructor() {
    super([
      "v1, v2, v3, x, y, z, rx, ry, rz, [angle], [concentration]",
      "color, position, direction, [angle], [concentration]",
      "v1, v2, v3, position, direction, [angle], [concentration]",
      "color, x, y, z, direction, [angle], [concentration]",
      "color, position, rx, ry, rz, [angle], [concentration]",
      "v1, v2, v3, x, y, z, direction, [angle], [concentration]",
      "v1, v2, v3, position, rx, ry, rz, [angle], [concentration]",
      "color, x, y, z, rx, ry, rz, [angle], [concentration]",
    ]);
  }
}
customElements.define("p-spot-light", SpotLight);

class WebGLCanvas extends addCanvasMethods(
  addCanvasProperties(addP5PropsAndMethods(HTMLCanvasElement))
) {
  #debug_mode;
  #orbit_control;
  static renderer = "webgl";
  constructor() {
    super();
    window.addEventListener("customElementsDefined", this.runCode.bind(this));
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
