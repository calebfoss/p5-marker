const addAnchor = (baseClass) =>
  class extends baseClass {
    #anchor = new p5.Vector();
    /**
     * This element and its children are positioned and transformed relative to
     * the anchor position.
     *
     * Setting anchor to one or more comma-separated numbers will result in the
     * values being passed into create_vector and anchor being set to the
     * resulting vector.
     * @type {p5.Vector}
     */
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

const add2DAngle = (baseClass) =>
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
      this.#angle = val;
    }
  };

const addScale = (baseClass) =>
  class extends baseClass {
    #scale = new p5.Vector(1, 1, 1);
    /**
     * Increases or decreases the size of an element by expanding or contracting
     * vertices. Objects always scale from their anchor point. Scale values are
     * specified as decimal percentages.
     * For example, the setting scale="2.0" increases the dimension of a
     * shape by 200%.
     *
     * Transformations apply to this element and its children. Children's
     * scale will multiply the effect. For example, setting scale="2.0"
     * and then setting scale="1.5" on the child will cause the child to be 3x
     * its size.
     *
     * Setting this to a comma-separated list of numbers will result in those
     * values being passed into create_vector and the resulting vector being set
     * as the scale. Setting this to a single number will set the scale vector
     * to that value in the x, y, and z direction.
     *  @type {p5.Vector}
     */
    get scale() {
      return this.#scale;
    }
    set scale(val) {
      if (val instanceof p5.Vector) this.#scale = val;
      if (Array.isArray(val)) this.#scale = new p5.Vector(...val);
      this.#scale = new p5.Vector(val, val, val);
    }
  };

const addShear = (baseClass) =>
  class extends baseClass {
    #shear_x = 0;
    #shear_y = 0;
    get shear_x() {
      return this.#shear_x;
    }
    set shear_x(val) {
      this.#shear_x = val;
    }
    get shear_y() {
      return this.#shear_y;
    }
    set shear_y(val) {
      this.#shear_y = val;
    }
  };

const addMatrixProps = (baseClass) =>
  class extends baseClass {
    #apply_matrix = new DOMMatrix();
    #reset_transform = false;

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
  };

export const add2DTransformProps = (baseClass) =>
  class extends addAnchor(
    add2DAngle(addScale(addShear(addMatrixProps(baseClass))))
  ) {};

const add3DAngle = (baseClass) =>
  class extends baseClass {
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
  };

export const add3DTransformProps = (baseClass) =>
  class extends addAnchor(add3DAngle(addScale(addShear(baseClass)))) {};
