import { MarkerElement } from "./base";

export class Canvas extends MarkerElement {
  #canvasElement: HTMLCanvasElement;
  #frame = 0;
  #previousFrameStartAt = 0;
  #currentFrameStartAt = 0;
  #mouseDownAt = 0;
  #mouseUpAt = 0;
  #mouseMoveAt = 0;
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
    });
    this.#canvasElement = document.createElement("canvas");
    this.#canvasElement.width = this.width;
    this.#canvasElement.height = this.height;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(this.#canvasElement);
    const context = this.#canvasElement.getContext("2d");
    if (context === null) return;
    const drawFrame = () => {
      this.#previousFrameStartAt = this.#currentFrameStartAt;
      this.#currentFrameStartAt = performance.now();
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
  download(filename = "MarkerSketch.jpg") {
    const extension = filename.slice(filename.lastIndexOf(".") + 1);
    let mimeType = "image/png";
    switch (extension) {
      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg";
      case "png":
      default:
        const dataURL = this.#canvasElement.toDataURL(mimeType);
        const anchor = document.createElement("a");
        anchor.href = dataURL;
        anchor.click();
    }
  }
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
      ...this.window.mouse,
      down,
      up,
      held,
      moving,
      dragging,
    };
  }
  render(context: CanvasRenderingContext2D): void {
    const canvas = this.#canvasElement as HTMLCanvasElement;
    if (canvas.width !== this.width || canvas.height !== this.height) {
      const contextCopy = JSON.parse(JSON.stringify(context));
      canvas.width = this.width;
      canvas.height = this.height;
      Object.assign(context, contextCopy);
    }
    if (this.background !== null) {
      context.fillStyle = this.background;
      context.fillRect(0, 0, this.width, this.height);
    }
  }
}
