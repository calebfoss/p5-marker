import { MarkerElement } from "./base";

export class MarkerWindow extends MarkerElement {
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
  #frame = 0;
  #previousFrameStartAt = 0;
  #currentFrameStartAt = 0;
  get frame() {
    return this.#frame;
  }
  get frame_start() {
    return this.#currentFrameStartAt;
  }
  #mouseDownAt = -1;
  #mouseUpAt = -1;
  #mouseMoveAt = -1;
  #mouse_x = 0;
  #mouse_y = 0;
  get mouse() {
    const down =
      this.#mouseDownAt < this.#currentFrameStartAt &&
      this.#mouseDownAt >= this.#previousFrameStartAt;
    const up =
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
customElements.define("m-window", MarkerWindow);
