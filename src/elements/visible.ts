import { MarkerElement } from "./base";

export class VisibleElement extends MarkerElement {
  constructor(...args: any[]) {
    super(...args);
  }
  #visible: boolean = null;
  get visible() {
    if (this.#visible !== null) return this.#visible;
    return this.inherit("visible", true);
  }
  set visible(value) {
    this.#visible = value;
  }
  styleDOMElement(element: HTMLElement): void {
    element.style.display = this.visible ? "unset" : "none";
  }
}
