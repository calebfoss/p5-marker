import { MarkerElement } from "./base";

export class Canvas extends MarkerElement {
  #canvas_element: HTMLCanvasElement;
  #frame = 0;
  constructor() {
    super();
    this.#canvas_element = document.createElement("canvas");
    this.#canvas_element.width = this.width;
    this.#canvas_element.height = this.height;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(this.#canvas_element);
    const context = this.#canvas_element.getContext("2d");
    if (context === null) return;
    const drawFrame = () => {
      this.draw(context);
      this.#frame++;
      requestAnimationFrame(drawFrame);
    };
    requestAnimationFrame(drawFrame);
  }
  get background() {
    return "#fff";
  }
  set background(arg) {
    this.setFirstTime("background", "string", arg);
  }
  get canvas() {
    return this;
  }
  render(context: CanvasRenderingContext2D): void {
    const canvas = this.#canvas_element as HTMLCanvasElement;
    if (canvas.width !== this.width || canvas.height !== this.height) {
      const contextCopy = JSON.parse(JSON.stringify(context));
      canvas.width = this.width;
      canvas.height = this.height;
      Object.assign(context, contextCopy);
    }
    context.fillStyle = this.background;
    context.fillRect(0, 0, this.width, this.height);
  }
}
