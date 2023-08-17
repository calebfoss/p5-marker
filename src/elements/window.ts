import { dimensions } from "../mixins/dimensions";
import { Mouse } from "../mixins/mouse";
import { MarkerElement } from "./base";

export class MarkerWindow extends dimensions(MarkerElement) {
  constructor() {
    super();
    window.addEventListener("customElementsDefined", () => this.setup());
    window.addEventListener("keydown", (e) => {
      this.#keyDown.set(e.key, this.frame);
      this.#keyDown.set(e.code, this.frame);
    });
    window.addEventListener("keyup", (e) => {
      this.#keyUp.set(e.key, this.frame);
      this.#keyUp.set(e.code, this.frame);
    });
    const drawFrame = () => {
      this.#previousFrameStartAt = this.#currentFrameStartAt;
      this.#currentFrameStartAt = performance.now();
      this.#delta_time = this.#currentFrameStartAt - this.#previousFrameStartAt;
      this.draw(this);
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
  #keyDown = new Map<string, number>();
  #keyUp = new Map<string, number>();
  key_down(key: string) {
    if (key === MarkerWindow.ANY) {
      for (const value of this.#keyDown.values()) {
        if (value === this.frame - 1) return true;
      }
      return false;
    }
    const frameDown = this.#keyDown.get(key);
    return frameDown === this.frame - 1;
  }
  key_held(key: string) {
    if (key === MarkerWindow.ANY) {
      for (const [otherKey, downValue] of this.#keyDown.entries()) {
        const upValue = this.#keyUp.get(otherKey);
        if (typeof upValue === "undefined") return true;
        if (upValue < downValue) return true;
      }
      return false;
    }
    const frameDown = this.#keyDown.get(key);
    if (typeof frameDown === "undefined" || frameDown === this.frame)
      return false;
    const frameUp = this.#keyUp.get(key);
    if (typeof frameUp === "undefined") return true;
    return frameUp < frameDown;
  }
  key_up(key: string) {
    if (key === MarkerWindow.ANY) {
      for (const value of this.#keyUp.values()) {
        if (value === this.frame - 1) return true;
      }
      return false;
    }
    const frameUp = this.#keyUp.get(key);
    return frameUp === this.frame - 1;
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
  get window() {
    return this;
  }
}
customElements.define("m-window", MarkerWindow);
