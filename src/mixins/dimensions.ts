import { Base, identity, property } from "../elements/base";

export const dimensions = <T extends typeof Base>(baseClass: T) =>
  class extends baseClass {
    constructor(...args: any[]) {
      super();
      this.propertyManager.width = this.#width;
      this.propertyManager.height = this.#height;
    }
    #width = property(() => this.inherit("width", window.innerWidth));
    get width() {
      return this.#width.get();
    }
    set width(value) {
      this.#width.get = identity(value);
    }
    #height = property(() => this.inherit("height", window.innerHeight));
    get height() {
      return this.#height.get();
    }
    set height(value) {
      this.#height.get = identity(value);
    }
    toSVG(element: SVGElement): void {
      element.setAttribute("width", this.width.toString());
      element.setAttribute("height", this.height.toString());
      super.toSVG(element);
    }
  };
