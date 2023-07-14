import { MarkerElement } from "../elements/base";

export const fill = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    get fill(): string {
      return "#000000";
    }
    set fill(argument: unknown) {
      this.setFirstTime("fill", "string", argument, (context) => {
        context.fillStyle = this.fill;
      });
    }
    toSVG(element: SVGElement): void {
      element.setAttribute("fill", this.fill === null ? "none" : this.fill);
      super.toSVG(element);
    }
  };

export const stroke = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    get line_cap(): CanvasLineCap {
      return "butt";
    }
    set line_cap(argument: unknown) {
      this.setFirstTime("line_cap", "string", argument, (context) => {
        context.lineCap = this.line_cap;
      });
    }
    get line_join(): CanvasLineJoin {
      return "miter";
    }
    set line_join(argument: unknown) {
      this.setFirstTime("line_join", "string", argument, (context) => {
        context.lineJoin = this.line_join;
      });
    }
    get line_width(): number {
      return this.optionalInherit(1, "line_width");
    }
    set line_width(argument: unknown) {
      this.setFirstTime("line_width", "number", argument, (context) => {
        context.lineWidth = this.line_width;
      });
    }
    get stroke(): string {
      return this.optionalInherit("#000000", "stroke");
    }
    set stroke(argument: unknown) {
      this.setFirstTime<string>("stroke", "string", argument, (context) => {
        context.strokeStyle = this.stroke;
      });
    }
    toSVG(element: SVGElement): void {
      element.setAttribute(
        "stroke",
        this.stroke === null ? "none" : this.stroke
      );
      element.setAttribute("stroke-linecap", this.line_cap);
      element.setAttribute("stroke-linejoin", this.line_join);
      element.setAttribute("stroke-width", this.line_width.toString());
      super.toSVG(element);
    }
  };
