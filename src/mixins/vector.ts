import { Base } from "../elements/base";

export class Vector {
  #x = 0;
  #getX = () => this.#x;
  #setX = (value: number) => {
    this.#x = value;
  };
  #y = 0;
  #getY = () => this.#y;
  #setY = (value: number) => {
    this.#y = value;
  };
  constructor(
    getX: () => number,
    setX: (value: number) => void,
    getY: () => number,
    setY: (value: number) => void
  );
  constructor(x: number, y: number);
  constructor() {
    if (
      (typeof arguments[0] === "number" && typeof arguments[1] === "number") ||
      (arguments[0] === null && arguments[1] === null)
    ) {
      this.#x = arguments[0];
      this.#y = arguments[1];
    } else if (
      arguments.length === 4 &&
      Array.from(arguments).every((arg) => typeof arg === "function")
    ) {
      this.#getX = arguments[0];
      this.#setX = arguments[1];
      this.#getY = arguments[2];
      this.#setY = arguments[3];
    }
  }
  minus(vector: Vector): Vector;
  minus(x: number, y: number): Vector;
  minus() {
    const [addX, addY] =
      arguments[0] instanceof Vector
        ? [arguments[0].x, arguments[0].y]
        : arguments;
    return new Vector(this.#x - addX, this.#y - addY);
  }
  plus(vector: Vector): Vector;
  plus(x: number, y: number): Vector;
  plus(): Vector {
    const [addX, addY] =
      arguments[0] instanceof Vector
        ? [arguments[0].x, arguments[0].y]
        : arguments;
    return new Vector(this.#x + addX, this.#y + addY);
  }
  get x() {
    return this.#getX();
  }
  set x(value) {
    this.#setX(value);
  }
  get y() {
    return this.#getY();
  }
  set y(value) {
    this.#setY(value);
  }
}

export const vector = (baseClass: typeof Base) =>
  class XY extends baseClass {
    static xy(x: number, y?: number): Vector {
      y = y || x;
      return new Vector(x, y);
    }
  };
