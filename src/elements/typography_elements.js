import { RenderedElement } from "../core";
import { addWebGLMethods } from "../methods/3d_methods";
import { add3DProps } from "../properties/3d_props";
import { addFillStroke } from "../properties/color_props";
import { addWidthHeight, addXY } from "../properties/shape_props";
import {
  add2DTransformProps,
  add3DTransformProps,
} from "../properties/transform_props";
import { addTypographyProps } from "../properties/typography_props";

class Text extends addXY(
  addWidthHeight(
    addFillStroke(addTypographyProps(add2DTransformProps(RenderedElement)))
  )
) {
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
class Text3D extends addXY(
  addWidthHeight(
    addFillStroke(
      addFont3D(
        addTypographyProps(
          add3DTransformProps(add3DProps(addWebGLMethods(RenderedElement)))
        )
      )
    )
  )
) {
  static overloads = ["content, x, y, [width], [height]"];
}
customElements.define("p-text-3d", Text3D);
