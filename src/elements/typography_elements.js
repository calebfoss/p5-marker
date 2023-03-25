import { RenderedElement } from "../core";
import { addWebGLMethods } from "../methods/3d_methods";
import { add3DProps } from "../properties/3d_props";
import { addFillStroke, addFill } from "../properties/color_props";
import {
  addWidthHeight,
  addXY,
  add2DStrokeStyling,
} from "../properties/shape_props";
import {
  add2DTransformProps,
  add3DTransformProps,
} from "../properties/transform_props";
import { addTypographyProps } from "../properties/typography_props";

/**
 * Draws text on the ```<canvas>```. The content of the text may be specified
 * by setting the content property
 * ```xml
 * <text content="'Hello world'"></text>
 * ```
 * or by adding the content between the
 * element's start and end tags.
 * ```xml
 * <text>Hello world</text>
 * ```
 *
 * Change the color of the text with the fill property. Change
 * the outline of the text with the stroke and
 * stroke_weight properties.
 *
 * The text displays in relation to the <a href="#/p5/textAlign">textAlign()</a>
 * function, which gives the option to draw to the left, right, and center of the
 * coordinates.
 *
 * The width and height properties, if specified, define a rectangular area to display within and
 * may only be used with string data. When these properties are specified,
 * they are interpreted based on the current rect_mode
 * setting. Text that does not fit completely within the rectangle specified will
 * not be drawn to the screen. If width and height are not specified, the baseline
 * alignment is the default, which means that the text will be drawn upwards
 * from x and y.
 * @element text
 */
class Text extends addXY(
  addWidthHeight(
    addFillStroke(
      addTypographyProps(
        add2DStrokeStyling(add2DTransformProps(RenderedElement))
      )
    )
  )
) {
  /**
   * @private
   */
  static overloads = ["content, x, y, [width], [height]"];
}
customElements.define("p-text", Text);

const addFont3D = (baseClass) =>
  class extends baseClass {
    /**
     * The current font used by this element. This must be loaded
     * with load_font().
     * @type {p5.Font}
     */
    get font() {
      return super.font;
    }
  };

/**
 * Draws text on the ```<canvas-3d>```. The content of the text may be specified
 * by setting the content property
 * ```xml
 * <text content="'Hello world'"></text>
 * ```
 * or by adding the content between the
 * element's start and end tags.
 * ```xml
 * <text>Hello world</text>
 * ```
 *
 * Change the color of the text with the fill property. Text on a 3D canvas does not
 * have a stroke property.
 *
 * The text displays in relation to the <a href="#/p5/textAlign">textAlign()</a>
 * function, which gives the option to draw to the left, right, and center of the
 * coordinates.
 *
 * The width and height properties, if specified, define a rectangular area to display within and
 * may only be used with string data. When these properties are specified,
 * they are interpreted based on the current rect_mode
 * setting. Text that does not fit completely within the rectangle specified will
 * not be drawn to the screen. If width and height are not specified, the baseline
 * alignment is the default, which means that the text will be drawn upwards
 * from x and y.
 * @element text
 */
class Text3D extends addXY(
  addWidthHeight(
    addFill(
      addFont3D(
        addTypographyProps(
          add3DTransformProps(add3DProps(addWebGLMethods(RenderedElement)))
        )
      )
    )
  )
) {
  /**
   * @private
   */
  static overloads = ["content, x, y, [width], [height]"];
}
customElements.define("p-text-3d", Text3D);
