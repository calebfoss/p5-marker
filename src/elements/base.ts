import { vector } from "../mixins/vector";
import { interpret } from "../interpreter/interpreter";
import { math } from "../mixins/math";
import { color } from "../mixins/color";
import { constants } from "../mixins/constants";
import { random } from "../mixins/random";
import { transform } from "../mixins/transform";
import { MarkerWindow } from "./window";
import { gradient } from "../mixins/gradient";
import { SVGCollection } from "../classes/svgCollection";

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
        value instanceof target[key].constructor ||
        typeof target[key] !== "object"
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
    } else if (typeof target[key] === "object") {
      const evaluated = (value as Function)();
      deepAssign(target[key], evaluated);
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
  protected addInputListeners(element: HTMLElement | SVGElement) {
    const { count } = this;
    element.addEventListener("click", (e) => {
      this.#clicked_at[count] = this.frame;
      this.dispatchEvent(new MouseEvent("click", e));
    });
    element.addEventListener("mouseenter", (e) => {
      this.#hovered[count] = true;
      this.dispatchEvent(new MouseEvent("mouseenter", e));
    });
    element.addEventListener("mouseleave", (e) => {
      this.#hovered[count] = false;
      this.dispatchEvent(new MouseEvent("mouseleave", e));
    });
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
  #atFrameStart() {
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
    while (this.#clicked_at.length > this.#count) {
      this.#clicked_at.pop();
    }
    while (this.#hovered.length > this.#count) {
      this.#hovered.pop();
    }
    this.#count = 0;
    this.#frames_on++;
  }
  get canvas() {
    if (this.parentElement instanceof Base) return this.parentElement.canvas;
    return null;
  }
  #clicked_at: number[] = [];
  get clicked() {
    while (this.count > this.#clicked_at.length) {
      this.#clicked_at[this.#clicked_at.length] = -2;
    }
    return this.#clicked_at[this.count] === this.frame - 1;
  }
  connectedCallback() {
    if (this.id === "") {
      let index = 0;
      const idPrefix = "marker-element";
      while (document.querySelector(`#${idPrefix}${index}`) !== null) index++;
      this.id = idPrefix + index;
    }
  }
  get count() {
    if (this.#update_frame !== this.frame) this.#atFrameStart();
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
    const element = document.createElement(this.documentTag);
    element.id = `${this.id}-dom${this.#count}`;
    this.addInputListeners(element);
    return element;
  }
  protected createSVGGroup(): SVGGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", "g");
  }
  #documentElementStyle: Partial<CSSStyleDeclaration> = {
    background: "rgb(255, 255, 255)",
    borderColor: "rgb(0, 0, 0)",
    borderStyle: "solid",
    borderWidth: "1px",
  };
  #documentElements: (HTMLElement | SVGElement)[] = [];
  get document_element() {
    if (this.count >= this.#documentElements.length) {
      this.#documentElements[this.count] = this.createDocumentElement();
    }
    return this.#documentElements[this.count];
  }
  protected documentTag: keyof HTMLElementTagNameMap = "div";
  #update_frame = -1;
  #preIterationValues: Partial<this> = {};
  draw(parentElement: HTMLElement | SVGElement): void;
  draw(context: CanvasRenderingContext2D): void;
  draw(argument: HTMLElement | CanvasRenderingContext2D | SVGElement): void {
    if (!this.on) {
      if (argument instanceof SVGElement) {
        this.#svgGroups[this.#count]?.remove();
      } else if (argument instanceof HTMLElement) {
        this.#documentElements[this.#count]?.remove();
      }
      return;
    }
    for (const assigner of this.#dynamicAssigners) {
      assigner();
    }
    if (this.#update_frame !== this.frame) {
      this.#atFrameStart();
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
  #hovered: boolean[] = [];
  get hovered() {
    while (this.count > this.#hovered.length) {
      this.#hovered[this.#hovered.length] = false;
    }
    return this.#hovered[this.count];
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
    const { mouse } = this.window;
    const { pixel_density } = this.canvas;
    const mouse_x = mouse.x * pixel_density;
    const mouse_y = mouse.y * pixel_density;
    const wasHovered = this.#hovered;
    this.#hovered[this.count] =
      context.isPointInPath(mouse_x, mouse_y) ||
      //  Optional chaining because this method can not been implemented
      //  on node-canvas used for testing
      context.isPointInStroke?.(mouse_x, mouse_y);
    if (this.#hovered) {
      if (!wasHovered) {
        this.dispatchEvent(new MouseEvent("mouseenter"));
      }
      if (mouse.up) {
        this.#clicked_at[this.count] = this.frame;
        this.dispatchEvent(new MouseEvent("click"));
      }
    } else if (wasHovered) {
      this.dispatchEvent(new MouseEvent("mouseleave"));
    }
    context.beginPath();
    for (const child of this.children) {
      if (child instanceof Base) {
        child.draw(context);
      }
    }
  }
  renderToDOM(parentElement: HTMLElement | SVGElement) {
    const element = this.document_element;
    if (element.parentElement !== parentElement)
      parentElement.appendChild(element);
    this.styleDocumentElement();
    for (const child of this.children) {
      if (child instanceof Base) child.draw(element);
    }
  }
  renderToSVG(parentElement: Element) {
    const groupElement = this.svg_collection.group;
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
    const collection = this.svg_collection;
    const groupElement = collection.group;
    const element = collection.element;
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
  #svgCollections: SVGCollection[] = [];
  #svgGroups: SVGGElement[] = [];
  #previousSVGGroupStyle: { [attributeName: string]: string } = {};
  #nextSVGGroupStyle: { [attributeName: string]: string } = {};
  #previousSVGElementAttrs: { [attributeName: string]: string } = {};
  #nextSVGElementAttrs: { [attributeName: string]: string } = {};
  protected svgTag: keyof SVGElementTagNameMap;
  get svg_collection() {
    if (this.#count >= this.#svgCollections.length) {
      const collection = new SVGCollection(this.id, this.svgTag);
      this.#svgCollections[this.#count] = collection;
    }
    return this.#svgCollections[this.#count];
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

export class MarkerElement extends gradient(
  transform(color(random(constants(math(vector(Base))))))
) {}
