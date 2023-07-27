import { Base, identity, createProperty } from "../elements/base";

export const position = <T extends typeof Base>(baseClass: T) =>
  class PositionElement extends baseClass {
    constructor(...args: any[]) {
      super();
      this.propertyManager.position = this.#position;
    }
    #position = (() => {
      const element = this;
      return createProperty<Vector>({
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
    declare propertyManager: PropertyManager<PositionElement>;
    set position(value) {
      this.#position.object.propertyManager.x.get = identity(value.x);
      this.#position.object.propertyManager.y.get = identity(value.y);
    }
    styleDOMElement(element: HTMLElement): void {
      element.style.position = "absolute";
      element.style.left = `${this.position.x}px`;
      element.style.top = `${this.position.y}px`;
      super.styleDOMElement(element);
    }
  };
