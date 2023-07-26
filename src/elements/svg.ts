import { MarkerElement } from "./base";
import { dimensions } from "../mixins/dimensions";

export class MarkerSVG extends dimensions(MarkerElement) {
  #dom_element: SVGElement;
  constructor(...args: any[]) {
    super(...args);
    this.#dom_element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
  }
  renderToDOM(parentElement: Node): void {
    if (parentElement !== this.#dom_element.parentElement)
      parentElement.appendChild(this.#dom_element);
    this.styleDOMElement(this.#dom_element);
    super.renderToSVG(this.#dom_element);
  }
}
customElements.define("m-svg", MarkerSVG);
