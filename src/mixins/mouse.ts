import { MarkerWindow } from "../elements/window";
import { Vector } from "../classes/vector";

export class Mouse extends Vector {
  #downAt = -2;
  #moveAt = -2;
  #previous = new Vector(0, 0);
  #upAt = -2;
  #window: MarkerWindow;
  constructor(window: MarkerWindow) {
    super(0, 0);
    this.#window = window;
    window.addEventListener("mousedown", (e) => {
      this.#downAt = window.frame;
    });
    window.addEventListener("mouseup", (e) => {
      this.#upAt = window.frame;
    });
    window.addEventListener("mousemove", (e) => {
      this.#moveAt = window.frame;
      this.#previous.x = this.x;
      this.#previous.y = this.y;
      this.x = e.x;
      this.y = e.y;
    });
  }
  get down() {
    return this.#downAt === this.#window.frame - 1;
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
    return this.#moveAt === this.#window.frame - 1;
  }
  get previous() {
    return this.#previous;
  }
  get up() {
    return this.#upAt === this.#window.frame - 1;
  }
}
