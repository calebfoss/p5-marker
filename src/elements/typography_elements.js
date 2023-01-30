import { RenderedElement } from "../core";
import { addFillStroke } from "../properties/color_props";
import { addXY } from "../properties/shape_props";
import { addTypographyProps } from "../properties/typography_props";

class Text extends addXY(addFillStroke(addTypographyProps(RenderedElement))) {
  static overloads = ["content, x, y, [x2], [y2]"];
}
customElements.define("p-text", Text);
