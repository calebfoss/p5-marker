export const addColorConstants = (baseClass) =>
  class extends baseClass {
    get NONE() {
      return "#0000";
    }
  };

export const addStroke = (baseClass) =>
  class extends baseClass {
    #stroke;
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
