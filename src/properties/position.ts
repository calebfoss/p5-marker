import { MarkerElement } from "../elements/base";

export const position = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    #getX = () => this.optionalInherit(0, "position", "x");
    #getY = () => this.optionalInherit(0, "position", "y");
    get position(): Vector {
      const el: typeof this = this;
      return {
        get x(): number {
          const x = el.#getX();
          return x;
        },
        set x(argument: unknown) {
          if (typeof argument === "function" && typeof argument() === "number")
            el.#getX = argument as () => number;
          else {
            el.assertType<number>("position.x", argument, "number");
            el.#getX = () => argument;
          }
        },
        get y(): number {
          const y = el.#getY();
          return y;
        },
        set y(argument: unknown) {
          if (typeof argument === "function" && typeof argument() === "number")
            el.#getY = argument as () => number;
          else {
            el.assertType<number>("position.y", argument, "number");
            el.#getY = () => argument;
          }
        },
      };
    }
    set position(argument) {
      this.setFirstTime("position", "object", argument);
    }
  };
