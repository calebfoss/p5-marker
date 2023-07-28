import { VisibleElement } from "../elements/visible";

export const clickable = <T extends typeof VisibleElement>(baseClass: T) =>
  class ClickableElement extends baseClass {
    #click_x: number;
    #click_y: number;
    #canvas_clicked_at = -1;
    #clicked = false;
    get clicked() {
      return this.#clicked;
    }
    onCanvasClicked(x: number, y: number, time: DOMHighResTimeStamp): void {
      this.#click_x = x;
      this.#click_y = y;
      this.#canvas_clicked_at = time;
    }
    checkClick(context: CanvasRenderingContext2D): void {
      this.#clicked =
        this.#canvas_clicked_at >
        this.window.frame_start - this.window.delta_time
          ? context.isPointInPath(this.#click_x, this.#click_y)
          : false;
    }
  };
