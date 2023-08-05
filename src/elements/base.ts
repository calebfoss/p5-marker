import { interpret } from "../interpreter/interpreter";
import { color } from "../mixins/color";
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

function deepAssign<O1 extends object, O2 extends object>(
  target: O1,
  source: O2
) {
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "object") {
      if (typeof target[key] === "undefined") target[key] = {};
      deepAssign(target[key], source[key]);
    } else target[key] = source[key];
  }
}

export class Base extends HTMLElement {
  #base_updaters: (() => void)[] = [];
  #each_updaters: (() => void)[] = [];
  #then_updaters: (() => void)[] = [];
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
  #base_values: Partial<this> = {};
  #base = deepProxy(this.#base_values);
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
  draw(parentElement: Node): void;
  draw(context: CanvasRenderingContext2D): void;
  draw(argument: Node | CanvasRenderingContext2D): void {
    if (this.on === false) return;
    if (this.#render_frame !== this.frame) {
      this.#render_frame = this.frame;
      this.#count = 0;
    }
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
    const initial_values = {};
    for (const baseUpdater of this.#base_updaters) {
      baseUpdater();
    }
    deepAssign(initial_values, this.#base_values);
    deepAssign(initial_values, this.#previous_then_values);
    deepAssign(this, initial_values);
    while (true) {
      render();
      this.#count++;
      if (!this.repeat) break;
      if (this.#count >= this.max_count) {
        console.warn(
          `${this.tagName} reached its maximum iteration count of ${this.max_count}`
        );
        break;
      }
      for (const baseUpdater of this.#base_updaters) {
        baseUpdater();
      }
      for (const eachUpdater of this.#each_updaters) {
        eachUpdater();
      }
      if (this.#count === 1) {
        const element = this;
        function setInitialValue(target: object, source: object) {
          for (const [key, value] of Object.entries(source)) {
            if (typeof value === "object") {
              if (typeof target[key] === "undefined") target[key] = {};
              setInitialValue(target[key], source[key]);
            } else if (!(key in target)) target[key] = element[key];
          }
        }
        setInitialValue(initial_values, this.#each_values);
      }
      deepAssign(this, this.#base_values);
      deepAssign(this, this.#each_values);
    }
    this.#frames_on++;
    deepAssign(this, initial_values);
    for (const thenUpdater of this.#then_updaters) {
      thenUpdater();
    }
    deepAssign(this, this.#then_values);
    deepAssign(this.#previous_then_values, this.#then_values);
  }
  #each_values: Partial<this> = {};
  #each = deepProxy(this.#each_values);
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
    if (!(this.parentElement instanceof Base)) return defaultValue;
    if (
      propertyName in this.parentElement &&
      (this.parentElement as this)[propertyName] !== null
    )
      return (this.parentElement as this)[propertyName];
    return (this.parentElement as this).inherit(propertyName, defaultValue);
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
  #repeat = { get: () => false };
  get repeat() {
    return this.#repeat.get();
  }
  set repeat(value) {
    this.#repeat.get = identity(value);
  }
  setup() {
    for (const attribute of this.attributes) {
      if (attribute.name !== "id") {
        try {
          interpret(
            this,
            this.#base_updaters,
            this.#each_updaters,
            this.#then_updaters,
            this.#repeat,
            attribute
          );
        } catch (error) {
          console.error(
            `The following error occurred when interpreting ${this.tagName}'s ${attribute.name} attribute:`
          );
          console.error(error);
        }
      }
    }
    this.dispatchEvent(new Event("setup"));
    for (const child of this.children) {
      if (child instanceof Base) child.setup();
    }
  }
  #canvas_style: Partial<CanvasRenderingContext2D> = {};
  get canvas_style() {
    return this.#canvas_style;
  }
  styleContext<K extends keyof CanvasRenderingContext2D>(
    key: K,
    value: CanvasRenderingContext2D[K]
  ) {
    this.#canvas_style[key] = value;
  }
  styleDOMElement(element: Element) {}
  styleSVGElement(groupElement: SVGElement) {}
  #svg_group: SVGGElement;
  #then_values = {};
  #previous_then_values = {};
  #then: Partial<this> = deepProxy(this.#then_values);
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

export class MarkerElement extends transform(color(Base)) {}
