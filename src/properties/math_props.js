export const addMathProps = (baseClass) =>
  class extends baseClass {
    #angle_mode = p5.RADIANS;
    #perlin_octaves = 4;
    #perlin_amp_falloff = 0.5;
    #noise_seed;
    #random_seed;

    get angle_mode() {
      return this.#angle_mode;
    }
    set angle_mode(mode) {
      this.pInst.angleMode(mode);
      this.#angle_mode = this.pInst._angleMode;
    }
    /**
     * math provides access to the built-in Math object available on browsers.
     * The reference for the Math object is available at
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math.
     */
    get math() {
      return Math;
    }
    /**
     * Adjusts the character and level of detail produced by the Perlin noise
     * method. This must be set to a comma-separated list of 2 numbers:
     * 1. lod: number of octaves to be used by the noise
     * 2. falloff:  falloff factor for each octave
     *
     * Similar to harmonics in physics, noise is computed over
     * several octaves. Lower octaves contribute more to the output signal and
     * as such define the overall intensity of the noise, whereas higher octaves
     * create finer-grained details in the noise sequence.
     *
     * By default, noise is computed over 4 octaves with each octave contributing
     * exactly half as much as its predecessor, starting at 50% strength for the 1st
     * octave. This falloff amount can be changed by adding an additional function
     * parameter. Eg. a falloff factor of 0.75 means each octave will now have
     * 75% impact (25% less) of the previous lower octave. Any value between
     * 0.0 and 1.0 is valid, however, note that values greater than 0.5 might
     * result in greater than 1.0 values returned by noise().
     *
     * By changing these values, the signal created by the noise()
     * method can be adapted to fit very specific needs and characteristics.
     * @type {[number, number]}
     */
    get noise_detail() {
      return [this.#perlin_octaves, this.#perlin_amp_falloff];
    }
    set noise_detail(val) {
      this.pInst.noiseDetail(...val);
    }
    /**
     * Sets the seed value for noise(). By default,
     * noise() produces different results each time
     * the program is run. Set the `seed` value to a constant to return
     * the same pseudo-random numbers each time the software is run.
     * If a seed has not been set, noise_seed will be undefined.
     * @type {number}
     */
    get noise_seed() {
      return this.#noise_seed;
    }
    set noise_seed(val) {
      this.pInst.noiseSeed(val);
    }
    /**
     * Sets the seed value for random().
     *
     * By default, random() produces different results each time the program
     * is run. Set random_seed to a constant to return the same
     * pseudo-random numbers each time the software is run. If a seed has not
     * been set, random_seed will be undefined.
     * @type {number}
     */
    get random_seed() {
      return this.#random_seed;
    }
    set random_seed(val) {
      this.pInst.randomSeed(val);
      this.#random_seed = val;
    }
  };
