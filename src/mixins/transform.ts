import { Base, identity, markerObject, property } from "../elements/base";

export const transform = <T extends typeof Base>(baseClass: T) =>
  class extends baseClass {
    constructor(...args: any[]) {
      super();
      this.propertyManager.anchor = this.#anchor;
      this.propertyManager.angle = this.#angle;
      this.propertyManager.scale = this.#scale;
    }
    render(context: CanvasRenderingContext2D): void {
      context.translate(this.anchor.x, this.anchor.y);
      context.rotate(this.angle);
      context.scale(this.scale.x, this.scale.y);
      super.render(context);
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
    toSVG(element: SVGElement) {
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
      super.toSVG(element);
    }
  };
