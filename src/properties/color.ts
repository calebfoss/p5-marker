import { MarkerElement } from "../elements/base";

export const fill = (baseClass: typeof MarkerElement) =>
  class extends baseClass {
    set fill(arg: string) {
      this.setFirstTime("fill", "string", arg);
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

export const stroke = (baseClass: typeof MarkerElement) =>
  class extends baseClass {
    get stroke() {
      return "#000000";
    }
    set stroke(argument) {
      this.setFirstTime("stroke", "string", argument);
      const baseRender = this.render.bind(this);
      this.render = (context) => {
        context.strokeStyle = this.stroke;
        baseRender(this, context);
      };
    }
  };
