import { interpret } from "../interpreter/interpreter";

export class MarkerElement extends HTMLElement {
  #count = 0;
  #changers: (() => void)[] = [];
  #each_modifiers: { [key in keyof this]?: () => void } = {};
  #max_count = 10000;
  #repeat = false;
  constructor(...args: any[]) {
    super();
  }
  get anchor() {
    const el: MarkerElement = this;
    let getX = () => 0;
    let getY = () => 0;
    return {
      get x(): number {
        return getX();
      },
      set x(argument: unknown) {
        if (typeof argument === "function" && typeof argument() === "number")
          getX = argument as () => number;
        el.assertType<number>("anchor.x", argument, "number");
        getX = () => argument;
      },
      get y(): number {
        return getY();
      },
      set y(argument: unknown) {
        if (typeof argument === "function") getY = argument as () => number;
        el.assertType<number>("anchor.y", argument, "number");
        getY = () => argument;
      },
    };
  }
  set anchor(argument: Vector) {
    this.setFirstTime("anchor", "object", argument);
  }
  get angle() {
    return 0;
  }
  set angle(argument) {
    this.setFirstTime("angle", "number", argument);
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
  change = this.#deepProxy((element, propertyName, value) => {
    element.#changers.push(() => {
      element[propertyName] = typeof value === "function" ? value() : value;
    });
    return true;
  });
  #deepProxy(
    set: (target: MarkerElement, propertyName: string, value: any) => boolean
  ) {
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
        set(property, subPropertyName, value) {
          if (typeof value === "function")
            ownerReceiver[propertyName] = () => ({
              ...property,
              [subPropertyName]: value(),
            });
          else
            ownerReceiver[propertyName] = {
              ...property,
              [subPropertyName]: value,
            };
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
    this.#count = 0;
    const cachedValues = {};
    for (const propName of Object.keys(this.#each_modifiers)) {
      const test = this[propName];
      cachedValues[propName] = test;
    }
    while (
      this.#count === 0 ||
      (this.repeat && this.#count < this.#max_count)
    ) {
      context.save();
      this.render(context);
      this.#count++;
      for (const child of this.children) {
        if (child instanceof MarkerElement) {
          child.draw(context);
        }
      }
      for (const [propName, modifier] of Object.entries(this.#each_modifiers)) {
        this[propName] = modifier();
      }
      context.restore();
    }
    Object.assign(this, cachedValues);
    for (const changer of this.#changers) {
      changer();
    }
  }
  each = this.#deepProxy((target, propName, value) => {
    target.#each_modifiers[propName] =
      typeof value === "function" ? value : () => value;
    return true;
  });
  get height() {
    if (this.parentElement instanceof MarkerElement)
      return this.parentElement.height;
    return 0;
  }
  set height(arg: number) {
    this.setFirstTime("height", "number", arg);
  }

  get max_count() {
    return this.#max_count;
  }
  set max_count(arg) {
    this.setFirstTime("max_count", "number", arg);
  }
  get on() {
    return true;
  }
  set on(arg) {
    this.setFirstTime("on", "boolean", arg);
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

  get repeat() {
    return this.#repeat;
  }
  set repeat(arg) {
    this.setFirstTime("repeat", "boolean", arg);
  }
  get scale() {
    return this.xy(1, 1);
  }
  set scale(argument) {
    this.setFirstTime("scale", "object", argument);
  }
  setFirstTime<T>(
    propertyName: string,
    type: string,
    argument: unknown,
    beforeRender?: (context: CanvasRenderingContext2D) => void
  ) {
    if (typeof argument === "function") {
      Object.defineProperty(this, propertyName, {
        get: argument as () => any,
        set: (argument: unknown) => {
          this.assertType<T>(propertyName, argument, type);
          Object.defineProperty(this, propertyName, {
            value: argument,
            writable: true,
          });
        },
        configurable: true,
      });
    } else {
      this.assertType<T>(propertyName, argument, type);
      Object.defineProperty(this, propertyName, {
        value: argument,
        writable: true,
      });
      this[propertyName] = argument;
    }
    if (typeof beforeRender === "function") {
      const baseRender = this.render.bind(this);
      this.render = (context) => {
        beforeRender(context);
        baseRender(context);
      };
    }
  }
  setup() {
    for (const attribute of this.attributes) {
      const [getTarget, getPropName, getValue] = interpret(this, attribute);
      const target = getTarget();
      const propName = getPropName();

      if (target instanceof MarkerElement && target !== this) {
        this.#changers.push(() => {
          target[propName] = getValue();
        });
      } else if (propName in target) {
        target[propName] = getValue;
      } else {
        Object.defineProperty(target, propName, {
          get: getValue,
          set: (value) => {
            this.setFirstTime(propName, typeof getValue(), value);
          },
          configurable: true,
        });
      }
    }
    this.dispatchEvent(new Event("setupComplete"));
    for (const child of this.children) {
      if (child instanceof MarkerElement) child.setup();
    }
  }
  get width() {
    if (this.parentElement instanceof MarkerElement)
      return this.parentElement.width;
    else return 0;
  }
  set width(arg: number) {
    this.setFirstTime("width", "number", arg);
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
}
