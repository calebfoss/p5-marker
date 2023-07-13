import { MarkerElement } from "../elements/base";

export const fill = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    get fill() {
      return "#000000";
    }
    set fill(argument: string | null) {
      this.setFirstTime("fill", "string", argument, (context) => {
        context.fillStyle = this.fill;
      });
    }
    setup() {
      super.setup();
      const fill_default = "#000000";
      const fill_value = this.optionalInherit("fill", fill_default);
      if (fill_value !== fill_default) this.fill = fill_value;
    }
  };

export const stroke = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    get line_cap(): CanvasLineCap {
      return "butt";
    }
    set line_cap(argument) {
      this.setFirstTime("line_cap", "string", argument, (context) => {
        context.lineCap = this.line_cap;
      });
    }
    get line_join(): CanvasLineJoin {
      return "miter";
    }
    set line_join(argument) {
      this.setFirstTime("line_join", "string", argument, (context) => {
        context.lineJoin = this.line_join;
      });
    }
    get line_width() {
      return 1;
    }
    set line_width(argument) {
      this.setFirstTime("line_width", "number", argument, (context) => {
        context.lineWidth = this.line_width;
      });
    }
    get stroke() {
      return "#000000";
    }
    set stroke(argument: string | null) {
      this.setFirstTime("stroke", "string", argument, (context) => {
        context.strokeStyle = this.stroke;
      });
    }
    setup() {
      super.setup();
      const stroke_default = "#000000";
      const stroke_value = this.optionalInherit("stroke", stroke_default);
      if (stroke_value !== stroke_default) this.stroke = stroke_value;
    }
  };
