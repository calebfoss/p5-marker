import { Base } from "../elements/base";
import { Vector } from "./vector";

const origin = new Vector(0, 0);

export const position = <T extends typeof Base>(baseClass: T) =>
  class PositionElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
    #position_x = null;
    #position_y = null;
    #position = new Vector(
      () =>
        this.#position_x === null
          ? this.inherit("position", origin).x
          : this.#position_x,
      (value) => {
        this.#position_x = value;
      },
      () =>
        this.#position_y === null
          ? this.inherit("position", origin).y
          : this.#position_y,
      (value) => {
        this.#position_y = value;
      }
    );
    get position(): Vector {
      return this.#position;
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
