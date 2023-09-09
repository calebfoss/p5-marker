import { Base } from "../elements/base";
import { Vector } from "../classes/vector";

const originPoint = new Vector(0, 0);

export const origin = <T extends typeof Base>(baseClass: T) =>
  class OriginElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
      this.setDocumentElementStyle("position", "absolute");
    }
    #origin_x = null;
    #origin_y = null;
    #origin = new Vector(
      () =>
        this.#origin_x === null
          ? this.inherit("origin", originPoint).x
          : this.#origin_x,
      (value) => {
        this.#origin_x = value;
        this.setDocumentElementStyle("left", `${value}px`);
        this.setSVGElementAttribute("x", value.toString());
      },
      () =>
        this.#origin_y === null
          ? this.inherit("origin", originPoint).y
          : this.#origin_y,
      (value) => {
        this.#origin_y = value;
        this.setDocumentElementStyle("top", `${value}px`);
        this.setSVGElementAttribute("y", value.toString());
      }
    );
    get origin(): Vector {
      return this.#origin;
    }
    set origin(value) {
      this.#origin = value;
      this.setDocumentElementStyle("left", `${value.x}px`);
      this.setDocumentElementStyle("top", `${value.y}px`);
      this.setSVGElementAttribute("x", value.x.toString());
      this.setSVGElementAttribute("y", value.y.toString());
    }
    styleDocumentElement(): void {
      this.setDocumentElementStyle(
        "transformOrigin",
        `-${this.origin.x}px -${this.origin.y}px`
      );
      super.styleDocumentElement();
    }
  };
