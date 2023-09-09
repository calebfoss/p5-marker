import { dimensions } from "../mixins/dimensions";
import { origin } from "../mixins/origin";
import { fill, stroke } from "../mixins/style";
import { visible } from "../mixins/visible";
import { MarkerElement } from "./base";

export class Ellipse extends origin(
  dimensions(fill(stroke(visible(MarkerElement))))
) {
  renderToCanvas(context: CanvasRenderingContext2D): void {
    this.transform_context(context);
    if (this.visible) {
      const { x, y } = this.origin;
      context.ellipse(x, y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    }
    this.styleContext(context);
    super.renderToCanvas(context);
  }
  styleDocumentElement(): void {
    this.setDocumentElementStyle("borderRadius", "50% 50%");
    super.styleDocumentElement();
    this.document_element.style.transform += `translate(-${
      this.width / 2
    }px, -${this.height / 2}px)`;
  }
  styleSVGElement(newElement?: boolean): void {
    this.setSVGElementAttribute("rx", (this.width / 2).toString());
    this.setSVGElementAttribute("ry", (this.height / 2).toString());
    super.styleSVGElement(newElement);
  }
  protected svgTag: keyof SVGElementTagNameMap = "ellipse";
}
customElements.define("m-ellipse", Ellipse);
