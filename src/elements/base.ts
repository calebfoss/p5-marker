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
    return this.vector(0, 0);
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
  assertType(propertyName: string, argument: any, ...types: string[]) {
    const argumentType = typeof argument;
    const isCorrectType = types.includes(argumentType);
    if (!isCorrectType)
      console.error(
        `${
          this.tagName
        }'s ${propertyName} was set to ${argument}, which is of type ${argumentType}, but it may only be set to type: ${types.join(
          "or "
        )}`
      );
    return isCorrectType;
  }
  get canvas() {
    if (this.parentElement instanceof MarkerElement)
      return this.parentElement.canvas;
    return null;
  }
  get count() {
    return this.#count;
  }
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
  optionalInherit(attributeName: string, privateValue: any) {
    if (this.parentElement === null) return privateValue;
    if (this.parentElement instanceof MarkerElement === false)
      return privateValue;
    if (attributeName in this.parentElement === false) return privateValue;
    const inherited = this.parentElement[attributeName];
    if (typeof inherited === "undefined") return privateValue;
    return inherited;
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
    return this.vector(1, 1);
  }
  set scale(argument) {
    this.setFirstTime("scale", "object", argument);
  }
  setFirstTime(
    propertyName: string,
    type: string,
    argument: any,
    beforeRender?: (context: CanvasRenderingContext2D) => void
  ) {
    if (typeof argument === "function") {
      Object.defineProperty(this, propertyName, {
        get: argument,
        set: (arg) => {
          if (this.assertType(propertyName, arg, type))
            Object.defineProperty(this, propertyName, {
              value: arg,
              writable: true,
            });
        },
        configurable: true,
      });
    } else if (this.assertType(propertyName, argument, type)) {
      Object.defineProperty(this, propertyName, {
        value: argument,
        writable: true,
      });
      this[propertyName] = argument;
    } else {
      return;
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
  vector(x: number, y?: number): Vector {
    if (typeof y === "undefined") return { x, y: x };
    return { x, y };
  }
  get width() {
    if (this.parentElement instanceof MarkerElement)
      return this.parentElement.width;
    else return 0;
  }
  set width(arg: number) {
    this.setFirstTime("width", "number", arg);
  }
}
