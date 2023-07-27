import { createProperty } from "../elements/base";
import { VisibleElement } from "../elements/visible";

export const fill = <T extends typeof VisibleElement>(baseClass: T) =>
  class FillElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
      this.propertyManager.fill = this.#fill;
    }
    #fill = createProperty(() => this.inherit("fill", "#ffffff"));
    get fill(): string {
      return this.#fill.get();
    }
    set fill(value) {
      this.#fill.set(value);
    }
    declare propertyManager: PropertyManager<FillElement>;
    renderToCanvas(context: CanvasRenderingContext2D) {
      if (this.fill !== "none") {
        context.fillStyle = this.fill;
        context.fill();
      }
      super.renderToCanvas(context);
    }
    styleSVGElement(element: SVGElement): void {
      element.setAttribute("fill", this.fill === null ? "none" : this.fill);
      super.styleSVGElement(element);
    }
    styleDOMElement(element: HTMLElement): void {
      element.style.background = this.fill;
      super.styleDOMElement(element);
    }
  };

export const stroke = <T extends typeof VisibleElement>(baseClass: T) =>
  class StrokeElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
      this.propertyManager.line_width = this.#line_width;
      this.propertyManager.line_cap = this.#line_cap;
      this.propertyManager.line_join = this.#line_join;
      this.propertyManager.stroke = this.#stroke;
    }
    #line_cap = createProperty(() => this.inherit("line_cap", "butt"));
    get line_cap(): CanvasLineCap {
      return this.#line_cap.get();
    }
    set line_cap(value) {
      this.#line_cap.set(value);
    }
    #line_join = createProperty(() => this.inherit("line_join", "miter"));
    get line_join(): CanvasLineJoin {
      return this.#line_join.get();
    }
    set line_join(value) {
      this.#line_join.set(value);
    }
    #line_width = createProperty(() => this.inherit("line_width", 1.0));
    get line_width(): number {
      return this.#line_width.get();
    }
    set line_width(value) {
      this.#line_width.set(value);
    }
    declare propertyManager: PropertyManager<StrokeElement>;
    renderToCanvas(context: CanvasRenderingContext2D) {
      if (this.stroke !== "none") {
        context.lineCap = this.line_cap || context.lineCap;
        context.lineJoin = this.line_join || context.lineJoin;
        context.lineWidth = this.line_width || context.lineWidth;
        context.strokeStyle = this.stroke || context.strokeStyle;
        context.stroke();
      }
      super.renderToCanvas(context);
    }
    #stroke = createProperty(() => this.inherit("stroke", "#000000"));
    get stroke(): string {
      return this.#stroke.get();
    }
    set stroke(value) {
      this.#stroke.set(value);
    }
    styleDOMElement(element: HTMLElement): void {
      if (this.stroke === "none") element.style.outline = "none";
      else {
        element.style.outlineColor = this.stroke;
        element.style.outlineWidth = `${this.line_width}px`;
        element.style.outlineStyle = "solid";
      }
      super.styleDOMElement(element);
    }
    styleSVGElement(element: SVGElement): void {
      element.style.stroke = this.stroke;
      element.style.strokeLinecap = this.line_cap;
      element.style.strokeLinejoin = this.line_join;
      element.style.strokeWidth = `${this.line_width}px`;
      super.styleSVGElement(element);
    }
  };
