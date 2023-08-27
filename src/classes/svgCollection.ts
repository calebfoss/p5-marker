export class SVGCollection {
  #group: SVGGElement;
  #element: SVGElement;
  #elementId: string;
  #defs: SVGDefsElement;
  #strokeGradient: SVGGradientElement;
  #fillGradient: SVGGradientElement;
  constructor(elementId: string, tag?: keyof SVGElementTagNameMap) {
    this.#elementId = elementId;
    this.#group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.#defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    this.#group.appendChild(this.#defs);
    if (typeof tag !== "undefined") {
      this.#element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        tag
      );
      this.#group.appendChild(this.#element);
    } else {
      this.#element = this.#group;
    }
  }
  copyAttributes(source: SVGElement, target: SVGElement) {
    for (const attr of source.attributes) {
      if (attr.name !== "id" && target.getAttribute(attr.name) !== attr.value)
        target.setAttribute(attr.name, attr.value);
    }
  }
  get element() {
    return this.#element;
  }
  get fillGradient() {
    return this.#fillGradient;
  }
  set fillGradient(gradientElement) {
    if (typeof this.#fillGradient === "undefined") {
      gradientElement.id = `${this.#elementId}-fill`;
      this.#defs.appendChild(gradientElement);
      this.#fillGradient = gradientElement;
      this.#group.setAttribute("fill", `url('#${gradientElement.id}')`);
    } else {
      this.copyAttributes(gradientElement, this.#fillGradient);
    }
  }
  get group() {
    return this.#group;
  }
  get strokeGradient() {
    return this.#strokeGradient;
  }
  set strokeGradient(gradientElement) {
    if (typeof this.#strokeGradient === "undefined") {
      gradientElement.id = `${this.#elementId}-stroke`;
      this.#defs.appendChild(gradientElement);
      this.#strokeGradient = gradientElement;
      this.#group.setAttribute("stroke", `url('#${gradientElement.id}')`);
    } else {
      this.copyAttributes(gradientElement, this.#strokeGradient);
    }
  }
}
