export const addEnvironmentProps = (baseClass) =>
  class extends baseClass {
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
  };
