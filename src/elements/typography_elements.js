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

class Text3D extends addXY(
  addWidthHeight(
    addFillStroke(
      addTypographyProps(
        add3DTransformProps(add3DProps(addWebGLMethods(RenderedElement)))
      )
    )
  )
) {
  static overloads = ["content, x, y, [width], [height]"];
}
customElements.define("p-text-3d", Text3D);
