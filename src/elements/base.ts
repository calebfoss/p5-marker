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
    context.save();
    while (
      this.#count === 0 ||
      (this.repeat && this.#count < this.#max_count)
    ) {
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
    }
    Object.assign(this, cachedValues);
    for (const changer of this.#changers) {
      changer();
    }
    context.restore();
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
  render(context: CanvasRenderingContext2D) {}
  get repeat() {
    return this.#repeat;
  }
  set repeat(arg) {
    this.setFirstTime("repeat", "boolean", arg);
  }
  setFirstTime(attributeName: string, type: string, argument: any) {
    const argumentType = typeof argument;
    if (typeof argument === type) {
      Object.defineProperty(this, attributeName, {
        value: argument,
        writable: true,
      });
      this[attributeName] = argument;
    } else if (typeof argument === "function") {
      Object.defineProperty(this, attributeName, {
        get: argument,
        set: (arg) =>
          Object.defineProperty(this, attributeName, {
            value: arg,
            writable: true,
          }),
        configurable: true,
      });
    } else {
      console.error(
        `${this.tagName}'s ${attributeName} was set to ${argument}, ` +
          `which is of type ${argumentType}, ` +
          `but ${attributeName} can only be set to a value of type ${type}`
      );
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
              Object.defineProperty(target, propName, {
                value,
                writable: true,
              });
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
}
