import { MarkerElement } from "../elements/base";

export const defaultFill = MarkerElement.gray(255);
export const defaultStroke = MarkerElement.gray(0);

export const fill = <T extends typeof MarkerElement>(baseClass: T) =>
  class FillElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
    #fill: string = null;
    get fill(): string {
      if (this.#fill !== null) return this.#fill;
      return this.inherit("fill", "#ffffff");
    }
    set fill(value) {
      this.#fill = value;
      this.setContextProperty("fillStyle", value);
      this.setDocumentElementStyle("background", value);
    }
    renderToCanvas(context: CanvasRenderingContext2D) {
      if (this.fill !== "none") {
        context.fill();
      }
      super.renderToCanvas(context);
    }
    styleSVGElement(element: SVGElement): void {
      element.setAttribute("fill", this.fill === null ? "none" : this.fill);
      super.styleSVGElement(element);
    }
  };

export const stroke = <T extends typeof MarkerElement>(baseClass: T) =>
  class StrokeElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
    #line_cap: CanvasLineCap = null;
    get line_cap(): CanvasLineCap {
      if (this.#line_cap !== null) return this.#line_cap;
      return this.inherit("line_cap", "butt");
    }
    set line_cap(value) {
      this.#line_cap = value;
      this.setContextProperty("lineCap", value);
    }
    #line_join: CanvasLineJoin = null;
    get line_join(): CanvasLineJoin {
      if (this.#line_join !== null) return this.#line_join;
      return this.inherit("line_join", "miter");
    }
    set line_join(value) {
      this.#line_join = value;
      this.setContextProperty("lineJoin", value);
    }
    #line_width: number = null;
    get line_width(): number {
      if (this.#line_width !== null) return this.#line_width;
      return this.inherit("line_width", 1.0);
    }
    set line_width(value) {
      this.#line_width = value;
      this.setContextProperty("lineWidth", value);
      this.setDocumentElementStyle("outlineWidth", `${value}px`);
    }
    renderToCanvas(context: CanvasRenderingContext2D) {
      if (this.stroke !== "none") {
        context.stroke();
      }
      super.renderToCanvas(context);
    }
    #stroke: string = null;
    get stroke(): string {
      if (this.#stroke !== null) return this.#stroke;
      return this.inherit("stroke", "#000000");
    }
    set stroke(value) {
      this.#stroke = value;
      this.setContextProperty("strokeStyle", value);
      this.setDocumentElementStyle("outlineColor", value);
    }
    styleSVGElement(element: SVGElement): void {
      element.style.stroke = this.stroke;
      element.style.strokeLinecap = this.line_cap;
      element.style.strokeLinejoin = this.line_join;
      element.style.strokeWidth = `${this.line_width}px`;
      super.styleSVGElement(element);
    }
  };
