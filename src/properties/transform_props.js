const addAnchor = (baseClass) =>
  class extends baseClass {
    #anchor = new p5.Vector();
    get anchor() {
      return this.#anchor;
    }
    set anchor(val) {
      const { pInst } = this;
      if (val instanceof p5.Vector) this.#anchor = val;
      else if (Array.isArray(val)) this.#anchor = pInst.createVector(...val);
      else this.#anchor = createVector(val);
    }
  };

export const add2DTransformProps = (baseClass) =>
  class extends addAnchor(baseClass) {
    #angle = 0;
    #apply_matrix = new DOMMatrix();
    #transform_matrix = new DOMMatrix();
    #reset_transform = false;

    /**
     * The angle of rotation for the element and its children. The unit for
     * angles may be set with angle_mode.
     * @type {number}
     */
    get angle() {
      return this.#angle;
    }
    set angle(val) {
      this.#angle = val;
    }
    /**
     * transform_matrix stores the result of all the transformation
     * properties applied to this element.
     * @type {DOMMatrix}
     */
    get transform_matrix() {
      return this.#transform_matrix;
    }
    /**
     * Multiplies the current matrix by the one specified through the values.
     * This is a powerful operation that can perform the equivalent of translate,
     * scale, shear and rotate all at once. You can learn more about transformation
     * matrices on <a href="https://en.wikipedia.org/wiki/Transformation_matrix">
     * Wikipedia</a>.
     *
     * If set to a comma-separated list of numbers, these number will first be
     * passed into the
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix">
     * DOMMatrix</a> constructor.
     * @type {DOMMatrix}
     */
    get apply_transform() {
      return this.#apply_matrix;
    }
    set apply_transform(val) {
      if (val instanceof DOMMatrix) this.#apply_matrix = val;
      else this.#apply_matrix = new DOMMatrix(val);
    }
    /**
     * If set to true, this resets the transformations applied to this element,
     * its children, and the siblings below this element. This overrides
     * transformation properties such as anchor, angle, scale, and shear.
     */
    get reset_transform() {
      return this.#reset_transform;
    }
    set reset_transform(val) {
      this.#reset_transform = val;
    }
    canvas_to_local_position(x = 0, y = 0, z = 0) {
      if (arguments[0] instanceof p5.Vector) {
        const { x: vx, y: vy, z: vz } = arguments[0];
        x = vx;
        y = vy;
        z = vz;
      }
      const canvas_position = new DOMPoint(x, y, z);
      const inverted_matrix = this.transform_matrix.inverse();
      const scaled_matrix = inverted_matrix.scale(1 / this.pInst.pixel_density);
      const canvas_point = scaled_matrix.transformPoint(canvas_position);
      return this.pInst.createVector(
        canvas_point.x,
        canvas_point.y,
        canvas_point.z
      );
    }
    local_to_canvas_position(x = 0, y = 0, z = 0) {
      if (arguments[0] instanceof p5.Vector) {
        const { x: vx, y: vy, z: vz } = arguments[0];
        x = vx;
        y = vy;
        z = vz;
      }
      const local_position = new DOMPoint(x, y, z);
      const scaled_matrix = this.transform_matrix.scale(
        1 / this.pInst.pixel_density
      );
      const local_point = scaled_matrix.transformPoint(local_position);
      return this.pInst.createVector(
        local_point.x,
        local_point.y,
        local_point.z
      );
    }
    transform() {
      if (this.reset_transform) {
        this.pInst.resetMatrix();
      } else {
        const transform_matrix = new DOMMatrix();
        const translated_matrix = transform_matrix.translate(
          this.anchor.x,
          this.anchor.y
        );
        const rotated_matrix = translated_matrix.rotate(this.angle);
        const applied_matrix = rotated_matrix.multiply(this.apply_transform);
        const { a, b, c, d, e, f } = applied_matrix;
        this.pInst.drawingContext.transform(a, b, c, d, e, f);
      }
      this.#transform_matrix = this.pInst.drawingContext.getTransform();
    }
  };

export const add3DTransformProps = (baseClass) =>
  class extends addAnchor(baseClass) {
    #angle_x = 0;
    #angle_y = 0;
    #angle_z = 0;
    /**
     * The angle of rotation along the x-axis for the element and its children.
     * The unit for angles may be set with angle_mode.
     * @type {number}
     */
    get angle_x() {
      return this.#angle_x;
    }
    set angle_x(val) {
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
      this.#angle_z = val;
    }
    transform() {
      this.pInst.translate(this.anchor.x, this.anchor.y, this.anchor.z);
      this.pInst.rotateX(this.angle_x);
      this.pInst.rotateY(this.angle_y);
      this.pInst.rotateZ(this.angle_z);
    }
  };
