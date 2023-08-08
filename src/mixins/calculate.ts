import { Base } from "../elements/base";

export const calculate = (baseClass: typeof Base) =>
  class Calculate extends baseClass {
    static between(a: number, b: number, c: number) {
      const range = b - a;
      const amt = Calculate.constrain(c, 0, 1) * range;
      return a + amt;
    }
    static constrain(value: number, min: number, max: number) {
      const greaterValue = Math.max(min, max);
      const lesserValue = Math.min(min, max);
      return Math.max(Math.min(value, greaterValue), lesserValue);
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
  };
