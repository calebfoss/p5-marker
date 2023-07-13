import { MarkerElement } from "../elements/base";

export const position = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    get position(): Vector {
      const el = this;
      let getX = () => 0;
      let getY = () => 0;
      return {
        get x() {
          return getX();
        },
        set x(argument) {
          if (typeof argument === "function") getX = argument;
          else if (el.assertType("position.x", argument, "number")) {
            getX = () => argument;
          }
        },
        get y() {
          return getY();
        },
        set y(argument) {
          if (typeof argument === "function") getY = argument;
          else if (el.assertType("position.y", argument, "number")) {
            getY = () => argument;
          }
        },
      };
    }
    set position(argument) {
      this.setFirstTime("position", "object", argument);
    }
  };
