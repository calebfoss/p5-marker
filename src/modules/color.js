import { defineSnakeAlias, defineProperties } from "../utils/p5Modifiers";
import { P5Function } from "./core";

defineSnakeAlias("lerpColor");

p5.prototype.NONE = "#0000";

export class ColorFunction extends P5Function {
  constructor(overloads, renderFunctionName) {
    /**
     * @private
     */
    overloads = [
      "v1, v2, v3, [alpha]",
      "value",
      "gray, [alpha]",
      "values",
      "c",
      ...overloads,
    ];
    super(overloads, renderFunctionName);
  }
}

//  TODO - Less hacky way to set color before initializing p5?
const transparent = p5.prototype.color.call(
  {
    _colorMode: "rgb",
    _colorMaxes: { rgb: [255, 255, 255, 255] },
  },
  0,
  0
);
p5.prototype.setErase = p5.prototype.erase;
defineProperties({
  stroke_color: {
    get: function () {
      if (!this.drawingContext) return "";
      return this.color(this.drawingContext.strokeStyle);
    },
    set: function (val) {
      if (val === this.NONE) this.noStroke();
      else this.stroke(val);
    },
  },
  erase: {
    get: function () {
      return this._isErasing;
    },
    set: function (val) {
      if (val === true) this.setErase();
      else if (Array.isArray(val)) this.setErase(...val);
      else this.setErase(val);
    },
  },
});
/**
 * Clears the pixels within a buffer. This element only clears the canvas.
 * It will not clear objects created by create_x() functions such as
 * create_video() or create_div().
 * Unlike the main graphics context, pixels in additional graphics areas created
 * with create_graphics() can be entirely
 * or partially transparent. This element clears everything to make all of
 * the pixels 100% transparent.
 *
 * Note: In WebGL mode, this element can have attributes set to normalized RGBA
 * color values in order to clear the screen to a specific color.
 * In addition to color, it will also clear the depth buffer.
 * If you are not using the webGL renderer these color values will have no
 * effect.
 *
 * @element clear
 * @attribute {Number} r normalized red val.
 * @attribute {Number} g normalized green val.
 * @attribute {Number} b normalized blue val.
 * @attribute {Number} a normalized alpha val.
 */
class Clear extends P5Function {
  constructor() {
    super(["", "r, g, b, a"]);
  }
}
customElements.define("p-clear", Clear);

/**
 * The ```<paint-bucket>``` element fills the canvas with a particular color or
 * image.
 *
 * @element paint-bucket
 * @attribute {p5.Color} color  any value created by the <a href="#/p5/color">color
 * @attribute {String} colorstring color string, possible formats include: integer
 *                         rgb() or rgba(), percentage rgb() or rgba(),
 *                         3-digit hex, 6-digit hex
 * @attribute {Number} [a]         opacity of the background relative to current
 *                             color range (default is 0-255)
 * @attribute {Number} gray   specifies a value between white and black
 * @attribute {Number} v1     red or hue value (depending on the current color
 *                        mode)
 * @attribute {Number} v2     green or saturation value (depending on the current
 *                        color mode)
 * @attribute {Number} v3     blue or brightness value (depending on the current
 *                        color mode)
 * @attribute  {Number[]}      values  an array containing the red, green, blue
 *                                 and alpha components of the color
 * @attribute {p5.Image} image    image loaded via an ```<asset>``` (must be
 *                                  same size as the sketch window)
 */
class PaintBucket extends ColorFunction {
  constructor() {
    super(
      ["colorstring, [a]", "gray, [a]", "image, [a]", "v1, v2, v3, [a]"],
      "background"
    );
  }
}
customElements.define("p-paint-bucket", PaintBucket);
