import { interpret } from "../interpreter/interpreter";
import { color } from "../mixins/color";
import { dimensions } from "../mixins/dimensions";
import { transform } from "../mixins/transform";

export const identity =
  <T>(value: T) =>
  () =>
    value;

export const markerObject = <T extends object>(source: T): MarkerObject<T> => {
  if ("propertyManager" in source) return source as MarkerObject<T>;
  const output = { propertyManager: {} };
  Object.entries(Object.getOwnPropertyDescriptors(source)).forEach(
    ([key, { value, get, configurable }]) => {
      if (!configurable) return;
      const propertyObject: Property<any> | ObjectProperty<object> =
        typeof value === "object"
          ? property(markerObject(value))
          : property(get || value);
      Object.defineProperty(output, key, {
        get() {
          return propertyObject.get();
        },
        set(value) {
          propertyObject.get = identity(value);
          propertyObject.changed = true;
        },
      });
      output.propertyManager[key] = propertyObject;
    }
  );
  return output as MarkerObject<T>;
};

export function property<T>(get: () => T): Property<T>;
export function property<T extends object>(value: T): ObjectProperty<T>;
export function property<T>(value: T): Property<T>;
export function property<T>(argument: T) {
  if (typeof argument === "function")
    return {
      get: argument,
      changed: false,
    };
  if (typeof argument !== "object")
    return {
      get: identity(argument),
      changed: false,
    };
  const output = {
    object: markerObject(argument),
    get: () => output.object,
    get changed() {
      for (const key of Object.keys(output.object.propertyManager)) {
        if (output.object.propertyManager[key].changed) return true;
      }
      return false;
    },
    set changed(value) {
      if (value)
        for (const key of Object.keys(output.object.propertyManager)) {
          output.object.propertyManager[key].changed = true;
        }
    },
  };
  return output;
}

export class Base extends HTMLElement {
  #count = 0;
  #frames_on = 0;
  #getters: (() => void)[] = [];
  #changers: (() => void)[] = [];
  #eachModifiers: ((reset?: boolean) => void)[] = [];
  constructor(...args: any[]) {
    super();
  }
  addChange(changer: () => void) {
    this.#changers.push(changer);
  }
  addEach(updater: (reset?: boolean) => void) {
    this.#eachModifiers.push(updater);
  }
  addGetter(getter: () => void) {
    this.#getters.push(getter);
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
  get canvas() {
    if (this.parentElement instanceof Base) return this.parentElement.canvas;
    return null;
  }
  get count() {
    return this.#count;
  }
  draw(context: CanvasRenderingContext2D) {
    if (this.on === false) return;
    this.#count = 0;
    for (const each of this.#eachModifiers) {
      each();
    }
    while (true) {
      context.save();
      this.render(context);
      for (const child of this.children) {
        if (child instanceof Base) {
          child.draw(context);
        }
      }
      context.restore();
      this.#count++;
      for (const each of this.#eachModifiers) {
        each();
      }
      if (!this.repeat) break;
      if (this.#count > this.max_count) {
        console.warn(
          `${this.tagName} reached its maximum iteration count of ${this.max_count}`
        );
        break;
      }
    }
    for (const each of this.#eachModifiers) {
      each(true);
    }
    for (const getter of this.#getters) {
      getter();
    }
    for (const change of this.#changers) {
      change();
    }
    this.#frames_on++;
  }
  get frame() {
    return this.canvas.frame;
  }
  get frames_on() {
    return this.#frames_on;
  }
  inherit<T>(propertyName: PropertyKey, defaultValue: T) {
    if (!(this.parentElement instanceof Base)) return defaultValue;
    if (
      propertyName in this.parentElement &&
      this.parentElement[propertyName] !== null
    )
      return this.parentElement[propertyName];
    return this.parentElement.inherit(propertyName, defaultValue);
  }
  #max_count = property(10_000);
  get max_count() {
    return this.#max_count.get();
  }
  set max_count(value) {
    this.#max_count.get = identity(value);
  }
  #on = property(true);
  get on() {
    return this.#on.get();
  }
  set on(value) {
    this.#on.get = identity(value);
  }
  get parent() {
    return this.parentElement;
  }
  render(context: CanvasRenderingContext2D) {}
  #repeat = property(false);
  get repeat() {
    return this.#repeat.get();
  }
  set repeat(value) {
    this.#repeat.get = identity(value);
  }
  setup() {
    for (const attribute of this.attributes) {
      if (attribute.name === "id") continue;
      interpret(this, attribute);
    }
    for (const getter of this.#getters) {
      getter();
    }
    this.dispatchEvent(new Event("setup"));
    for (const child of this.children) {
      if (child instanceof Base) child.setup();
    }
  }
  toSVG(element: SVGElement) {
    for (const child of this.children) {
      if (child instanceof MarkerElement) child.toSVG(element);
    }
  }
  get window() {
    if (this.parentElement instanceof Base) return this.parentElement.window;
    return null;
  }
  xy(x: number, y?: number): MarkerObject<Vector> {
    if (typeof y === "undefined") return markerObject({ x, y: x });
    return markerObject({ x, y });
  }
  propertyManager: PropertyManager = {
    max_count: this.#max_count,
    repeat: this.#repeat,
  };
}

export class MarkerElement extends dimensions(transform(color(Base))) {}
