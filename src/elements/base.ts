import { vector } from "../mixins/vector";
import { interpret } from "../interpreter/interpreter";
import { math } from "../mixins/math";
import { color } from "../mixins/color";
import { constants } from "../mixins/constants";
import { random } from "../mixins/random";
import { transform } from "../mixins/transform";
import { MarkerWindow } from "./window";

export const identity =
  <T>(value: T) =>
  () =>
    value;

function deepProxy<O extends object>(
  owner: O,
  obj: GettersFor<O>
): GettersFor<O> {
  return new Proxy(obj, {
    get(target, propertyName) {
      if (!(propertyName in target))
        target[propertyName] = Array.isArray(owner[propertyName]) ? [] : {};
      return deepProxy(owner[propertyName], target[propertyName]);
    },
    has(target, propertyName) {
      return propertyName in owner;
    },
  });
}

export type GettersFor<O extends object> = {
  [K in keyof O]?: O[K] extends object ? GettersFor<O[K]> : () => O[K];
};

function deepAssign(target: object, source: GettersFor<object>) {
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "object") {
      if (typeof target[key] === "undefined") {
        target[key] = Array.isArray(value) ? [] : {};
        deepAssign(target[key], value);
      } else if (value instanceof target[key].constructor) target[key] = value;
      else deepAssign(target[key], value);
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
  #base = deepProxy(this, this.#getBaseValues);
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
  protected createDocumentElement(): HTMLElement | SVGSVGElement {
    const element = document.createElement("div");
    this.forward(element, MouseEvent, "click");
    return element;
  }
  protected createSVGGroup(): SVGGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", "g");
  }
  #documentElementStyle: Partial<CSSStyleDeclaration> = {
    background: "rgb(255, 255, 255)",
    outlineColor: "rgb(0, 0, 0)",
    outlineStyle: "solid",
    outlineWidth: "1px",
  };
  #documentElements: (HTMLElement | SVGSVGElement)[] = [];
  get document_element() {
    if (this.count >= this.#documentElements.length) {
      this.#documentElements[this.count] = this.createDocumentElement();
    }
    return this.#documentElements[this.count];
  }
  protected forward<T extends keyof HTMLElementEventMap>(
    element: HTMLElement | SVGElement,
    EventConstructor: new (type: T, event: Event) => HTMLElementEventMap[T],
    type: T
  ) {
    element.addEventListener(type, (e) => {
      this.dispatchEvent(new EventConstructor(type, e));
    });
  }
  #render_frame = -1;
  #nextValues: Partial<this> = {};
  #preIterationValues: Partial<this> = {};
  draw(parentElement: Node): void;
  draw(context: CanvasRenderingContext2D): void;
  draw(argument: Node | CanvasRenderingContext2D): void {
    if (!this.on) return;
    for (const updater of this.#updaters) {
      updater();
    }
    if (this.#render_frame !== this.frame) {
      this.#render_frame = this.frame;
      while (this.#svgGroups.length > this.#count) {
        console.log(Array.isArray(this.#svgGroups));
        this.#svgGroups.pop().remove();
      }
      this.#count = 0;
      updateIfNotIn(this.#nextValues, this.#getBaseValues, this.#getThenValues);
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
      if (!this.repeat) {
        break;
      }
      if (this.#count >= this.max_count) {
        console.warn(
          `${this.tagName} reached its maximum iteration count of ${this.max_count}`
        );
        break;
      }
    }
    this.#frames_on++;
  }
  #each = deepProxy(this, this.#getEachValues);
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
  #getOn = () => true;
  get on() {
    return this.#getOn();
  }
  set on(value) {
    if (typeof value === "function") this.#getOn = value;
    else this.#getOn = identity(value);
  }
  get parent() {
    return this.parentElement;
  }
  set parent(element: Element) {
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
    const element = this.document_element;
    if (element.parentElement !== parentElement)
      parentElement.appendChild(element);
    this.styleDocumentElement(element);
    for (const child of this.children) {
      if (child instanceof Base) child.draw(element);
    }
  }
  renderToSVG(parentElement: Element) {
    const groupElement = this.svg_group;
    if (parentElement !== groupElement.parentElement)
      parentElement.appendChild(groupElement);
    this.styleSVGElement();
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
    if (!("on" in this.#nextValues) || this.#nextValues.on) {
      deepAssign(this, this.#nextValues);
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
  setContextProperty<K extends keyof CanvasRenderingContext2D>(
    key: K,
    value: CanvasRenderingContext2D[K]
  ) {
    this.#canvas_style[key] = value;
  }
  setDocumentElementStyle<K extends keyof CSSStyleDeclaration>(
    key: K,
    value: CSSStyleDeclaration[K]
  ) {
    this.#documentElementStyle[key] = value;
  }
  setSVGStyle(attributeName: string, value: string) {
    if (this.#previousSVGGroupStyle[attributeName] !== value)
      this.#nextSVGGroupStyle[attributeName] = value;
  }
  setSVGElementAttribute(attributeName: string, value: string) {
    if (this.#previousSVGElementAttrs[attributeName] !== value) {
      this.#nextSVGElementAttrs[attributeName] = value;
    }
  }
  styleContext(context: CanvasRenderingContext2D) {
    Object.assign(context, this.#canvas_style);
  }
  styleDocumentElement(element: Element) {
    Object.assign(this.document_element.style, this.#documentElementStyle);
  }
  styleSVGElement(newElement = false) {
    const groupElement = this.svg_group;
    const element = this.svg_element;
    if (newElement) {
      for (const [attributeName, value] of Object.entries(
        this.#previousSVGGroupStyle
      )) {
        groupElement.setAttribute(attributeName, value);
      }
      for (const [attributeName, value] of Object.entries(
        this.#previousSVGElementAttrs
      )) {
        element.setAttribute(attributeName, value);
      }
    }
    for (const [attributeName, value] of Object.entries(
      this.#nextSVGGroupStyle
    )) {
      groupElement.setAttribute(attributeName, value);
      this.#previousSVGGroupStyle[attributeName] = value;
      delete this.#nextSVGGroupStyle[attributeName];
    }

    for (const [attributeName, value] of Object.entries(
      this.#nextSVGElementAttrs
    )) {
      element.setAttribute(attributeName, value);
      this.#previousSVGElementAttrs[attributeName] = value;
      delete this.#nextSVGElementAttrs[attributeName];
    }
  }
  #svgGroups: SVGGElement[] = [];
  #previousSVGGroupStyle: { [attributeName: string]: string } = {};
  #nextSVGGroupStyle: { [attributeName: string]: string } = {};
  #previousSVGElementAttrs: { [attributeName: string]: string } = {};
  #nextSVGElementAttrs: { [attributeName: string]: string } = {
    fill: "#ffffff",
    stroke: "#000000",
  };
  get svg_group(): SVGGElement {
    if (this.count >= this.#svgGroups.length) {
      this.#svgGroups[this.#count] = this.createSVGGroup();
      this.styleSVGElement(true);
    }
    return this.#svgGroups[this.#count];
  }
  get svg_element() {
    return this.svg_group;
  }
  protected get svgElementNextAttrs() {
    return this.#nextSVGElementAttrs;
  }
  #then = deepProxy(this, this.#getThenValues);
  get then() {
    return this.#then;
  }
  get window(): MarkerWindow {
    if (this.parentElement instanceof Base) return this.parentElement.window;
    throw new Error(
      `${this.tagName} tried to access its window property, but its parent is not a Marker element`
    );
  }
}

export class MarkerElement extends transform(
  color(random(constants(math(vector(Base)))))
) {}
