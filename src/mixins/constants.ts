import { Base } from "../elements/base";

export const constants = <T extends typeof Base>(baseClass: T) =>
  class extends baseClass {
    static NONE = "none";
    static PI = Math.PI;
  };
