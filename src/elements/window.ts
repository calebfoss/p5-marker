import { MarkerElement } from "./base";

export class Window extends MarkerElement {
  constructor() {
    super();
    window.addEventListener("mousedown", (e) => {
      this.#mouseDownAt = performance.now();
    });
    window.addEventListener("mouseup", (e) => {
      this.#mouseUpAt = performance.now();
    });
    window.addEventListener("mousemove", (e) => {
      this.#mouseMoveAt = performance.now();
      this.#mouse_x = e.x;
      this.#mouse_y = e.y;
    });
    window.addEventListener("customElementsDefined", () => this.setup());
    const shadowDOM = this.attachShadow({ mode: "open" });
    const drawEvent = new Event("draw");
    const drawFrame = () => {
      this.dispatchEvent(drawEvent);
      this.#previousFrameStartAt = this.#currentFrameStartAt;
      this.#currentFrameStartAt = performance.now();
      this.draw(shadowDOM);
      this.#frame++;
      requestAnimationFrame(drawFrame);
    };
    requestAnimationFrame(drawFrame);
  }
  #frame = 0;
  #previousFrameStartAt = 0;
  #currentFrameStartAt = 0;
  get frame() {
    return this.#frame;
  }
  #mouseDownAt = 0;
  #mouseUpAt = 0;
  #mouseMoveAt = 0;
  #mouse_x = 0;
  #mouse_y = 0;
  get mouse() {
    const down =
      this.frame > 0 &&
      this.#mouseDownAt < this.#currentFrameStartAt &&
      this.#mouseDownAt >= this.#previousFrameStartAt;
    const up =
      this.frame > 0 &&
      this.#mouseUpAt < this.#currentFrameStartAt &&
      this.#mouseUpAt >= this.#previousFrameStartAt;
    const held = this.#mouseUpAt < this.#mouseDownAt;
    const moving = this.#mouseMoveAt > this.#previousFrameStartAt;
    const dragging = held && moving;
    return {
      down,
      up,
      held,
      moving,
      dragging,
      x: this.#mouse_x,
      y: this.#mouse_y,
    };
  }
  get window() {
    return this;
  }
}
customElements.define("m-window", Window);
