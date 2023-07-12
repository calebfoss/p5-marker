import { MarkerElement } from "../elements/base";

export const fill = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    get fill() {
      return "#000000";
    }
    set fill(argument: string | null) {
      this.setFirstTime("fill", "string", argument);
      const baseRender = this.render.bind(this);
      this.render = (context) => {
        context.fillStyle = this.fill;
        baseRender(context);
      };
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
    get stroke() {
      return "#000000";
    }
    set stroke(argument: string | null) {
      this.setFirstTime("stroke", "string", argument);
      const baseRender = this.render.bind(this);
      this.render = (context) => {
        context.strokeStyle = this.stroke;
        baseRender(context);
      };
    }
    setup() {
      super.setup();
      const stroke_default = "#000000";
      const stroke_value = this.optionalInherit("stroke", stroke_default);
      if (stroke_value !== stroke_default) this.stroke = stroke_value;
    }
  };
