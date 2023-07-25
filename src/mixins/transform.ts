import { Base, identity, markerObject, property } from "../elements/base";

export const transform = <T extends typeof Base>(baseClass: T) =>
  class extends baseClass {
    constructor(...args: any[]) {
      super();
      this.propertyManager.anchor = this.#anchor;
      this.propertyManager.angle = this.#angle;
      this.propertyManager.scale = this.#scale;
    }
    #anchor = property(this.xy(0, 0));
    get anchor() {
      return this.#anchor.get();
    }
    set anchor(argument: Vector) {
      this.#anchor.object = markerObject(argument);
    }
    #angle = property(0);
    get angle() {
      return this.#angle.get();
    }
    set angle(value) {
      this.#angle.get = identity(value);
    }
    #scale = property(this.xy(1, 1));
    get scale() {
      return this.#scale.get();
    }
    set scale(value) {
      this.#scale.get = identity(value);
    }
  };
