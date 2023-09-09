import { Vector } from "../classes/vector";
import { Base } from "../elements/base";

type ContextMethods = Pick<
  CanvasRenderingContext2D,
  {
    [Key in keyof CanvasRenderingContext2D]: CanvasRenderingContext2D[Key] extends Function
      ? Key
      : never;
  }[keyof CanvasRenderingContext2D]
>;
const transformationOrder = [
  "transform",
  "translate",
  "rotate",
  "scale",
] as const satisfies Readonly<(keyof ContextMethods)[]>;
type ContextTransformations = {
  [Key in (typeof transformationOrder)[number]]?: Parameters<
    ContextMethods[Key]
  >;
};
type DocumentTransformations = {
  [Key in (typeof transformationOrder)[number]]?: string;
};

export const transform = <T extends typeof Base>(baseClass: T) =>
  class TransformElement extends baseClass {
    #context_transformations: ContextTransformations = {};
    #document_transformations: DocumentTransformations = {};
    #canvas_transformation: DOMMatrix;
    constructor(...args: any[]) {
      super(...args);
    }
    #anchor_x = 0;
    #anchor_y = 0;
    #anchor = new Vector(
      () => this.#anchor_x,
      (value) => {
        this.#anchor_x = value;
        this.#context_transformations.translate = [value, this.#anchor_y];
        this.#document_transformations.translate = `${this.anchor.x}px, ${value}px`;
      },
      () => this.#anchor_y,
      (value) => {
        this.#anchor_y = value;
        this.#context_transformations.translate = [this.#anchor_x, value];
        this.#document_transformations.translate = `${value}px, ${this.anchor.y}px`;
      }
    );
    get anchor() {
      return this.#anchor;
    }
    set anchor(value) {
      this.#anchor = value;
      this.#context_transformations.translate = [value.x, value.y];
      this.#document_transformations.translate = `${value.x}px, ${value.y}px`;
    }
    #angle = 0;
    get angle() {
      return this.#angle;
    }
    set angle(value) {
      this.#angle = value;
      this.#context_transformations.rotate = [value];
      this.#document_transformations.rotate = `${value}rad`;
    }
    #scale_x = 1;
    #scale_y = 1;
    #scale = new Vector(
      () => this.#scale_x,
      (value) => {
        this.#scale_x = value;
        this.#context_transformations.scale = [value, this.#scale_y];
        this.#document_transformations.scale = `${value}, ${this.scale.y}`;
      },
      () => this.#scale_y,
      (value) => {
        this.#scale_y = value;
        this.#context_transformations.scale = [this.#scale_x, value];
        this.#document_transformations.scale = `${this.scale.x}, ${value}`;
      }
    );
    get scale() {
      return this.#scale;
    }
    set scale(value) {
      if (typeof value === "number") value = new Vector(value, value);
      this.#scale = value;
      this.#context_transformations.scale = [value.x, value.y];
      this.#document_transformations.scale = `${value.x}, ${value.y}`;
    }
    styleDocumentElement(): void {
      let transformationString = "";
      for (const methodName of transformationOrder) {
        if (methodName in this.#document_transformations) {
          transformationString += `${methodName}(${
            this.#document_transformations[methodName]
          })`;
        }
      }
      this.setDocumentElementStyle("transform", transformationString);
      super.styleDocumentElement();
    }
    styleSVGElement(newElement?: boolean): void {
      let transformationString = "";
      for (const [transformationName, args] of Object.entries(
        this.#context_transformations
      )) {
        switch (transformationName) {
          case "rotate":
            transformationString += `rotate(${args
              .map((arg: any) => (arg * 180) / Math.PI)
              .join(" ")})`;
            break;
          case "transform":
            transformationString += `matrix(${args.join(" ")})`;
            break;
          default:
            transformationString += `${transformationName}(${args.join(" ")})`;
        }
      }
      if (transformationString.length)
        this.svg_collection.group.setAttribute(
          "transform",
          transformationString
        );
      super.styleSVGElement(newElement);
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
      const original_position =
        this.canvas === null
          ? new DOMPointReadOnly(x, y)
          : new DOMPointReadOnly(
              x * this.canvas.pixel_density,
              y * this.canvas.pixel_density
            );
      const inverted_matrix = this.#canvas_transformation.inverse();
      const transformed_point =
        inverted_matrix.transformPoint(original_position);
      return new Vector(transformed_point.x, transformed_point.y);
    }
    transform_context(context: CanvasRenderingContext2D): void {
      for (const methodName of transformationOrder) {
        if (methodName in this.#context_transformations) {
          const args = this.#context_transformations[methodName];
          context[methodName](
            ...(args as [number, number, number, number, number, number])
          );
        }
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
      this.#context_transformations.transform = value;
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
