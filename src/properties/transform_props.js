export const add2DTransformProps = (baseClass) =>
  class extends baseClass {
    #angle = 0;
    /**
     * The angle of rotation for the element and its children. The unit for
     * angles may be set with angle_mode.
     * @type {number}
     */
    get angle() {
      return this.#angle;
    }
    set angle(val) {
      this.pInst.rotate(val);
      this.#angle = val;
    }
  };

export const add3DTransformProps = (baseClass) =>
  class extends baseClass {
    #angle_x;
    #angle_y;
    #angle_z;
    /**
     * The angle of rotation along the x-axis for the element and its children.
     * The unit for angles may be set with angle_mode.
     * @type {number}
     */
    get angle_x() {
      return this.#angle_x;
    }
    set angle_x(val) {
      this.pInst.rotateX(val);
      this.#angle_x = val;
    }
    /**
     * The angle of rotation along the y-axis for the element and its children.
     * The unit for angles may be set with angle_mode.
     * @type {number}
     */
    get angle_y() {
      return this.#angle_y;
    }
    set angle_y(val) {
      this.pInst.rotateY(val);
      this.#angle_y = val;
    }
    /**
     * The angle of rotation along the z-axis for the element and its children.
     * The unit for angles may be set with angle_mode.
     * @type {number}
     */
    get angle_z() {
      return this.#angle_z;
    }
    set angle_z(val) {
      this.pInst.rotateZ(val);
      this.#angle_z = val;
    }
  };
