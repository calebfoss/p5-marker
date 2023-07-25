import { MarkerElement, identity, property } from "./base";

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
    this.propertyManager.background = this.#background;
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
  #background = property(this.gray(220));
  get background() {
    return this.#background.get();
  }
  set background(value) {
    this.#background.get = identity(value);
  }
  get canvas() {
    return this;
  }
  set download(filename: string) {
    const extension = filename.slice(filename.lastIndexOf(".") + 1);
    let mimeType = "image/png";
    let dataURL = "";
    switch (extension) {
      case "svg":
        const doc = this.toSVG();
        const serializer = new XMLSerializer();
        const xmlString = serializer.serializeToString(doc);
        const blob = new Blob([xmlString], { type: "image/svg" });
        dataURL = URL.createObjectURL(blob);
        break;
      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg";
      case "png":
      default:
        dataURL = this.#canvasElement.toDataURL(mimeType);
    }
    const anchor = document.createElement("a");
    anchor.href = dataURL;
    anchor.download = filename;
    anchor.click();
  }
  get frame() {
    return this.#frame;
  }
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
  toSVG() {
    const svgDoc = document.implementation.createDocument(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const root = svgDoc.documentElement as HTMLElement & SVGElement;
    root.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
    if (this.background !== null) {
      const backgroundElement = svgDoc.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      backgroundElement.setAttribute("stroke", "none");
      backgroundElement.setAttribute("fill", this.background);
      backgroundElement.setAttribute("width", this.width.toString());
      backgroundElement.setAttribute("height", this.height.toString());
      root.appendChild(backgroundElement);
    }
    super.toSVG(root);
    return svgDoc;
  }
}
customElements.define("m-canvas", Canvas);
