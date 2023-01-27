export const addDataMethods = (baseClass) =>
  class extends baseClass {
    /**
     *
     * Creates a new instance of p5.StringDict using the key-value pair
     * or the object you provide.
     *
     * @method create_string_dict
     * @param {String} key
     * @param {String} value
     * @returns {p5.StringDict}
     * @method create_string_dict
     * @param {Object} object - key-value pairs
     * @return {p5.StringDict}
     */
    create_string_dict() {
      return this.pInst.createStringDict(...arguments);
    }
    /**
     *
     * Creates a new instance of <a href="#/p5.NumberDict">p5.NumberDict</a> using the key-value pair
     * or object you provide.
     *
     * @method create_number_dict
     * @param {Number} key
     * @param {Number} value
     * @return {p5.NumberDict}
     *
     */
    /**
     * @method create_number_dict
     * @param {Object} object - key-value pairs
     * @return {p5.NumberDict}
     */
    create_number_dict() {
      return this.pInst.createNumberDict(...arguments);
    }
  };
