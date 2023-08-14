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
    if (typeof value === "object" && !(value instanceof HTMLElement)) {
      if (typeof target[key] === "undefined") {
        target[key] = Array.isArray(value) ? [] : {};
        deepAssign(target[key], value);
      } else if (
        target[key] === null ||
        value instanceof target[key].constructor
      ) {
        target[key] = value;
      } else deepAssign(target[key], value);
    } else target[key] = source[key];
  }
}
function deepEvaluateAndAssign<O extends object>(
  target: O,
  source: GettersFor<O>
) {
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "object") {
      if (typeof target[key] === "undefined")
        target[key] = Array.isArray(value) ? [] : {};
      deepEvaluateAndAssign(target[key], source[key]);
    } else {
      target[key] = source[key]();
    }
  }
}

/*
  This is called in setup(). If the element has a property that will
  be iterated with 'each' but does not have an initial value set for that 
  property, this turns the element's default value into an identity function
  and adds the function to the getBaseValues object.

  Example:
  <m-rectangle width="100" each.position.x="position.x + width" 
      repeat="until(position.x is at least canvas.width)"
       then.position.x="position.x + 1"></m-rectangle>
  Without calling this function, the row of rectangles would only render on
  screen in the first frame. After, its x coordinate would be too far to the
  right.
*/
function setGettersForPreIteration<O extends object>(
  valueHolder: O,
  getBaseValues: GettersFor<O>,
  getEachValues: GettersFor<O>
) {
  for (const [key, eachValue] of Object.entries(getEachValues)) {
    if (!(key in getBaseValues)) {
      if (typeof eachValue === "object") {
        getBaseValues[key] = Array.isArray(eachValue) ? [] : {};
        setGettersForPreIteration(
          valueHolder[key],
          getBaseValues[key],
          getEachValues[key]
        );
      } else getBaseValues[key] = identity(valueHolder[key]);
    }
  }
}

const drawEvent = new Event("draw");

export class Base extends HTMLElement {
  #dynamicAssigners: (() => void)[] = [];
  #oneTimeAssigners: (() => void)[] = [];
  #getConstantValues: GettersFor<this> = {};
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
  get canvas() {
    if (this.parentElement instanceof Base) return this.parentElement.canvas;
    return null;
  }
  get count() {
    return this.#count;
  }
  create(tag: string, id?: string) {
    tag = tag.slice(0, 2) === "m-" ? tag : `m-${tag}`;
    const element = document.createElement(tag);
    if (typeof id !== "undefined") {
      if (document.querySelector(`#${id}`) !== null)
        throw new Error(
          `Tried to create ${tag} with id ${id}, but this id is already in use`
        );
      element.id = id;
    }
    this.appendChild(element);
    return element;
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
  #update_frame = -1;
  #preIterationValues: Partial<this> = {};
  draw(parentElement: Node): void;
  draw(context: CanvasRenderingContext2D): void;
  draw(argument: Node | CanvasRenderingContext2D): void {
    if (!this.on) return;
    for (const assigner of this.#dynamicAssigners) {
      assigner();
    }
    if (this.#update_frame !== this.frame) {
      if (this.#update_frame === -1) {
        this.#firstUpdate();
      } else {
        deepEvaluateAndAssign(this.#preIterationValues, this.#getBaseValues);
        deepAssign(this, this.#preIterationValues);
      }
      this.#update_frame = this.frame;
      while (this.#svgGroups.length > this.#count) {
        this.#svgGroups.pop().remove();
      }
      while (this.#documentElements.length > this.#count) {
        this.#documentElements.pop().remove();
      }
      this.#count = 0;
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
    deepAssign(this, this.#preIterationValues);
  }
  #firstUpdate() {
    for (const assigner of this.#oneTimeAssigners) {
      assigner();
    }
    setGettersForPreIteration(this, this.#getBaseValues, this.#getEachValues);
    deepEvaluateAndAssign(this.#preIterationValues, this.#getBaseValues);
    deepEvaluateAndAssign(this, this.#getConstantValues);
    deepAssign(this, this.#preIterationValues);
    deepAssign(this.#getBaseValues, this.#getThenValues);
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
  #getOn = () => this.inherit("on", true);
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
    this.styleDocumentElement();
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
    const constantBase = deepProxy(this, this.#getConstantValues);
    const dynamicBase = deepProxy(this, this.#getBaseValues);
    const each = deepProxy(this, this.#getEachValues);
    const then = deepProxy(this, this.#getThenValues);
    for (const attribute of this.attributes) {
      try {
        interpret(
          this,
          this.#dynamicAssigners,
          this.#oneTimeAssigners,
          attribute,
          constantBase,
          dynamicBase,
          each,
          then
        );
      } catch (error) {
        console.error(
          `The following error occurred when interpreting ${this.tagName}'s ${attribute.name} attribute:`
        );
        console.error(error);
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
  styleDocumentElement() {
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
