import { Base, MarkerElement } from "../elements/base";
import { Vector } from "../classes/vector";

class ColorStop {
  color: string;
  position: number;
  constructor(color: string, position: number) {
    this.color = color;
    this.position = position;
  }
}

type GradientType = "linear" | "radial";
type GradientCoordinates = {
  linear: [number, number, number, number];
  radial: [number, number, number, number, number, number];
};

export class MarkerGradient {
  origin: Vector;
  stops: ColorStop[];
  type: GradientType;
  constructor(type: GradientType, origin: Vector, stops: ColorStop[]) {
    this.type = type;
    this.origin = origin;
    this.stops = stops;
  }
  addCanvasStops(canvasGradient: CanvasGradient) {
    for (const stop of this.stops) {
      canvasGradient.addColorStop(stop.position, stop.color);
    }
  }
  addSVGStops(element: SVGElement) {
    for (const stop of this.stops) {
      const stopElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stopElement.setAttribute("offset", stop.position.toString());
      stopElement.setAttribute("stop-color", stop.color);
      element.appendChild(stopElement);
    }
  }
  get toCSS(): string {
    return;
  }
  protected get cssStops() {
    return this.stops
      .map((stop) => `${stop.color} ${stop.position * 100}%`)
      .join(", ");
  }
  get toSVG(): SVGGradientElement {
    return;
  }
  toContext(
    context: CanvasRenderingContext2D,
    coordinates: GradientCoordinates
  ): CanvasGradient {
    return;
  }
}

export class LinearGradient extends MarkerGradient {
  angle: number;
  constructor(origin: Vector, angle: number, stops: ColorStop[]) {
    super("linear", origin, stops);
    this.angle = (angle + Math.PI * 2) % (Math.PI * 2);
  }
  toContext(
    context: CanvasRenderingContext2D,
    coordinates: GradientCoordinates
  ) {
    const [rectLeft, rectTop, rectRight, rectBottom] = coordinates.linear;
    const { origin: unitOrigin, angle } = this;
    const originX = rectLeft + (rectRight - rectLeft) * unitOrigin.x;
    const originY = rectTop + (rectBottom - rectTop) * unitOrigin.y;
    const origin = new Vector(originX, originY);
    const tan = Math.tan(angle);
    if (angle < Math.PI / 2 || angle > Math.PI * (7 / 4)) {
      const startToRight = rectRight - origin.x;
      const yAtRight = origin.y + tan * startToRight;
      if (yAtRight >= rectTop && yAtRight <= rectBottom) {
        const canvasGradient = context.createLinearGradient(
          origin.x,
          origin.y,
          rectRight,
          yAtRight
        );
        this.addCanvasStops(canvasGradient);
        return canvasGradient;
      }
    } else {
      const startToLeft = rectLeft - origin.x;
      const yAtLeft = origin.y + tan * startToLeft;
      if (yAtLeft >= rectTop && yAtLeft <= rectBottom) {
        const canvasGradient = context.createLinearGradient(
          origin.x,
          origin.y,
          rectLeft,
          yAtLeft
        );
        this.addCanvasStops(canvasGradient);
        return canvasGradient;
      }
    }
    if (angle < Math.PI) {
      const startToBottom = rectBottom - origin.y;
      const xAtBottom = origin.x + startToBottom / tan;
      if (xAtBottom >= rectLeft && xAtBottom <= rectRight && xAtBottom) {
        const canvasGradient = context.createLinearGradient(
          origin.x,
          origin.y,
          xAtBottom,
          rectBottom
        );
        this.addCanvasStops(canvasGradient);
        return canvasGradient;
      }
    } else {
      const startToTop = rectTop - origin.y;
      const xAtTop = origin.x + startToTop / tan;
      if (xAtTop >= 0 && xAtTop <= rectRight && xAtTop && xAtTop) {
        const canvasGradient = context.createLinearGradient(
          origin.x,
          origin.y,
          xAtTop,
          rectTop
        );
        this.addCanvasStops(canvasGradient);
        return canvasGradient;
      }
    }
    throw new Error(
      "On linear gradient: start and angle do not intersect with the edges of the element."
    );
  }
  get toCSS() {
    return `linear-gradient(${this.angle - Math.PI / 2}rad, ${this.cssStops})`;
  }
  get toSVG() {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    const x2 = this.origin.x + Math.cos(this.angle);
    const y2 = this.origin.y + Math.sin(this.angle);
    element.setAttribute("x1", this.origin.x.toString());
    element.setAttribute("y1", this.origin.y.toString());
    element.setAttribute("x2", x2.toString());
    element.setAttribute("y2", y2.toString());
    this.addSVGStops(element);
    return element;
  }
}

export class RadialGradient extends MarkerGradient {
  innerRadius: number;
  outerRadius: number;
  constructor(origin: Vector, stops: ColorStop[]) {
    super("radial", origin, stops);
  }
  toContext(
    context: CanvasRenderingContext2D,
    coordinates: GradientCoordinates
  ): CanvasGradient {
    const [x0, y0, r0, x1, y1, r1] = coordinates.radial;
    const originX = x0 + this.origin.x * r1;
    const originY = y0 + this.origin.y * r1;
    const gradient = context.createRadialGradient(
      originX,
      originY,
      r0,
      x1,
      y1,
      r1
    );
    this.addCanvasStops(gradient);
    return gradient;
  }
  get toCSS() {
    return `radial-gradient(${this.origin.x * 100}% ${this.origin.y * 100}%, ${
      this.cssStops
    })`;
  }
  get toSVG() {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "radialGradient"
    );
    element.setAttribute("cx", `${this.origin.x * 100}%`);
    element.setAttribute("cy", `${this.origin.y * 100}%`);
    this.addSVGStops(element);
    return element;
  }
}

function gradientArgsToColorStops(
  args: (string | number)[],
  stops: ColorStop[] = []
) {
  const [firstArg] = args;
  if (typeof firstArg === "number")
    throw new Error(
      "Found two numbers in a row in the arguments for a gradient, but numbers must follow colors."
    );
  if (args.length === 1) return stops.concat(new ColorStop(firstArg, 1));
  const secondArg = args[1];
  if (typeof secondArg === "number") {
    return gradientArgsToColorStops(
      args.slice(2),
      stops.concat(new ColorStop(firstArg, secondArg))
    );
  }
  if (stops.length) {
    const previousPosition = stops[stops.length - 1].position;
    const position = previousPosition + (1 - previousPosition) / args.length;
    return gradientArgsToColorStops(
      args.slice(1),
      stops.concat(new ColorStop(firstArg, position))
    );
  }
  return gradientArgsToColorStops(
    args.slice(1),
    stops.concat(new ColorStop(firstArg, 0))
  );
}

export const gradient = <T extends typeof Base>(baseClass: T) =>
  class GradientElement extends baseClass {
    protected get gradientCoordinates(): GradientCoordinates {
      const { window: w } = this;
      return {
        linear: [0, 0, w.width, w.height],
        radial: [
          w.width / 2,
          w.height / 2,
          0,
          w.width / 2,
          w.height / 2,
          w.width / 2,
        ],
      };
    }
    static linear_gradient(
      firstArg: Vector | string | number,
      ...args: (string | number)[]
    ) {
      if (typeof firstArg === "number") {
        const angle = firstArg;
        const stops = gradientArgsToColorStops(args);
        return new LinearGradient(new Vector(0, 0), angle, stops);
      }
      if (firstArg instanceof Vector) {
        const start = firstArg;
        const [secondArg] = args;
        if (typeof secondArg === "number") {
          const angle = secondArg;
          const stops = gradientArgsToColorStops(args.slice(1));
          return new LinearGradient(start, angle, stops);
        }
        const stops = gradientArgsToColorStops(args);
        return new LinearGradient(start, 0, stops);
      }
      const stops = gradientArgsToColorStops([firstArg, ...args]);
      return new LinearGradient(new Vector(0, 0), 0, stops);
    }
    static radial_gradient(colorStops: (number | string)[]): RadialGradient;
    static radial_gradient(
      origin: Vector,
      colorStops: (number | string)[]
    ): RadialGradient;
    static radial_gradient() {
      const [firstArg, ...otherArgs] = arguments;
      if (firstArg instanceof Vector) {
        const stops = gradientArgsToColorStops(otherArgs);
        return new RadialGradient(firstArg, stops);
      }
      const stops = gradientArgsToColorStops(Array.from(arguments));
      return new RadialGradient(new Vector(0.5, 0.5), stops);
    }
  };
