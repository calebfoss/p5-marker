import { addP5PropsAndMethods } from "../core";
import { addEnvironmentProps } from "../properties/environment_props";
import {
  add2DTransformProps,
  add3DTransformProps,
} from "../properties/transform_props";
import {
  add2DTransformMethods,
  add3DTransformMethods,
} from "../methods/transform_methods";
import { constants } from "../properties/constants";
import { interpret } from "../interpreter/interpreter";

const addCanvasProperties = (baseClass) =>
  class extends baseClass {
    #background;
    #dom_element;
    /**
     * The background property sets the color or image used
     * for the background of the p5.js canvas. The default background is transparent.
     * A <a href="https://p5js.org/reference/#/p5.Color">p5.Color</a> object can be provided to set the background color.
     *
     * A <a href="https://p5js.org/reference/#/p5.Image">p5.Image</a> can also be provided to set the background image.
     *
     * The arguments to <a href="https://p5js.org/reference/#/p5/color">color()</a> can also be provided,
     * separated by commas.
     * @type {p5.Color|p5.Image}
     */
    get background() {
      return this.#background;
    }
    set background(c) {
      if (c instanceof p5.Color || c instanceof p5.Image) this.#background = c;
      else if (c === constants.NONE) this.#background = this.pInst.color(0, 0);
      else this.#background = this.pInst.color(c);
    }
    /**
     * The canvas element rendering on the document.
     * @type {HTMLCanvasElement}
     */
    get canvas_element() {
      return this.pInst.canvas;
    }
    /**
     * Sets the cursor when hovering over the canvas.
     *
     * You can set cursor to any of the following constants:
     * ARROW, CROSS, HAND, MOVE, TEXT and WAIT
     *
     * You may also set cursor to the URL of an image file. The recommended size
     * is 16x16 or 32x32 pixels. (Allowed File extensions: .cur, .gif, .jpg, .jpeg, .png)
     *
     * For more information on Native CSS cursors and url visit:
     * https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
     *
     * You may also set cursor to "type, x, y", where type is one of the types above,
     * x is the horizontal active spot of the cursor (must be less than 32)
     * and
     * y is the vertical active spot of the cursor (must be less than 32)
     * @type {string}
     */
    get cursor() {
      return this.style.cursor;
    }
    set cursor(val) {
      const { pInst } = this;
      if (val === this.NONE) pInst.noCursor();
      else if (Array.isArray(val)) pInst.cursor(...val);
      else pInst.cursor(val);
    }

    /**
     * The height of the canvas in pixels.
     * @type {number}
     */
    get height() {
      return this.pInst.height;
    }
    set height(val) {
      if (isNaN(val)) {
        console.error(
          `The canvas' height was set to ${val}, but it can only be set to a number`
        );
        return;
      }
      if (val === this.height) return;
      this.pInst.resizeCanvas(this.width, val);
    }
    get orderedAttributeNames() {
      //  Remove 'is' and 'style' from attrNames
      return super.orderedAttributeNames.filter(
        (v) => v !== "is" && v != "style"
      );
    }
    get marker_element() {
      return this;
    }
    /**
     * Array containing the values for all the pixels in the display window.
     * These values are numbers. This array is the size (include an appropriate
     * factor for pixel_density) of the display window x4,
     * representing the R, G, B, A values in order for each pixel, moving from
     * left to right across each row, then down each column. Retina and other
     * high density displays may have more pixels (by a factor of
     * pixel_density^2).
     * For example, if the image is 100×100 pixels, there will be 40,000. With
     * pixel_density = 2, there will be 160,000. The first four values
     * (indices 0-3) in the array will be the R, G, B, A values of the pixel at
     * (0, 0). The second four values (indices 4-7) will contain the R, G, B, A
     * values of the pixel at (1, 0).
     * @type {number[]}
     */
    get pixels() {
      this.pInst.loadPixels();
      return this.pInst.pixels;
    }
    set pixels(px) {
      this.pInst.pixels = px;
      this.pInst.updatePixels();
    }
    set loop(val) {
      if (val) this.pInst.loop();
      else this.pInst.noLoop();
    }
    /**
     * The width of the canvas in pixels.
     * @type {number}
     */
    get width() {
      return this.pInst.width;
    }
    set width(val) {
      if (isNaN(val)) {
        console.error(
          `The canvas' width was set to ${val}, but it can only be set to a number`
        );
        return;
      }
      if (val === this.width) return;
      this.pInst.resizeCanvas(val, this.height);
    }
  };

const addCanvasMethods = (baseClass) =>
  class extends baseClass {
    attributeInherited(attributeName) {
      if (this.hasAttribute(attributeName)) return true;
      return super.attributeInherited(attributeName);
    }
    create_element(tagName) {
      const firstTryElement = document.createElement(tagName);
      if (firstTryElement.constructor.name !== "HTMLUnknownElement") {
        if (tagName.slice(0, 2) === "p-") {
          this.marker_element.appendChild(firstTryElement);
          firstTryElement.setup(this.pInst, this.canvas);
          return firstTryElement;
        } else return this.pInst.createElement(tagName);
      }
      firstTryElement.remove();
      const secondTryElement = document.createElement(`p-${tagName}`);
      if (secondTryElement.constructor.name === "HTMLUnknownElement") {
        console.error(
          `create_element() was called with tag ${tagName}, but this is not a recognized tag. ` +
            `This may be due to a difference in spelling.`
        );
      } else {
        this.marker_element.appendChild(secondTryElement);
        secondTryElement.setup(this.pInst, this.canvas);
      }
      return secondTryElement;
    }
    runCode() {
      const markerCanvas = this;
      const sketch = (pInst) => {
        pInst.preload = () => pInst.loadAssets();

        pInst.setup = function () {
          markerCanvas.setup(pInst, markerCanvas);
          const canvasWidth = markerCanvas.hasAttribute("width")
            ? interpret(
                markerCanvas,
                "width",
                markerCanvas.getAttribute("width")
              )()
            : markerCanvas.window.width;
          const canvasHeight = markerCanvas.hasAttribute("height")
            ? interpret(
                markerCanvas,
                "height",
                markerCanvas.getAttribute("height")
              )()
            : markerCanvas.window.height;
          pInst.createCanvas(
            canvasWidth,
            canvasHeight,
            markerCanvas.constructor.renderer
          );
          //  Set default background to light gray
          markerCanvas.background = pInst.color(220);
          if (markerCanvas.style.display === "")
            markerCanvas.style.display = "none";
        };
        pInst.draw = function () {
          if (markerCanvas.orbit_control) markerCanvas.pInst.orbitControl();
          markerCanvas.draw();
        };
      };
      new p5(sketch);
    }
    render() {
      this.pInst.background(this.background);
    }
  };

/**
 * The `<canvas>` element is a rectangular area of the window for rendering
 * imagery. All child elements are rendered to the canvas.
 *
 * This canvas will render 2D elements only. For a 3D canvas, use
 * ```<canvas-3d>```.
 */
class Canvas extends addCanvasMethods(
  addCanvasProperties(
    addP5PropsAndMethods(
      addEnvironmentProps(
        add2DTransformProps(add2DTransformMethods(HTMLElement))
      )
    )
  )
) {
  static renderer = "p2d";

  constructor() {
    super();
    window.addEventListener("customElementsDefined", this.runCode.bind(this));
  }
}
customElements.define("p-canvas", Canvas);

/**
 * The ```<canvas-3d>``` element is a ```<canvas>``` element
 * for rendering 3D elements.
 */
class WebGLCanvas extends addCanvasMethods(
  addCanvasProperties(
    addP5PropsAndMethods(
      addEnvironmentProps(
        add3DTransformProps(add3DTransformMethods(HTMLElement))
      )
    )
  )
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
    this.#orbit_control = val;
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
customElements.define("p-canvas-3d", WebGLCanvas);
