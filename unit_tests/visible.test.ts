import "../src/index";
import { MarkerWindow } from "../src/elements/window";
import { MarkerCanvas } from "../src/elements/canvas";
import { CanvasRenderingContext2D } from "canvas";
import { Rectangle } from "../src/elements/rectangle";

global.CanvasRenderingContext2D = CanvasRenderingContext2D as any;
let windowElement: MarkerWindow,
  canvasElement: MarkerCanvas,
  rectElement: Rectangle;
let drawListener: EventListener;
let onDraw: () => void;
let frame: number;
const framesPerTest = 10;
let done: Promise<boolean>;

beforeEach(async () => {
  windowElement = document.createElement("m-window") as MarkerWindow;
  canvasElement = document.createElement("m-canvas") as MarkerCanvas;
  rectElement = document.createElement("m-rectangle") as Rectangle;
  windowElement.appendChild(canvasElement).appendChild(rectElement);
  onDraw = () => {};
  frame = 0;
  done = new Promise((resolve) => {
    drawListener = () => {
      onDraw();
      expect(windowElement.frame).toBe(frame);
      frame++;
      if (frame === framesPerTest) resolve(true);
    };
    windowElement.addEventListener("draw", drawListener);
  });
});

afterEach(() => {
  windowElement.remove();
  canvasElement.remove();
  rectElement.remove();
  windowElement = canvasElement = rectElement = null;
});

test("canvas render", async () => {
  rectElement.setAttribute("visible", "frame % 2 is 0");
  let calls = 0;
  canvasElement.drawing_context.rect = () => {
    calls++;
  };
  windowElement.setup();
  await done;
  expect(calls).toBe(Math.ceil(framesPerTest / 2));
});
