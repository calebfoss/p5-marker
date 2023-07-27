import { MarkerElement, createProperty } from "./base";

export class VisibleElement extends MarkerElement {
  constructor(...args: any[]) {
    super(...args);
    this.propertyManager.visible = this.#visible;
  }
  declare propertyManager: PropertyManager<VisibleElement>;
  #visible = createProperty(() => this.inherit("visible", true));
  get visible() {
    return this.#visible.get();
  }
  set visible(value) {
    this.#visible.set(value);
  }
  styleDOMElement(element: HTMLElement): void {
    element.style.display = this.visible ? "unset" : "none";
  }
}
