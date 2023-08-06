import { Base } from "../elements/base";

type ContextMethods = Pick<
  CanvasRenderingContext2D,
  {
    [Key in keyof CanvasRenderingContext2D]: CanvasRenderingContext2D[Key] extends Function
      ? Key
      : never;
  }[keyof CanvasRenderingContext2D]
>;
type Transformations = {
  [Key in keyof ContextMethods]?: Parameters<ContextMethods[Key]>;
};

export const transform = <T extends typeof Base>(baseClass: T) =>
  class TransformElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
    #transformations: Transformations = {};
    #addContextTransformation<MethodKey extends keyof Transformations>(
      methodName: MethodKey,
      ...args: Transformations[MethodKey]
    ) {
      this.#transformations[methodName] = args;
    }
    transformCanvas(context: CanvasRenderingContext2D): void {
      if ("translate" in this.#transformations)
        context.translate(...this.#transformations.translate);
      if ("rotate" in this.#transformations)
        context.rotate(...this.#transformations.rotate);
      if ("scale" in this.#transformations)
        context.scale(...this.#transformations.scale);
    }
    #anchor = Base.xy(0, 0);
    get anchor() {
      const element = this;
      return {
        get x() {
          return element.#anchor.x;
        },
        set x(value) {
          element.anchor = Base.xy(value, element.#anchor.y);
        },
        get y() {
          return element.#anchor.y;
        },
        set y(value) {
          element.anchor = Base.xy(element.#anchor.x, value);
        },
      };
    }
    set anchor(value) {
      this.#anchor = value;
      this.#addContextTransformation("translate", value.x, value.y);
    }
    #angle = 0;
    get angle() {
      return this.#angle;
    }
    set angle(value) {
      this.#angle = value;
      this.#addContextTransformation("rotate", value);
    }
    #scale = Base.xy(1, 1);
    get scale() {
      const element = this;
      return {
        get x() {
          return element.#scale.x;
        },
        set x(value) {
          element.scale = Base.xy(value, element.#scale.y);
        },
        get y() {
          return element.#scale.y;
        },
        set y(value) {
          element.scale = Base.xy(element.#scale.x, value);
        },
      };
    }
    set scale(value) {
      this.#scale = value;
      this.#addContextTransformation("scale", value.x, value.y);
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
