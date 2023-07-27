import { Base, identity, createProperty } from "../elements/base";

export const dimensions = <T extends typeof Base>(baseClass: T) =>
  class DimensionElement extends baseClass {
    constructor(...args: any[]) {
      super();
      this.propertyManager.width = this.#width;
      this.propertyManager.height = this.#height;
    }
    #width = createProperty(() => this.inherit("width", window.innerWidth));
    get width() {
      return this.#width.get();
    }
    set width(value) {
      this.#width.get = identity(value);
    }
    #height = createProperty(() => this.inherit("height", window.innerHeight));
    get height() {
      return this.#height.get();
    }
    set height(value) {
      this.#height.get = identity(value);
    }
    declare propertyManager: PropertyManager<DimensionElement>;
    renderToSVG(parentElement: SVGElement, element?: SVGElement): void {
      if (typeof element !== "undefined") {
        element.style.width = `${this.width}px`;
        element.style.height = `${this.height}px`;
      }
      super.renderToSVG(parentElement, element);
    }
    styleDOMElement(element: HTMLElement): void {
      element.style.width = `${this.width}px`;
      element.style.height = `${this.height}px`;
      super.styleDOMElement(element);
    }
  };
