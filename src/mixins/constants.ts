import { Base } from "../elements/base";

export const constants = <T extends typeof Base>(baseClass: T) =>
  class extends baseClass {
    static ANY = "any";
    static ARROW_UP = "ArrowUp";
    static ARROW_RIGHT = "ArrowRight";
    static ARROW_DOWN = "ArrowDown";
    static ARROW_LEFT = "ArrowLeft";
    static NONE = "none";
    static PI = Math.PI;
  };
