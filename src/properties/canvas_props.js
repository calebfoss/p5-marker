export const addCanvasProperties = (baseClass) =>
  class extends baseClass {
    #background;
    /**
     * The background property sets the color or image used
     * for the background of the p5.js canvas. The default background is transparent.
     * A <a href="https://p5js.org/reference/#/p5.Color">p5.Color</a> object can be provided to set the background color.
     *
     * A <a href="https://p5js.org/reference/#/p5.Image">p5.Image</a> can also be provided to set the background image.
     *
     * The arguments to <a href="https://p5js.org/reference/#/p5/color">color()</a> can also be provided,
     * separated by commas.
     * @type {p5.Color|p5.Image}
     */
    get background() {
      return this.#background;
    }
    set background(c) {
      if (c instanceof p5.Color || c instanceof p5.Image) this.#background = c;
      this.#background = this.pInst.color(c);
    }
    /**
     * Sets the cursor when hovering over the canvas.
     *
     * You can set cursor to any of the following constants:
     * ARROW, CROSS, HAND, MOVE, TEXT and WAIT
     *
     * You may also set cursor to the URL of an image file. The recommended size
     * is 16x16 or 32x32 pixels. (Allowed File extensions: .cur, .gif, .jpg, .jpeg, .png)
     *
     * For more information on Native CSS cursors and url visit:
     * https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
     *
     * You may also set cursor to "type, x, y", where type is one of the types above,
     * x is the horizontal active spot of the cursor (must be less than 32)
     * and
     * y is the vertical active spot of the cursor (must be less than 32)
     * @type {string}
     */
    get cursor() {
      return this.style.cursor;
    }
    set cursor(val) {
      const { pInst } = this;
      if (val === this.NONE) pInst.noCursor();
      else if (Array.isArray(val)) pInst.cursor(...val);
      else pInst.cursor(val);
    }
    get description() {
      const { pInst } = this;
      const cnvId = this.id;
      const descContainer = pInst.dummyDOM.querySelector(
        `#${cnvId}_Description`
      );
      if (descContainer) return descContainer;
      const labelContainer = pInst.dummyDOM.querySelector(`#${cnvId}_Label`);
      return labelContainer;
    }
    set description(val) {
      if (Array.isArray(val)) this.pInst.describe(...val);
      else this.pInst.describe(val);
    }
    /**
     * The height of the canvas in pixels.
     * @type {number}
     */
    get height() {
      return this.pInst.height;
    }
    set height(val) {
      if (val === this.height || isNaN(val)) return;
      this.#resize(this.width, val);
    }
    get orderedAttributeNames() {
      //  Remove 'is' and 'style' from attrNames
      return super.orderedAttributeNames.filter(
        (v) => v !== "is" && v != "style"
      );
    }
    /**
     * Array containing the values for all the pixels in the display window.
     * These values are numbers. This array is the size (include an appropriate
     * factor for pixel_density) of the display window x4,
     * representing the R, G, B, A values in order for each pixel, moving from
     * left to right across each row, then down each column. Retina and other
     * high density displays may have more pixels (by a factor of
     * pixel_density^2).
     * For example, if the image is 100×100 pixels, there will be 40,000. With
     * pixel_density = 2, there will be 160,000. The first four values
     * (indices 0-3) in the array will be the R, G, B, A values of the pixel at
     * (0, 0). The second four values (indices 4-7) will contain the R, G, B, A
     * values of the pixel at (1, 0).
     * @type {number[]}
     */
    get pixels() {
      this.pInst.loadPixels();
      return this.pInst.pixels;
    }
    set pixels(px) {
      this.pInst.pixels = px;
      this.pInst.updatePixels();
    }
    set loop(val) {
      if (val) this.pInst.loop();
      else this.pInst.noLoop();
    }
    #resize(w, h) {
      if (w === this.width && h === this.height) return;
      const { pInst } = this;
      const props = {};
      for (const key in pInst.drawingContext) {
        const val = pInst.drawingContext[key];
        if (typeof val !== "object" && typeof val !== "function") {
          props[key] = val;
        }
      }
      pInst.width = pInst._renderer.width = w;
      pInst.height = pInst._renderer.height = h;
      this.setAttribute("width", w * pInst._pixelDensity);
      this.setAttribute("height", h * pInst._pixelDensity);
      this.style.width = `${w}px`;
      this.style.height = `${h}px`;
      pInst.drawingContext.scale(pInst._pixelDensity, pInst._pixelDensity);
      for (const savedKey in props) {
        try {
          pInst.drawingContext[savedKey] = props[savedKey];
        } catch (err) {}
      }
      pInst.drawingContext.scale(pInst._pixelDensity, pInst._pixelDensity);
      pInst.redraw();
    }
    /**
     * The width of the canvas in pixels.
     * @type {number}
     */
    get width() {
      return this.pInst.width;
    }
    set width(val) {
      if (val === this.width || isNaN(val)) return;
      this.#resize(val, this.height);
    }
  };
