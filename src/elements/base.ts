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
    hsb(h: number, s: number, b: number) {
      return this.hsba(h, s, b, 1);
    },
    hsba(h: number, s: number, b: number, a: number) {
      const l = b * (1 - s / 200);
      const sl =
        l === 0 || l === 100 ? 0 : ((b - l) / Math.min(l, 100 - l)) * 100;
      return this.hsla(h, sl, l, a);
    },
    hsl(h: number, s: number, l: number) {
      return `hsl(${h} ${s}% ${l}%)`;
    },
    hsla(h: number, s: number, l: number, a: number) {
      return `hsl(${h} ${s}% ${l}% / ${a})`;
    },
    rgb(r: number, g: number, b: number) {
      return `rgb(${r} ${g} ${b})`;
    },
    rgba(r: number, g: number, b: number, a: number) {
      return `rgb(${r} ${g} ${b} / ${a})`;
    },
  };
  change = new Proxy(this, {
    get(element, propName) {
      const getProperty = (
        owner: object,
        key: PropertyKey,
        setOwner: (value: any) => void
      ) => {
        const prop = owner[key];
        if (typeof prop !== "object") return prop;
        const propProxy = new Proxy(prop, {
          set(p, k, value) {
            p[k] = value;
            setOwner(p);
            return true;
          },
          get(p, k) {
            return getProperty(p, k, (value) => (propProxy[k] = value));
          },
        });
        return propProxy;
      };
      return getProperty(
        element,
        propName,
        (value) => (element[propName] = value)
      );
    },
    set(element, propName, value) {
      if (typeof value !== "function") return false;
      element.#changers.push(() => {
        element[propName] = value();
      });
      return true;
    },
  });
  draw(context: CanvasRenderingContext2D) {
    if (this.on === false) return;
    this.#count = 0;
    const cachedValues = {};
    for (const propName of Object.keys(this.#each_modifiers)) {
      cachedValues[propName] = this[propName];
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
  each = new Proxy(this, {
    set(target, propName, value) {
      if (typeof value !== "function") return false;
      target.#each_modifiers[propName] = value;
      return true;
    },
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

      if (target === this || target === this.change || target === this.each) {
        if (propName in target) {
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
      } else {
        this.#changers.push(() => {
          target[propName] = getValue();
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
  xy(x: number, y?: number): Vector {
    if (typeof y === "undefined") return { x, y: x };
    return { x, y };
  }
}
