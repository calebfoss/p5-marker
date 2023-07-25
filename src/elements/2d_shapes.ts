import { MarkerElement } from "./base";
import { position } from "../mixins/position";
import { fill, stroke } from "../mixins/style";

export class Rectangle extends position(fill(stroke(MarkerElement))) {
  render(context: CanvasRenderingContext2D) {
    super.render(context);
    if (this.stroke !== "none")
      context.strokeRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    if (this.fill !== "none")
      context.fillRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }
  toSVG(parentElement: SVGElement): void {
    const doc = parentElement.ownerDocument as XMLDocument;
    const element = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
    parentElement.appendChild(element);
    element.setAttribute("x", this.position.x.toString());
    element.setAttribute("y", this.position.y.toString());
    element.setAttribute("width", this.width.toString());
    element.setAttribute("height", this.height.toString());
    super.toSVG(element);
  }
}
customElements.define("m-rectangle", Rectangle);
