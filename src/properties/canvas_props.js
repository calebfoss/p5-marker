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
   * separated by commas."
   * @type {p5.Color|p5.Image}
   */
    get background() {
      return this.#background;
    }
    set background(c) {
      if (c instanceof p5.Color || c instanceof p5.Image) this.#background = c;
      this.#background = this.pInst.color(c);
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
