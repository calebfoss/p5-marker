import { RenderedElement } from "../core";
import { addWidthHeight, addXY } from "../properties/shape_props";
import { constants } from "../properties/constants";

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
 */
class Image extends addXY(addWidthHeight(RenderedElement)) {
  #image_mode = constants.CORNER;
  #tint = constants.NONE;
  static overloads = [
    "img, x, y, [width], [height]",
    "img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign]",
  ];
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
    return this.#tint;
  }
  set tint(val) {
    if (val === constants.NONE) this.pInst.noTint();
    else if (val instanceof p5.Color) this.pInst.tint(val);
    else this.pInst.tint(...val);
    this.#tint = this.pInst.color(this.pInst._renderer._tint);
  }
  /**
   * Set image mode. Modifies the location from which images are drawn by
   * changing the way in which an image's properties are interpreted.
   * The default mode is image_mode="CORNER", which interprets x and
   * y as the upper-left corner of the image.
   *
   * image_mode="CORNERS" interprets x and y
   * as the location of one corner, and width and height as the
   * opposite corner.
   *
   * image_mode="CENTER" interprets x and y
   * as the image's center point.
   * @type {CORNER|CORNERS|CENTER}
   */
  get image_mode() {
    return this.#image_mode;
  }
  set image_mode(val) {
    this.pInst.imageMode(val);
    this.#image_mode = val;
  }
}
customElements.define("p-image", Image);
