const addPositionConverters = (baseClass) =>
  class extends baseClass {
    /**
     * Converts a position on the canvas to a position in
     * this element's transformed space.
     * @param {p5.Vector} canvas_position
     * @returns {p5.Vector} local_position
     */
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
    /**
     * Converts a position in this element's transformed space to a
     * position on the canvas.
     * @param {p5.Vector} local_position
     * @returns {p5.Vector} canvas_position
     */
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
  };

export const add2DTransformMethods = (baseClass) =>
  class extends addPositionConverters(baseClass) {
    #transform_matrix = new DOMMatrix();
    /**
     * transform_matrix stores the result of all the transformation
     * properties applied to this element. (read-only)
     * @type {DOMMatrix}
     * @readonly
     */
    get transform_matrix() {
      return this.#transform_matrix;
    }
    /**
     * @private
     */
    transform() {
      if (this.reset_transform) {
        this.pInst.resetMatrix();
      } else {
        const shear_x_rads = this.pInst._toRadians(this.shear_x);
        const shear_y_rads = this.pInst._toRadians(this.shear_y);
        const shear_x_matrix = new DOMMatrix([
          1,
          0,
          Math.tan(shear_x_rads),
          1,
          0,
          0,
        ]);
        const shear_y_matrix = new DOMMatrix([
          1,
          Math.tan(shear_y_rads),
          0,
          1,
          0,
          0,
        ]);
        const transform_matrix = new DOMMatrix()
          .translate(this.anchor.x, this.anchor.y)
          .scale(this.scale.x, this.scale.y)
          .rotate(this.angle)
          .multiply(shear_x_matrix)
          .multiply(shear_y_matrix)
          .multiply(this.apply_transform);
        const { a, b, c, d, e, f } = transform_matrix;
        this.pInst.drawingContext.transform(a, b, c, d, e, f);
      }
      this.#transform_matrix = this.pInst.drawingContext.getTransform();
    }
  };

export const add3DTransformMethods = (baseClass) =>
  class extends addPositionConverters(baseClass) {
    transform() {
      this.pInst.translate(this.anchor.x, this.anchor.y, this.anchor.z);
      this.pInst.scale(this.scale.x, this.scale.y, this.scale.z);
      this.pInst.rotateX(this.angle_x);
      this.pInst.rotateY(this.angle_y);
      this.pInst.rotateZ(this.angle_z);
      this.pInst.shearX(this.shear_x);
      this.pInst.shearY(this.shear_y);
    }
  };
