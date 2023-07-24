import { MarkerElement, identity } from "../elements/base";

export const position = <T extends typeof MarkerElement>(baseClass: T) =>
  class extends baseClass {
    constructor(...args: any[]) {
      super();
      this.propertyManager.position = this.#position;
    }
    #position: Property<MarkerObject<Vector>> = {
      get changed() {
        return (
          this.object.propertyManager.x.changed ||
          this.object.propertyManager.y.changed
        );
      },
      set changed(value) {
        if (value) {
          this.object.propertyManager.x.changed = true;
          this.object.propertyManager.y.changed = true;
        }
      },
      object: {
        get x() {
          return this.propertyManager.x.get();
        },
        set x(value) {
          this.propertyManager.x.get = identity(value);
        },
        get y() {
          return this.propertyManager.y.get();
        },
        set y(value) {
          this.propertyManager.y.get = identity(value);
        },
        propertyManager: {
          x: {
            get: () => this.inherit("position").x,
          },
          y: {
            get: () => this.inherit("position").y,
          },
        },
      },
      get: () => this.#position.object,
    };
    get position(): Vector {
      return this.#position.get();
    }
    set position(value) {
      this.#position.object.propertyManager.x.get = identity(value.x);
      this.#position.object.propertyManager.y.get = identity(value.y);
    }
  };
