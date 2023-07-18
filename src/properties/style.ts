import { MarkerElement } from "../elements/base";

export const fill = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    constructor(...args: any[]) {
      super();
      this.propertyManager.fill = this.#fill;
    }
    #fill: Property<string> = {
      value: null,
      get: () => this.#fill.value || this.inherit("fill"),
    };
    get fill() {
      return this.#fill.get();
    }
    set fill(value) {
      this.#fill.value = value;
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
      value: null,
      get: () => this.#line_cap.value || this.inherit("line_cap"),
    };
    get line_cap(): CanvasLineCap {
      return this.#line_cap.get();
    }
    set line_cap(value) {
      this.#line_cap.value = value;
    }
    #line_join: Property<CanvasLineJoin> = {
      value: null,
      get: () => this.#line_join.value || this.inherit("line_join"),
    };
    get line_join(): CanvasLineJoin {
      return this.#line_join.get();
    }
    set line_join(value) {
      this.#line_join.value = value;
    }
    #line_width: Property<number> = {
      value: null,
      get: () => this.#line_width.value || this.inherit("line_width"),
    };
    get line_width() {
      return this.#line_width.get();
    }
    set line_width(value) {
      this.#line_width.value = value;
    }
    render(context: CanvasRenderingContext2D) {
      context.lineCap = this.line_cap || context.lineCap;
      context.lineJoin = this.line_join || context.lineJoin;
      context.lineWidth = this.line_width || context.lineWidth;
      context.strokeStyle = this.stroke || context.strokeStyle;
      super.render(context);
    }
    #stroke: Property<string> = {
      value: null,
      get: () => this.#stroke.value || this.inherit("stroke"),
    };
    get stroke(): string {
      return this.#stroke.get();
    }
    set stroke(value) {
      this.#stroke.value = value;
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
