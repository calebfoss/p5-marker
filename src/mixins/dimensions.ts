import { Base } from "../elements/base";

export const dimensions = <T extends typeof Base>(baseClass: T) =>
  class DimensionElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
    #width = null;
    get width(): number {
      if (this.#width !== null) return this.#width;
      return this.inherit("width", window.innerWidth);
    }
    set width(value) {
      this.#width = value;
    }
    #height = null;
    get height(): number {
      if (this.#height !== null) return this.#height;
      return this.inherit("height", window.innerHeight);
    }
    set height(value) {
      this.#height = value;
    }
    styleDocumentElement(): void {
      this.setDocumentElementStyle("width", `${this.width}px`);
      this.setDocumentElementStyle("height", `${this.height}px`);
      super.styleDocumentElement();
    }
  };
