import { dimensions } from "../mixins/dimensions";
import { Mouse } from "../mixins/mouse";
import { MarkerElement } from "./base";

export class MarkerWindow extends dimensions(MarkerElement) {
  constructor() {
    super();
    window.addEventListener("mousedown", (e) => {
      this.#mouse.downAt = performance.now();
    });
    window.addEventListener("mouseup", (e) => {
      this.#mouse.upAt = performance.now();
    });
    window.addEventListener("mousemove", (e) => {
      this.#mouse.moveAt = performance.now();
      this.#mouse.previous.x = this.#mouse.x;
      this.#mouse.previous.y = this.#mouse.y;
      this.#mouse.x = e.x;
      this.#mouse.y = e.y;
    });
    window.addEventListener("customElementsDefined", () => this.setup());
    const shadowDOM = this.attachShadow({ mode: "open" });
    const drawFrame = () => {
      this.#previousFrameStartAt = this.#currentFrameStartAt;
      this.#currentFrameStartAt = performance.now();
      this.#delta_time = this.#currentFrameStartAt - this.#previousFrameStartAt;
      this.draw(shadowDOM);
      this.#frame++;
      requestAnimationFrame(drawFrame);
    };
    requestAnimationFrame(drawFrame);
  }
  #delta_time = 0;
  get delta_time() {
    return this.#delta_time;
  }
  get document_element() {
    return this;
  }
  #frame = 0;
  #previousFrameStartAt = 0;
  #currentFrameStartAt = 0;
  get frame() {
    return this.#frame;
  }
  get frame_start() {
    return this.#currentFrameStartAt;
  }
  #mouse = new Mouse(this);
  get mouse() {
    return this.#mouse;
  }
  get pixel_density() {
    return window.devicePixelRatio;
  }
  get previous_frame_start() {
    return this.#previousFrameStartAt;
  }
  renderToDOM(parentElement: Node): void {
    for (const child of this.children) {
      if (child instanceof MarkerElement) child.draw(this.shadowRoot);
    }
  }
  get window() {
    return this;
  }
}
customElements.define("m-window", MarkerWindow);
