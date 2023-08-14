import { MarkerWindow } from "../elements/window";
import { Vector } from "./vector";

export class Mouse extends Vector {
  #downAt = -1;
  #moveAt = -1;
  #previous = new Vector(0, 0);
  #upAt = -1;
  #window: MarkerWindow;
  constructor(window: MarkerWindow) {
    super(0, 0);
    this.#window = window;
    window.addEventListener("mousedown", (e) => {
      this.#downAt = performance.now();
    });
    window.addEventListener("mouseup", (e) => {
      this.#upAt = performance.now();
    });
    window.addEventListener("mousemove", (e) => {
      this.#moveAt = performance.now();
      this.#previous.x = this.x;
      this.#previous.y = this.y;
      this.x = e.x;
      this.y = e.y;
    });
  }
  set downAt(value: number) {
    this.#downAt = value;
  }
  get down() {
    return (
      this.#downAt >= this.#window.previous_frame_start &&
      this.#downAt < this.#window.frame_start
    );
  }
  get dragging() {
    return this.held && this.moving;
  }
  get held() {
    return this.#upAt < this.#downAt;
  }
  set moveAt(value: number) {
    this.#moveAt = value;
  }
  get moving() {
    return this.#moveAt > this.#window.previous_frame_start;
  }
  get previous() {
    return this.#previous;
  }
  set upAt(value: number) {
    this.#upAt = value;
  }
  get up() {
    return (
      this.#upAt >= this.#window.previous_frame_start &&
      this.#upAt < this.#window.frame_start
    );
  }
}
