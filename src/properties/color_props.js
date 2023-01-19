export const addColorConstants = (baseClass) =>
  class extends baseClass {
    get NONE() {
      return "#0000";
    }
  };

export const addStroke = (baseClass) =>
  class extends baseClass {
    #stroke;
    #stroke_weight;
    /**
     * Sets the color used to draw lines and borders around shapes. This color
     * is either a <a href="#/p5.Color">p5.Color</a> object or a comma
     * separated list of values to pass into
     * <a href="https://p5js.org/reference/#/p5/color">color()</a>.
     * @type {p5.Color}
     */
    get stroke() {
      return this.#stroke;
    }
    set stroke(val) {
      const { pInst } = this;
      if (val === this.NONE) pInst.noStroke();
      else pInst.stroke(val);
      this.#stroke = pInst.color(
        pInst._renderer.isP3D
          ? pInst._renderer.curStrokeColor
          : pInst.drawingContext.strokeStyle
      );
    }
    /**
     * Sets the width of the stroke used for lines, points and the border around
     * shapes. All widths are set in units of pixels.
     *
     * Note that it is affected by any transformation or scaling that has
     * been applied previously.
     * @type {number}
     */
    get stroke_weight() {
      return this.#stroke_weight;
    }
    set stroke_weight(val) {
      this.pInst.strokeWeight(val);
      this.#stroke_weight = this.pInst._renderer.isP3D
        ? this.pInst._renderer.curStrokeWeight
        : this.pInst.drawingContext.lineWidth;
    }
  };

export const addFillStroke = (baseClass) =>
  class extends addStroke(baseClass) {
    #fill;
    /**
     * Sets the color used to fill shapes. This may be a
     * <a href="https://p5js.org/reference/#/p5.Color">p5.Color</a> object or
     * a comma separated list of values to pass into
     * <a href="https://p5js.org/reference/#/p5/color">color()</a>.
     * @type {p5.Color}
     */
    get fill() {
      return this.#fill;
    }
    set fill(val) {
      const { pInst } = this;
      if (val === this.NONE) pInst.noFill();
      else pInst.fill(val);
      this.#fill = pInst.color(
        pInst._renderer.isP3D
          ? pInst._renderer.curFillColor
          : pInst.drawingContext.fillStyle
      );
    }
  };
