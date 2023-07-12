import { MarkerElement } from "../elements/base";

export const xy = (baseClass: typeof MarkerElement) =>
  class extends baseClass {
    get x() {
      return this.optionalInherit("x", 0);
    }
    set x(arg) {
      this.setFirstTime("x", "number", arg);
    }
    get y() {
      return this.optionalInherit("y", 0);
    }
    set y(arg) {
      this.setFirstTime("y", "number", arg);
    }
  };
