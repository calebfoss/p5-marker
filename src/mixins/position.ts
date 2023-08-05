import { Base } from "../elements/base";

const origin = Base.xy(0, 0);

export const position = <T extends typeof Base>(baseClass: T) =>
  class PositionElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
    #position = Base.xy(null, null);
    get position(): Vector {
      const value = this.#position;
      if (value.x !== null && value.y !== null) return value;
      const element = this;
      return {
        get x() {
          return value.x === null
            ? element.inherit("position", origin).x
            : value.x;
        },
        set x(value) {
          element.#position.x = value;
        },
        get y() {
          return value.y !== null
            ? value.y
            : element.inherit("position", origin).y;
        },
        set y(value) {
          element.#position.y = value;
        },
      };
    }
    set position(value) {
      this.#position = value;
    }
    styleDOMElement(element: HTMLElement): void {
      element.style.position = "absolute";
      element.style.left = `${this.position.x}px`;
      element.style.top = `${this.position.y}px`;
      super.styleDOMElement(element);
    }
  };
