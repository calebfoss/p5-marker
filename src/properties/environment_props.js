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

export const addEnvironmentProps = (baseClass) =>
  class extends baseClass {
    /**
     * fullscreen specifies whether the canvas is in fullscreen (true) or not
     * (false).
     * Note that due to browser restrictions this can only
     * be set on user input.
     * @type {boolean}
     */
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
     * window_resized is true if the window was resized since the last frame
     * and false if not (read-only)
     * @type {boolean}
     * @readonly
     */
    get window_resized() {
      return this.pInst.window_resized;
    }
  };
