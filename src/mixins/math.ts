import { Base } from "../elements/base";
import { Vector } from "./vector";

export const math = (baseClass: typeof Base) =>
  class MarkerMath extends baseClass {
    static between(a: number, b: number, c: number): number {
      const range = b - a;
      const amt = MarkerMath.constrain(c, 0, 1) * range;
      return a + amt;
    }
    static constrain(value: number, min: number, max: number) {
      const greaterValue = Math.max(min, max);
      const lesserValue = Math.min(min, max);
      return Math.max(Math.min(value, greaterValue), lesserValue);
    }
    static distance(a: Vector, b: Vector): number;
    static distance(ax: number, ay: number, bx: number, by: number): number;
    static distance(): number {
      const [ax, ay] =
        arguments[0] instanceof Vector
          ? [arguments[0].x, arguments[0].y]
          : arguments;
      const [bx, by] =
        arguments[1] instanceof Vector
          ? [arguments[1].x, arguments[1].y]
          : [arguments[2], arguments[3]];
      return Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
    }
    static map(
      value: number,
      minA: number,
      maxA: number,
      minB: number,
      maxB: number
    ) {
      const rangeA = maxA - minA;
      const rangeB = maxB - minB;
      return (value - minA) * (rangeB / rangeA) + minB;
    }
    static math: Math = Math;
  };
