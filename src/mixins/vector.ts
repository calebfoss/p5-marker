import { Base } from "../elements/base";
import { Vector } from "../classes/vector";

export const vector = (baseClass: typeof Base) =>
  class XY extends baseClass {
    static xy(x: number, y?: number): Vector {
      y = typeof y === "undefined" ? x : y;
      return new Vector(x, y);
    }
  };
