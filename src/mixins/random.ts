import { Base } from "../elements/base";

export const random = <T extends typeof Base>(baseClass: T) =>
  class RandomElement extends baseClass {
    static random(max: number): number;
    static random(min: number, max: number): number;
    static random(array: any[]): any;
    static random() {
      switch (arguments.length) {
        case 0:
          return Math.random();
        case 1: {
          const [argument] = arguments;
          if (Array.isArray(argument)) {
            const index = Math.floor(Math.random() * argument.length);
            return argument[index];
          }
          return Math.random() * arguments[0];
        }
        case 2: {
          const [min, max] = arguments;
          const range = max - min;
          return Math.random() * range + min;
        }
      }
    }
  };
