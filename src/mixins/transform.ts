import { Base, identity, markerObject, createProperty } from "../elements/base";

export const transform = <T extends typeof Base>(baseClass: T) =>
  class TransformElement extends baseClass {
    constructor(...args: any[]) {
      super();
      this.propertyManager.anchor = this.#anchor;
      this.propertyManager.angle = this.#angle;
      this.propertyManager.scale = this.#scale;
    }
    transformCanvas(context: CanvasRenderingContext2D): void {
      context.translate(this.anchor.x, this.anchor.y);
      context.rotate(this.angle);
      context.scale(this.scale.x, this.scale.y);
    }
    #anchor = createProperty(Base.xy(0, 0));
    get anchor() {
      return this.#anchor.get();
    }
    set anchor(argument: Vector) {
      this.#anchor.object = markerObject(argument);
    }
    #angle = createProperty(0);
    get angle() {
      return this.#angle.get();
    }
    set angle(value) {
      this.#angle.get = identity(value);
    }
    declare propertyManager: PropertyManager<TransformElement>;
    #scale = createProperty(Base.xy(1, 1));
    get scale() {
      return this.#scale.get();
    }
    set scale(value) {
      this.#scale.get = identity(value);
    }
    styleDOMElement(element: HTMLElement): void {
      element.style.translate = `${this.anchor.x} ${this.anchor.y}`;
      element.style.rotate = `${this.angle}rad`;
      element.style.scale = `${this.scale.x} ${this.scale.y}`;
      super.styleDOMElement(element);
    }
    styleSVGElement(element: SVGElement) {
      if (
        this.anchor.x !== 0 ||
        this.anchor.y !== 0 ||
        this.angle !== 0 ||
        this.scale.x !== 1 ||
        this.scale.y !== 1
      ) {
        element.setAttribute(
          "transform",
          `translate(${this.anchor.x} ${this.anchor.y}) rotate(${
            this.angle * (180 / Math.PI)
          }) scale(${this.scale.x} ${this.scale.y})`
        );
      }
      super.styleSVGElement(element);
    }
  };
