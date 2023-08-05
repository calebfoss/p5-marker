import { Base } from "../elements/base";

type ContextMethods = Pick<
  CanvasRenderingContext2D,
  {
    [Key in keyof CanvasRenderingContext2D]: CanvasRenderingContext2D[Key] extends Function
      ? Key
      : never;
  }[keyof CanvasRenderingContext2D]
>;

export const transform = <T extends typeof Base>(baseClass: T) =>
  class TransformElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
    #transformation_functions: ((context: CanvasRenderingContext2D) => void)[] =
      [];
    #addContextTransformation<MethodKey extends keyof ContextMethods>(
      methodName: MethodKey,
      ...args: Parameters<CanvasRenderingContext2D[MethodKey]>
    ) {
      const fn = (context: CanvasRenderingContext2D) => {
        (context[methodName] as Function)(...args);
      };
      if (methodName === "translate")
        this.#transformation_functions.unshift(fn);
      else this.#transformation_functions.push(fn);
    }
    transformCanvas(context: CanvasRenderingContext2D): void {
      while (this.#transformation_functions.length)
        this.#transformation_functions.pop()(context);
    }
    #anchor = Base.xy(0, 0);
    get anchor() {
      return this.#anchor;
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
      return this.#scale;
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
