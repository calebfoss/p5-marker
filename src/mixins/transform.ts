import { Vector } from "./vector";
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
    #transformations: Transformations = {};
    #canvas_transformation: DOMMatrix;
    constructor(...args: any[]) {
      super(...args);
    }
    #anchor = new Vector(0, 0);
    get anchor() {
      return this.#anchor;
    }
    set anchor(value) {
      this.#anchor = value;
      this.#transformations.translate = [value.x, value.y];
    }
    #angle = 0;
    get angle() {
      return this.#angle;
    }
    set angle(value) {
      this.#angle = value;
      this.#transformations.rotate = [value];
    }
    #scale = new Vector(1, 1);
    get scale() {
      return this.#scale;
    }
    set scale(value) {
      if (typeof value === "number") value = new Vector(value, value);
      this.#scale = value;
      this.#transformations.scale = [value.x, value.y];
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
    transform(x: number, y: number): Vector;
    transform(vector: Vector): Vector;
    transform() {
      const [x, y] =
        typeof arguments[0] === "object"
          ? [arguments[0].x, arguments[0].y]
          : arguments;
      if (typeof this.#canvas_transformation === "undefined")
        return new Vector(x, y);
      const original_position = new DOMPointReadOnly(x, y);
      const inverted_matrix = this.#canvas_transformation.inverse();
      const transformed_point =
        inverted_matrix.transformPoint(original_position);
      return new Vector(transformed_point.x, transformed_point.y);
    }
    transform_context(context: CanvasRenderingContext2D): void {
      const transformations = Object.entries(this.#transformations).sort(
        ([methodA], [methodB]) => {
          if (methodA === "translate") return -1;
          if (methodB === "translate") return 1;
          return 0;
        }
      );
      for (const [methodName, args] of transformations) {
        context[methodName](...args);
      }
      this.#canvas_transformation = context.getTransform();
    }
    #transformation: [
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ];
    get transformation() {
      return this.#transformation;
    }
    set transformation(value) {
      this.#transformation = value;
      this.#transformations.transform = value;
    }
    untransform(x: number, y: number): Vector;
    untransform(vector: Vector): Vector;
    untransform() {
      const [x, y] =
        typeof arguments[0] === "object"
          ? [arguments[0].x, arguments[0].y]
          : arguments;
      if (typeof this.#canvas_transformation === "undefined")
        return new Vector(x, y);
      const original_position = new DOMPointReadOnly(x, y);
      const untransformed_point =
        this.#canvas_transformation.transformPoint(original_position);
      return new Vector(untransformed_point.x, untransformed_point.y);
    }
  };
