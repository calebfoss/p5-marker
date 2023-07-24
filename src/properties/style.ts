import { MarkerElement, identity } from "../elements/base";

export const fill = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    constructor(...args: any[]) {
      super();
      this.propertyManager.fill = this.#fill;
    }
    #fill: Property<string> = {
      get: () => this.inherit("fill"),
    };
    get fill(): string {
      return this.#fill.get();
    }
    set fill(value) {
      this.#fill.get = identity(value);
    }
    render(context: CanvasRenderingContext2D) {
      context.fillStyle = this.fill || context.fillStyle;
      super.render(context);
    }
    toSVG(element: SVGElement): void {
      element.setAttribute("fill", this.fill === null ? "none" : this.fill);
      super.toSVG(element);
    }
  };

export const stroke = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    constructor(...args: any[]) {
      super();
    }
    #line_cap: Property<CanvasLineCap> = {
      get: () => this.inherit("line_cap"),
    };
    get line_cap(): CanvasLineCap {
      return this.#line_cap.get();
    }
    set line_cap(value) {
      this.#line_cap.get = identity(value);
    }
    #line_join: Property<CanvasLineJoin> = {
      get: () => this.inherit("line_join"),
    };
    get line_join(): CanvasLineJoin {
      return this.#line_join.get();
    }
    set line_join(value) {
      this.#line_join.get = identity(value);
    }
    #line_width: Property<number> = {
      get: () => this.inherit("line_width"),
    };
    get line_width(): number {
      return this.#line_width.get();
    }
    set line_width(value) {
      this.#line_width.get = identity(value);
    }
    render(context: CanvasRenderingContext2D) {
      context.lineCap = this.line_cap || context.lineCap;
      context.lineJoin = this.line_join || context.lineJoin;
      context.lineWidth = this.line_width || context.lineWidth;
      context.strokeStyle = this.stroke || context.strokeStyle;
      super.render(context);
    }
    #stroke: Property<string> = {
      get: () => this.inherit("stroke"),
    };
    get stroke(): string {
      return this.#stroke.get();
    }
    set stroke(value) {
      this.#stroke.get = identity(value);
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