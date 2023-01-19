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
  };
