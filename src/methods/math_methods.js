export const addMathMethods = (baseClass) =>
  class extends baseClass {
    /**
     * Creates a new <a href="#/p5.Vector">p5.Vector</a> (the datatype for storing vectors). This provides a
     * two or three-dimensional vector, specifically a Euclidean (also known as
     * geometric) vector. A vector is an entity that has both magnitude and
     * direction.
     * @param {Number} [x] x component of the vector
     * @param {Number} [y] y component of the vector
     * @param {Number} [z] z component of the vector
     * @return {p5.Vector}
     */
    vector() {
      return this.pInst.createVector(...arguments);
    }
  };
