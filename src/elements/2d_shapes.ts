import { MarkerElement } from "./base";
import { position } from "../properties/position";
import { fill, stroke } from "../properties/style";

export class Rectangle extends position(fill(stroke(MarkerElement))) {
  render(context: CanvasRenderingContext2D) {
    super.render(context);
    if (this.stroke !== null)
      context.strokeRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    if (this.fill !== null)
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
    super.toSVG(element);
  }
}
