import { Base } from "../elements/base";

export const dimensions = <T extends typeof Base>(baseClass: T) =>
  class DimensionElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
    #width = null;
    get width() {
      if (this.#width !== null) return this.#width;
      return this.inherit("width", window.innerWidth);
    }
    set width(value) {
      this.#width = value;
    }
    #height = null;
    get height() {
      if (this.#height !== null) return this.#height;
      return this.inherit("height", window.innerHeight);
    }
    set height(value) {
      this.#height = value;
    }
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
