export const addTypographyProps = (baseClass) =>
  class extends baseClass {
    #align = [p5.prototype.LEFT, p5.prototype.BASELINE];
    #leading = 15;
    #font_size = 12;
    #style = p5.prototype.NORMAL;
    #wrap = p5.prototype.WORD;
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
      this.#align = [
        this.pInst._renderer._textAlign,
        this.pInst._renderer._textBaseline,
      ];
    }
    /**
     * Sets the spacing, in pixels, between lines of text.
     * @type {number}
     */
    get leading() {
      return this.#leading;
    }
    set leading(val) {
      this.pInst.textLeading(val);
      this.#leading = this.pInst._renderer._textLeading;
    }
    /**
     * The font size in pixels.
     * @type {number}
     */
    get font_size() {
      return this.#font_size;
    }
    set font_size(val) {
      this.pInst.textSize(val);
      this.#font_size = this.pInst._renderer._textSize;
    }
    /**
     * The style for text.
     * @type {NORMAL|ITALIC|BOLDITALIC}
     */
    get style() {
      return this.#style;
    }
    set style(val) {
      this.pInst.textStyle(val);
      this.#style = this.pInst._renderer._textStyle;
    }
    /**
     * Specifies how lines of text are wrapped within a text box. This requires
     * width to be set on this element.
     *
     * WORD wrap style only breaks lines at spaces. A single string without spaces
     * that exceeds the boundaries of the canvas or text area is not truncated,
     * and will overflow the desired area, disappearing at the canvas edge.
     *
     * CHAR wrap style breaks lines wherever needed to stay within the text box.
     *
     * WORD is the default wrap style, and both styles will still break lines at
     * any line breaks specified in the original text. The text height property also
     * still applies to wrapped text in both styles, lines of text that do not fit
     * within the text area will not be drawn to the screen.
     * @type {WORD|CHAR}
     */
    get wrap() {
      return this.#wrap;
    }
    set wrap(val) {
      this.pInst.textWrap(val);
      this.#wrap = this.pInst._renderer._textWrap;
    }
  };
