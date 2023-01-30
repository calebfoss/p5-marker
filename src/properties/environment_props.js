import { wrapMethod } from "../utils/p5Modifiers";

p5.prototype.window_resized = false;
wrapMethod(
  "_onresize",
  (base) =>
    function (e) {
      base.call(this, e);
      this._setProperty("window_resized", true);
    }
);
p5.prototype.registerMethod("post", function () {
  this._setProperty("window_resized", false);
});

class Window {
  #element;
  constructor(element) {
    this.#element = element;
  }
  get #pInst() {
    return this.#element.pInst;
  }
  /**
   * window_resized is true if the window was resized since the last frame
   * and false if not (read-only)
   * @type {boolean}
   * @readonly
   */
  get resized() {
    return this.#pInst.window_resized;
  }
  get width() {
    return this.#pInst.windowWidth;
  }
  get height() {
    return this.#pInst.windowHeight;
  }
}

export const addEnvironmentProps = (baseClass) =>
  class extends baseClass {
    get fullscreen() {
      return this.pInst.fullscreen();
    }
    set fullscreen(val) {
      this.pInst.fullscreen(val);
    }
    /**
     * frame_rate specifies the number of frames to be displayed every second.
     * For example,
     * frame_rate="30" will attempt to refresh 30 times a second.
     * If the processor is not fast enough to maintain the specified rate, the
     * frame rate will not be achieved. The default frame rate is
     * based on the frame rate of the display (here also called "refresh rate"),
     * which is set to 60 frames per second on most computers.
     * A frame rate of 24
     * frames per second (usual for movies) or above will be enough for smooth
     * animations.
     *
     * The canvas must be rendered at least once for frame_rate to have a
     * value.
     * @type {number}
     */
    get frame_rate() {
      return this.pInst._frameRate;
    }
    set frame_rate(val) {
      this.pInst.frameRate(val);
    }
    /**
     * The delta_time property contains the time
     * difference between the beginning of the previous frame and the beginning
     * of the current frame in milliseconds.
     *
     * This variable is useful for creating time sensitive animation or physics
     * calculation that should stay constant regardless of frame rate.
     * (read-only)
     * @readonly
     * @type {number}
     */
    get delta_time() {
      return this.pInst.deltaTime;
    }
    /**
     * screen stores information about the screen displaying the canvas.
     * To get the dimensions of the screen, use:
     * ```
     * screen.width
     * screen.height
     * ```
     * screen is available in any browser and is not specific to this
     * library.
     * The full documentation is here:
     * https://developer.mozilla.org/en-US/docs/Web/API/Screen
     * (read-only)
     * @readonly
     */
    get screen() {
      return screen;
    }
    /**
     * The window object provides information about the window containing the
     * canvas.
     * - window.width   - number: width of the window
     * - window.height  - number: height of the window
     * - window.resized - boolean: true if the window was resized since last
     * frame
     * @type {Object}
     */
    get window() {
      return this.#window;
    }
    #window = new Window(this);
    /**
     * grid_output lays out the
     * content of the canvas in the form of a grid (html table) based
     * on the spatial location of each shape. A brief
     * description of the canvas is available before the table output.
     * This description includes: color of the background, size of the canvas,
     * number of objects, and object types (example: "lavender blue canvas is
     * 200 by 200 and contains 4 objects - 3 ellipses 1 rectangle"). The grid
     * describes the content spatially, each element is placed on a cell of the
     * table depending on its position. Within each cell an element the color
     * and type of shape of that element are available (example: "orange ellipse").
     * These descriptions can be selected individually to get more details.
     * A list of elements where shape, color, location, and area are described
     * (example: "orange ellipse location=top left area=1%") is also available.
     *
     * grid_output="true" and grid_output="FALLBACK"
     * make the output available in
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Hit_regions_and_accessibility" target="_blank">
     * a sub DOM inside the canvas element</a> which is accessible to screen readers.
     * grid_output="LABEL" creates an
     * additional div with the output adjacent to the canvas, this is useful
     * for non-screen reader users that might want to display the output outside
     * of the canvas' sub DOM as they code. However, using LABEL will create
     * unnecessary redundancy for screen reader users. We recommend using LABEL
     * only as part of the development process of a sketch and removing it before
     * publishing or sharing with screen reader users.
     * @type {true|LABEL|FALLBACK}
     */
    get grid_output() {
      return this._accessibleOutputs.grid;
    }
    set grid_output(val) {
      if (val === true) this.pInst.gridOutput();
      else this.pInst.gridOutput(val);
    }
  };
