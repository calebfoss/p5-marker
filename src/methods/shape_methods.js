export const addBezierPoint = (baseClass) =>
  class extends baseClass {
    /**
     * Evaluates the position on the bezier at t. t is the
     * resultant point which is given between 0 (start of Bezier) and 1 (end of Bezier).
     *
     * @param {number} t - value between 0 and 1
     * @returns {p5.Vector} - position on Bezier at t
     */
    point_at(t) {
      const x = this.pInst.bezierPoint(this.x1, this.x2, this.x3, this.x4, t);
      const y = this.pInst.bezierPoint(this.y1, this.y2, this.y3, this.y4, t);
      return this.pInst.createVector(x, y);
    }
  };

export const addCurvePoint = (baseClass) =>
  class extends baseClass {
    /**
     * Evaluates the position on the curve at t.
     * t is between 0 (start of curve) and 1 (end of curve).
     *
     * @param {number} t - value between 0 and 1
     * @returns {p5.Vector} - tangent of curve at t
     */
    point_at(t) {
      const x = this.pInst.curvePoint(this.x1, this.x2, this.x3, this.x4, t);
      const y = this.pInst.curvePoint(this.y1, this.y2, this.y3, this.y4, t);
      return this.pInst.createVector(x, y);
    }
  };
