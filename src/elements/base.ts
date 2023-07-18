import { interpret } from "../interpreter/interpreter";

export class MarkerElement extends HTMLElement {
  #count = 0;
  #frames_on = 0;
  constructor(...args: any[]) {
    super();
  }
  #anchor: Property<Vector> = {
    value: this.xy(0, 0),
    get: () => this.#anchor.value,
  };
  get anchor() {
    return this.#anchor.get();
  }
  set anchor(argument: Vector) {
    this.#anchor.value = argument;
  }
  #angle: Property<number> = {
    value: 0,
    get: () => this.#angle.value,
  };
  get angle() {
    return this.#angle.get();
  }
  set angle(argument) {
    this.#angle.value = argument;
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
    if (this.parentElement instanceof MarkerElement)
      return this.parentElement.canvas;
    return null;
  }
  get count() {
    return this.#count;
  }
  color = {
    gray(value: number, alpha?: number) {
      return this.rgb(value, value, value, alpha);
    },
    hsb(h: number, s: number, b: number, a?: number) {
      const l = b * (1 - s / 200);
      const sl =
        l === 0 || l === 100 ? 0 : ((b - l) / Math.min(l, 100 - l)) * 100;
      if (typeof a !== "undefined") return this.hsla(h, sl, l, a);
      return this.hsl(h, sl, l);
    },
    hsl(h: number, s: number, l: number, a?: number) {
      if (typeof a !== "undefined") return `hsl(${h} ${s}% ${l}% / ${a})`;
      return `hsl(${h} ${s}% ${l}%)`;
    },
    rgb(r: number, g: number, b: number, a?: number) {
      if (typeof a !== "undefined") return `rgb(${r} ${g} ${b} / ${a})`;
      return `rgb(${r} ${g} ${b})`;
    },
  };
  change = this.#deepProxy((element, propertyName, getChangeValue) => {
    element.propertyManager[propertyName].get = getChangeValue;
    return true;
  });
  #deepProxy(set: (target: this, propertyName: string, value: any) => boolean) {
    function getProperty(
      owner: object,
      propertyName: PropertyKey,
      ownerReceiver: any
    ) {
      const property = owner[propertyName];
      if (typeof property !== "object") return property;
      return new Proxy(property, {
        get(property, subPropertyName, propertyReceiver) {
          return getProperty(property, subPropertyName, propertyReceiver);
        },
        set(property, subPropertyName, getValue) {
          ownerReceiver[propertyName] = () => ({
            ...property,
            [subPropertyName]: getValue(),
          });
          return true;
        },
      });
    }
    return new Proxy(this, {
      get(element, propertyName, receiver) {
        return getProperty(element, propertyName, receiver);
      },
      set,
    });
  }
  draw(context: CanvasRenderingContext2D) {
    if (this.on === false) return;
    for (
      this.#count = 0;
      this.#count === 0 || (this.repeat && this.#count < this.max_count);
      this.#count++
    ) {
      context.save();
      this.render(context);
      for (const child of this.children) {
        if (child instanceof MarkerElement) {
          child.draw(context);
        }
      }
      context.restore();
    }
    this.#frames_on++;
  }
  each = this.#deepProxy((element, propertyName, getEachValue) => {
    const getValue = element.propertyManager[propertyName].bind(element);
    let count = 0;
    element.propertyManager[propertyName].get = () => {
      if (count > element.count) count = 0;
      let value = getValue();
      if (count === element.count) return value;
      while (count < element.count) {
        value = getEachValue();
      }
      return value;
    };
    return true;
  });
  get frames_on() {
    return this.#frames_on;
  }
  #height: Property<number> = {
    value: null,
    get: () => this.#height.value || this.inherit("height"),
  };
  get height() {
    return this.#height.get();
  }
  set height(value) {
    this.#height.value = value;
  }
  inherit(propertyName: PropertyKey) {
    if (!(this.parentElement instanceof MarkerElement)) return null;
    if (
      propertyName in this.parentElement &&
      this.parentElement[propertyName] !== null
    )
      return this.parentElement[propertyName];
    return this.parentElement.inherit(propertyName);
  }
  #max_count: Property<number> = {
    value: 10000,
    get: () => this.#max_count.value,
  };
  get max_count() {
    return this.#max_count.get();
  }
  set max_count(value) {
    this.#max_count.value = value;
  }
  #on: Property<boolean> = {
    value: true,
    get: () => this.#on.value,
  };
  get on() {
    return this.#on.get();
  }
  set on(value) {
    this.#on.value = value;
  }
  optionalInherit<T>(defaultValue: T, ...propertyNames: string[]): T {
    if (this.parentElement === null) return defaultValue;
    if (this.parentElement instanceof MarkerElement === false)
      return defaultValue;
    const getInherited = (object: object, remainingNames: string[]): T => {
      if (remainingNames.length) {
        const [nextName, ...afterNext] = remainingNames;
        if (nextName in object)
          return getInherited(object[nextName], afterNext);
        return defaultValue;
      }
      return object as T;
    };
    return getInherited(this.parentElement, propertyNames);
  }
  get parent() {
    return this.parentElement;
  }
  render(context: CanvasRenderingContext2D) {
    context.translate(this.anchor.x, this.anchor.y);
    context.rotate(this.angle);
    context.scale(this.scale.x, this.scale.y);
  }
  #repeat: Property<boolean> = {
    value: false,
    get: () => this.#repeat.value,
  };
  get repeat() {
    return this.#repeat.get();
  }
  set repeat(value) {
    this.#repeat.value = value;
  }
  #scale: Property<Vector> = {
    value: this.xy(1, 1),
    get: () => this.#scale.value,
  };
  get scale() {
    return this.#scale.get();
  }
  set scale(value) {
    this.#scale.value = value;
  }
  setup() {
    for (const attribute of this.attributes) {
      const [getTarget, getPropName, getValue] = interpret(this, attribute);
      const target = getTarget();
      const propertyName = getPropName();
      let lastUpdated = 0;
      const setPropertyOnThis = () => {
        if (propertyName in this) {
          const baseGet = this.propertyManager[propertyName].get;
          this.propertyManager[propertyName].get = () => {
            while (lastUpdated < this.frames_on) {
              lastUpdated++;
              this.propertyManager[propertyName].value = getValue();
            }
            return baseGet();
          };
        } else {
          const property: Property<unknown> = {
            value: null,
            get: getValue,
          };
          Object.defineProperty(this, propertyName, {
            get() {
              return property.get();
            },
            set(value) {
              property.value = value;
            },
          });
          this.propertyManager[propertyName] = property;
        }
      };
      if (!(target instanceof MarkerElement)) {
        target[propertyName] = getValue;
      } else if (
        target === this ||
        Object.getPrototypeOf(target) === Object.getPrototypeOf(this)
      ) {
        setPropertyOnThis();
      } else {
        const baseGet = target.propertyManager[propertyName].get.bind(target);
        target.change[propertyName] = () => {
          while (lastUpdated < this.frames_on) {
            lastUpdated++;
            target[propertyName].value = getValue();
          }
          return baseGet();
        };
      }
    }
    this.dispatchEvent(new Event("setupComplete"));
    for (const child of this.children) {
      if (child instanceof MarkerElement) child.setup();
    }
  }
  toSVG(element: SVGElement) {
    element.setAttribute("width", this.width.toString());
    element.setAttribute("height", this.height.toString());
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
    for (const child of this.children) {
      if (child instanceof MarkerElement) child.toSVG(element);
    }
  }
  #width: Property<number> = {
    value: null,
    get: () => this.#width.value || this.inherit("width"),
  };
  get width() {
    return this.#width.get();
  }
  set width(value) {
    this.#width.value = value;
  }
  get window() {
    if (this.parentElement instanceof MarkerElement)
      return this.parentElement.window;
    return null;
  }
  xy(x: number, y?: number): Vector {
    if (typeof y === "undefined") return { x, y: x };
    return { x, y };
  }
  propertyManager: { [key in keyof this]?: Property<any> } = {
    anchor: this.#anchor,
    angle: this.#angle,
    height: this.#height,
    width: this.#width,
  };
}
