import { Base } from "../elements/base";
import { Vector } from "./vector";

const origin = new Vector(0, 0);

export const position = <T extends typeof Base>(baseClass: T) =>
  class PositionElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
      this.setDocumentElementStyle("position", "absolute");
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
        this.setDocumentElementStyle("left", `${value}px`);
      },
      () =>
        this.#position_y === null
          ? this.inherit("position", origin).y
          : this.#position_y,
      (value) => {
        this.#position_y = value;
        this.setDocumentElementStyle("top", `${value}px`);
      }
    );
    get position(): Vector {
      return this.#position;
    }
    set position(value) {
      this.#position = value;
      this.setDocumentElementStyle("left", `${value.x}px`);
      this.setDocumentElementStyle("top", `${value.y}px`);
    }
  };
