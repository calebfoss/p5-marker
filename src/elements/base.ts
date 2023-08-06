import { interpret } from "../interpreter/interpreter";
import { color } from "../mixins/color";
import { constants } from "../mixins/constants";
import { random } from "../mixins/random";
import { transform } from "../mixins/transform";
import { MarkerWindow } from "./window";

export const identity =
  <T>(value: T) =>
  () =>
    value;

function deepProxy<O extends object>(obj: O): O {
  return new Proxy(obj, {
    get(target, propertyName) {
      if (!(propertyName in target)) target[propertyName] = {};
      return deepProxy(target[propertyName]);
    },
  });
}

export type GettersFor<O extends object> = {
  [K in keyof O]?: O[K] extends object ? GettersFor<O[K]> : () => O[K];
};

function deepAssign(target: object, source: GettersFor<object>) {
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "object") {
      if (typeof target[key] === "undefined")
        target[key] = Array.isArray(value) ? [] : {};
      deepAssign(target[key], value);
    } else target[key] = source[key];
  }
}
function deepEvaluateAndAssign<O extends object>(
  target: O,
  ...sources: GettersFor<O>[]
) {
  for (
    let sourceIndexA = sources.length - 1;
    sourceIndexA >= 0;
    sourceIndexA--
  ) {
    const sourceA = sources[sourceIndexA];
    for (const [key, value] of Object.entries(sourceA)) {
      if (typeof value === "object") {
        if (typeof target[key] === "undefined")
          target[key] = Array.isArray(value) ? [] : {};
        deepEvaluateAndAssign(
          target[key],
          ...sources
            .slice(sourceIndexA)
            .filter((s) => typeof s[key] !== "undefined")
            .map((s) => s[key])
        );
      } else {
        for (
          let sourceIndexB = sources.length - 1;
          sourceIndexB >= sourceIndexA;
          sourceIndexB--
        ) {
          if (sourceIndexB === sourceIndexA) {
            target[key] = sourceA[key]();
          } else if (typeof sources[sourceIndexB][key] !== "undefined") break;
        }
      }
    }
  }
}
function updateIfNotIn<O extends object>(
  target: O,
  source: GettersFor<O>,
  exclude: GettersFor<O>
) {
  for (const [key, value] of Object.entries(source)) {
    const excludeKey = typeof exclude[key] === "undefined";
    if (typeof value === "object") {
      updateIfNotIn(target[key], value, excludeKey ? {} : exclude[key]);
    } else if (typeof value === "function") {
      if (excludeKey) target[key] = value();
    } else throw new Error(`Unexpected value for ${key}: ${value}`);
  }
}

const drawEvent = new Event("draw");

export class Base extends HTMLElement {
  #updaters: (() => void)[] = [];
  #getBaseValues: GettersFor<this> = {};
  #getEachValues: GettersFor<this> = {};
  #getThenValues: GettersFor<this> = {};
  #count = 0;
  #frames_on = 0;
  constructor(...args: any[]) {
    super();
  }
  assertType<T>(
    propertyName: string,
    argument: unknown,
    ...types: string[]
  ): asserts argument is T {
    const argumentType = typeof argument;
    const isCorrectType = types.includes(argumentType);
    if (!isCorrectType)
      throw new Error(
        `${
          this.tagName
        }'s ${propertyName} was set to ${argument}, which is of type ${argumentType}, but it may only be set to type: ${types.join(
          "or "
        )}`
      );
  }
  #base = deepProxy(this.#getBaseValues);
  get base() {
    return this.#base;
  }
  get canvas() {
    if (this.parentElement instanceof Base) return this.parentElement.canvas;
    return null;
  }
  get count() {
    return this.#count;
  }
  #render_frame = -1;
  #nextValues: Partial<this> = {};
  #preIterationValues: Partial<this> = {};
  draw(parentElement: Node): void;
  draw(context: CanvasRenderingContext2D): void;
  draw(argument: Node | CanvasRenderingContext2D): void {
    for (const updater of this.#updaters) {
      updater();
    }
    if (this.#render_frame !== this.frame) {
      this.#render_frame = this.frame;
      this.#count = 0;
      updateIfNotIn(this.#nextValues, this.#getBaseValues, this.#getThenValues);
      if ("on" in this.#nextValues) {
        if (this.#nextValues.on === false) return;
      } else if (this.on === false) return;
      deepAssign(this, this.#nextValues);
      deepAssign(this.#preIterationValues, this.#nextValues);
      deepEvaluateAndAssign(
        this.#nextValues,
        this.#getBaseValues,
        this.#getThenValues
      );
    } else {
      deepAssign(this, this.#preIterationValues);
      updateIfNotIn(this, this.#getBaseValues, this.#getThenValues);
    }
    this.dispatchEvent(drawEvent);
    const render = (() => {
      if (argument instanceof CanvasRenderingContext2D)
        return () => {
          argument.save();
          this.renderToCanvas(argument);
          argument.restore();
        };
      if (argument instanceof SVGElement)
        return () => this.renderToSVG(argument);
      if (argument instanceof Node) return () => this.renderToDOM(argument);
    })();
    while (true) {
      render();
      this.#count++;
      deepEvaluateAndAssign(this, this.#getEachValues);
      if (!this.repeat) break;
      if (this.#count >= this.max_count) {
        console.warn(
          `${this.tagName} reached its maximum iteration count of ${this.max_count}`
        );
        break;
      }
    }
    this.#frames_on++;
  }
  #each = deepProxy(this.#getEachValues);
  get each() {
    return this.#each;
  }
  get frame() {
    if (this.parentElement instanceof Base) return this.parentElement.frame;
    throw new Error(
      `Tried to access ${this.tagName}, but this element's parent element is not a Marker element`
    );
  }
  get frames_on() {
    return this.#frames_on;
  }
  inherit<K extends keyof this>(propertyName: K, defaultValue: this[K]) {
    if (this.parentElement === null || !(propertyName in this.parentElement))
      return defaultValue;
    return (this.parentElement as this)[propertyName];
  }
  #max_count = 10_000;
  get max_count() {
    return this.#max_count;
  }
  set max_count(value) {
    this.#max_count = value;
  }
  #on = true;
  get on() {
    return this.#on;
  }
  set on(value) {
    this.#on = value;
  }
  onCanvasClicked(x: number, y: number, time: DOMHighResTimeStamp) {
    for (const child of this.children) {
      if (child instanceof Base) child.onCanvasClicked(x, y, time);
    }
  }
  #parent: Property<HTMLElement> = {
    get: () => this.parentElement,
    set: (element) => {
      element.appendChild(this);
      this.#parent.changed = true;
    },
    changed: false,
  };
  get parent() {
    return this.#parent.get();
  }
  set parent(element) {
    this.#parent.set(element);
  }
  renderToCanvas(context: CanvasRenderingContext2D) {
    context.beginPath();
    for (const child of this.children) {
      if (child instanceof Base) {
        child.draw(context);
      }
    }
  }
  renderToDOM(parentElement: Node) {
    for (const child of this.children) {
      if (child instanceof Base) child.draw(parentElement);
    }
  }
  renderToSVG(parentElement: SVGElement, element?: SVGElement) {
    if (typeof this.#svg_group === "undefined")
      this.#svg_group = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
    const groupElement = this.#svg_group;
    if (parentElement !== groupElement.parentNode)
      parentElement.appendChild(groupElement);
    if (typeof element !== "undefined") {
      this.styleSVGElement(groupElement);
      groupElement.appendChild(element);
    }
    for (const child of this.children) {
      if (child instanceof Base) child.draw(groupElement);
    }
  }
  #getRepeat = () => false;
  get repeat() {
    return this.#getRepeat();
  }
  set repeat(value) {
    if (typeof value === "function") this.#getRepeat = value;
    else this.#getRepeat = identity(value);
  }
  setup() {
    for (const attribute of this.attributes) {
      try {
        interpret(this, this.#updaters, attribute);
      } catch (error) {
        console.error(
          `The following error occurred when interpreting ${this.tagName}'s ${attribute.name} attribute:`
        );
        console.error(error);
      }
    }
    for (const updater of this.#updaters) {
      updater();
    }
    deepEvaluateAndAssign(this.#nextValues, this.#getBaseValues);
    deepAssign(this, this.#nextValues);
    this.dispatchEvent(new Event("setup"));
    for (const child of this.children) {
      if (child instanceof Base) child.setup();
    }
  }
  #canvas_style: Partial<CanvasRenderingContext2D> = {};
  get canvas_style() {
    return this.#canvas_style;
  }
  setContextProperty<K extends keyof CanvasRenderingContext2D>(
    key: K,
    value: CanvasRenderingContext2D[K]
  ) {
    this.#canvas_style[key] = value;
  }
  styleContext(context: CanvasRenderingContext2D) {
    Object.assign(context, this.#canvas_style);
  }
  styleDOMElement(element: Element) {}
  styleSVGElement(groupElement: SVGElement) {}
  #svg_group: SVGGElement;
  #then = deepProxy(this.#getThenValues);
  get then() {
    return this.#then;
  }
  get window(): MarkerWindow {
    if (this.parentElement instanceof Base) return this.parentElement.window;
    throw new Error(
      `${this.tagName} tried to access its window property, but its parent is not a Marker element`
    );
  }
  static xy(x: number, y?: number): Vector {
    if (typeof y === "undefined") return { x, y: x };
    return { x, y };
  }
}

export class MarkerElement extends transform(color(random(constants(Base)))) {}
