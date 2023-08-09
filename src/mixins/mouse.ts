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
