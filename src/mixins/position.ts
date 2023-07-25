import { Base, identity, property } from "../elements/base";

export const position = <T extends typeof Base>(baseClass: T) =>
  class extends baseClass {
    constructor(...args: any[]) {
      super();
      this.propertyManager.position = this.#position;
    }
    #position = (() => {
      const element = this;
      return property<Vector>({
        get x(): number {
          return element.inherit("position", element.xy(0, 0)).x;
        },
        get y(): number {
          return element.inherit("position", element.xy(0, 0)).y;
        },
      });
    })();
    get position(): Vector {
      const pos = this.#position.get();
      return pos;
    }
    set position(value) {
      this.#position.object.propertyManager.x.get = identity(value.x);
      this.#position.object.propertyManager.y.get = identity(value.y);
    }
  };
