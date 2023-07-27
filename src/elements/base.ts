import { interpret } from "../interpreter/interpreter";
import { color } from "../mixins/color";
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
          ? createProperty(markerObject(value))
          : createProperty(get || value);
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

export function createProperty<T>(get: () => T): Property<T>;
export function createProperty<T extends object>(value: T): ObjectProperty<T>;
export function createProperty<T>(value: T): Property<T>;
export function createProperty<T>(argument: T) {
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
  addChange<T>(property: Property<T>, getValue: () => T): void;
  addChange<T>(getProperty: () => Property<T>, getValue: () => T): void;
  addChange<T>(arg1: Property<T> | (() => Property<T>), getValue: () => T) {
    if (typeof arg1 === "function") {
      const getProperty = arg1;
      this.#changers.push(() => {
        const prop = getProperty();
        prop.get = identity(getValue());
        prop.changed = true;
      });
    } else {
      const property = arg1;
      this.#changers.push(() => {
        property.get = identity(getValue());
        property.changed = true;
      });
    }
  }
  addEach<T>(property: Property<T>, getValue: () => T): void;
  addEach<T>(getProperty: () => Property<T>, getValue: () => T): void;
  addEach<T>(arg1, getValue: () => T) {
    const [property, getProperty] =
      typeof arg1 === "function" ? [arg1(), arg1] : [arg1, identity(arg1)];
    let baseGet = property.get;
    this.#eachModifiers.push((reset: boolean = false) => {
      const prop = getProperty();
      if (this.count === 0) {
        baseGet = prop.get;
        return;
      }
      prop.get = reset ? baseGet : identity(getValue());
    });
  }
  addGetter<T extends object>(
    property: ObjectProperty<T>,
    getValue: () => T
  ): void;
  addGetter<T>(property: Property<T>, getValue: () => T): void;
  addGetter<T extends object>(
    getProperty: () => ObjectProperty<T>,
    getValue: () => T
  ): void;
  addGetter<T>(getProperty: () => Property<T>, getValue: () => T): void;
  addGetter<T>(arg1, getValue: () => T): void {
    const getProperty = typeof arg1 === "function" ? arg1 : identity(arg1);
    const setGetter = () => {
      const prop = getProperty();
      if (prop.changed) return;
      if (typeof getValue() === "object") {
        prop.object = getValue();
        prop.get = () => prop.object;
      } else prop.get = getValue;
    };
    setGetter();
    this.#getters.push(setGetter);
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
  draw(parentElement: Node): void;
  draw(context: CanvasRenderingContext2D): void;
  draw(argument: Node | CanvasRenderingContext2D): void {
    if (this.on === false) return;
    this.#count = 0;
    for (const each of this.#eachModifiers) {
      each();
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
    while (true) {
      render();
      this.#count++;
      for (const each of this.#eachModifiers) {
        each();
      }
      if (!this.repeat) break;
      if (this.#count >= this.max_count) {
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
    if (this.parentElement instanceof Base) return this.parentElement.frame;
    throw new Error(
      `Tried to access ${this.tagName}, but this element's parent element is not a Marker element`
    );
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
  #max_count = createProperty(10_000);
  get max_count() {
    return this.#max_count.get();
  }
  set max_count(value) {
    this.#max_count.get = identity(value);
  }
  #on = createProperty(true);
  get on() {
    return this.#on.get();
  }
  set on(value) {
    this.#on.get = identity(value);
  }
  get parent() {
    return this.parentElement;
  }
  set parent(element) {
    element.appendChild(this);
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
  styleSVGElement(groupElement: SVGElement) {}
  #repeat = createProperty(false);
  get repeat() {
    return this.#repeat.get();
  }
  set repeat(value) {
    this.#repeat.get = identity(value);
  }
  setup() {
    for (const attribute of this.attributes) {
      if (attribute.name !== "id") interpret(this, attribute);
    }
    this.dispatchEvent(new Event("setup"));
    for (const child of this.children) {
      if (child instanceof Base) child.setup();
    }
  }
  styleDOMElement(element: Element) {}
  #svg_group: SVGGElement;
  get window() {
    if (this.parentElement instanceof Base) return this.parentElement.window;
    return null;
  }
  static xy(x: number, y?: number): MarkerObject<Vector> {
    if (typeof y === "undefined") return markerObject({ x, y: x });
    return markerObject({ x, y });
  }
  propertyManager: PropertyManager<Base> = {
    max_count: this.#max_count,
    on: this.#on,
    repeat: this.#repeat,
  };
}

export class MarkerElement extends transform(color(Base)) {}
