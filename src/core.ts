import { interpret } from "./interpreter/interpreter";

class MarkerElement extends HTMLElement {
  #count = 0;
  #changers: (() => void)[] = [];
  #each_modifiers: { [key in keyof this]?: () => void } = {};
  #max_count = 10000;
  #repeat = false;
  get count() {
    return this.#count;
  }
  change = new Proxy(this, {
    get(element, propName) {
      return new Proxy(element[propName], {
        set(prop, memberName, memberValue) {
          prop[memberName] = memberValue;
          Object.defineProperty(element, propName, {
            writable: true,
            value: prop,
          });
          return true;
        },
      });
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

class Window extends MarkerElement {
  #mouse_x = 0;
  #mouse_y = 0;
  constructor() {
    super();
    window.addEventListener("customElementsDefined", () => this.setup());
    window.addEventListener("mousemove", (e) => {
      this.#mouse_x = e.x;
      this.#mouse_y = e.y;
    });
  }
  get height() {
    return window.innerHeight;
  }
  get mouse() {
    return {
      x: this.#mouse_x,
      y: this.#mouse_y,
    };
  }
  get width() {
    return window.innerWidth;
  }
}
customElements.define("m-window", Window);

class Canvas extends MarkerElement {
  #canvas_element: HTMLCanvasElement | null = null;
  #frame = 0;
  constructor() {
    super();
    this.#canvas_element = document.createElement("canvas");
    this.#canvas_element.width = this.width;
    this.#canvas_element.height = this.height;
    const main =
      document.querySelector("main") ||
      document.body.appendChild(document.createElement("main"));
    main.appendChild(this.#canvas_element);
    const context = this.#canvas_element.getContext("2d");
    if (context === null) return;
    const drawFrame = () => {
      this.draw(context);
      this.#frame++;
      requestAnimationFrame(drawFrame);
    };
    requestAnimationFrame(drawFrame);
  }
  get background() {
    return "#fff";
  }
  set background(arg) {
    this.setFirstTime("background", "string", arg);
  }
  render(context: CanvasRenderingContext2D): void {
    const canvas = this.#canvas_element as HTMLCanvasElement;
    if (canvas.width !== this.width || canvas.height !== this.height) {
      const contextCopy = JSON.parse(JSON.stringify(context));
      canvas.width = this.width;
      canvas.height = this.height;
      Object.assign(context, contextCopy);
    }
    context.fillStyle = this.background;
    context.fillRect(0, 0, this.width, this.height);
  }
}
customElements.define("m-canvas", Canvas);

const xy = (baseClass: typeof MarkerElement) =>
  class extends baseClass {
    get x() {
      return this.optionalInherit("x", 0);
    }
    set x(arg) {
      this.setFirstTime("x", "number", arg);
    }
    get y() {
      return this.optionalInherit("y", 0);
    }
    set y(arg) {
      this.setFirstTime("y", "number", arg);
    }
  };

const fill = (baseClass: typeof MarkerElement) =>
  class extends baseClass {
    get fill() {
      return this.optionalInherit("fill", "#000000");
    }
    set fill(arg) {
      this.setFirstTime("fill", "string", arg);
      const baseRender = this.render.bind(this);
      this.render = (context) => {
        context.fillStyle = this.fill;
        baseRender(context);
      };
    }
  };

const stroke = (baseClass: typeof MarkerElement) =>
  class extends baseClass {
    get stroke() {
      return "#000000";
    }
    set stroke(argument) {
      this.setFirstTime("stroke", "string", argument);
      const baseRender = this.render.bind(this);
      this.render = (context) => {
        context.strokeStyle = this.stroke;
        baseRender(this, context);
      };
    }
  };

class Rectangle extends xy(fill(stroke(MarkerElement))) {
  render(context: CanvasRenderingContext2D) {
    super.render(context);
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
customElements.define("m-rectangle", Rectangle);

dispatchEvent(new Event("customElementsDefined"));
