export const addTypographyProps = (baseClass) =>
  class extends baseClass {
    #align = ["left", "baseline"];
    /**
     * Sets the current alignment for drawing text. Accepts two
     * values:
     * - first: horizontal alignment (LEFT, CENTER, or RIGHT)
     * - scond: vertical alignment (TOP, BOTTOM, CENTER, or BASELINE).
     *
     * So if you set align="LEFT", you are aligning the left
     * edge of your text to this element's x-coordinate.
     * If you write align="RIGHT, TOP", you are aligning the right edge
     * of your text to this element's x-coordinate and the top edge of the text
     * to this element's y-coordinate.
     * @type {[LEFT|CENTER|RIGHT, TOP|BOTTOM|CENTER|BASELINE]}
     */
    get align() {
      return this.#align;
    }
    set align(val) {
      if (Array.isArray(val)) this.pInst.textAlign(...val);
      else this.pInst.textAlign(val);
      this.#align = [this.pInst._textAlign, this.pInst._textBaseline];
    }
  };
