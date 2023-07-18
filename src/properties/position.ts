import { MarkerElement } from "../elements/base";

export const position = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    constructor(...args: any[]) {
      super();
      this.propertyManager.position = this.#position;
    }
    #position: Property<Vector> = {
      value: null,
      get: () => this.#position.value || this.inherit("position"),
    };
    get position(): Vector {
      return this.#position.get();
    }
    set position(value) {
      this.#position.value = value;
    }
  };
