import {
  defineProperties,
  defineRendererGetterSetters,
} from "../utils/p5Modifiers";
import { RenderedElement } from "../core";
import { addWidthHeight, addXY } from "./shape";

/**
 * Draw an image to the canvas.
 *
 * This element can be used with different numbers of attributes. The
 * simplest use requires only three attributes: img, x, and y—where (x, y) is
 * the position of the image. Two more attributes can optionally be added to
 * specify the width and height of the image.
 *
 * This element can also be used with eight Number attributes. To
 * differentiate between all these attributes, p5.js uses the language of
 * "destination rectangle" (which corresponds to "dx", "dy", etc.) and "source
 * image" (which corresponds to "sx", "sy", etc.) below. Specifying the
 * "source image" dimensions can be useful when you want to display a
 * subsection of the source image instead of the whole thing.
 *
 * This element can also be used to draw images without distorting the original aspect ratio,
 * by adding 9th attribute, fit, which can either be COVER or CONTAIN.
 * CONTAIN, as the name suggests, contains the whole image within the specified destination box
 * without distorting the image ratio.
 * COVER covers the entire destination box.
 *
 *
 *
 * @element image
 * @attribute  {p5.Image|p5.Element|p5.Texture} img    the image to display
 * @attribute  {p5.Image|p5.Element|p5.Texture} img
 * @attribute  {Number}   dx     the x-coordinate of the destination
 *                           rectangle in which to draw the source image
 * @attribute  {Number}   dy     the y-coordinate of the destination
 *                           rectangle in which to draw the source image
 * @attribute  {Number}   dWidth  the width of the destination rectangle
 * @attribute  {Number}   dHeight the height of the destination rectangle
 * @attribute  {Number}   sx     the x-coordinate of the subsection of the source
 * image to draw into the destination rectangle
 * @attribute  {Number}   sy     the y-coordinate of the subsection of the source
 * image to draw into the destination rectangle
 * @attribute {Number}    [sWidth] the width of the subsection of the
 *                           source image to draw into the destination
 *                           rectangle
 * @attribute {Number}    [sHeight] the height of the subsection of the
 *                            source image to draw into the destination rectangle
 * @attribute {Constant} [fit] either CONTAIN or COVER
 * @attribute {Constant} [xAlign] either LEFT, RIGHT or CENTER default is CENTER
 * @attribute {Constant} [yAlign] either TOP, BOTTOM or CENTER default is CENTER
 */
class Image extends addXY(addWidthHeight(RenderedElement)) {
  constructor() {
    super([
      "img, x, y, [width], [height]",
      "img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight]",
    ]);
  }
  /**
   * Sets the fill value for displaying images. Images can be tinted to
   * specified colors or made transparent by including an alpha value.
   *
   * To apply transparency to an image without affecting its color, use
   * white as the tint color and specify an alpha value. For instance,
   * tint(255, 128) will make an image 50% transparent (assuming the default
   * alpha range of 0-255, which can be changed with color_mode.
   *
   * The value for the gray parameter must be less than or equal to the current
   * maximum value as specified by color_mode. The default maximum value is
   * 255.
   *
   * @type {p5.Color}
   */
  get tint() {
    return this.pInst.color(this.pInst._renderer._tint);
  }
  set tint(val) {
    if (val === this.pInst.NONE) this.pInst.noTint();
    else this.pInst.tint(...arguments);
  }
}
customElements.define("p-image", Image);

defineRendererGetterSetters("imageMode");

defineProperties({
  canvas_pixels: {
    get: function () {
      this.loadPixels();
      return this.pixels;
    },
    set: function (px) {
      this.pixels = px;
      this.updatePixels();
    },
  },
});
