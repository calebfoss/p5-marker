import "../src/index";
import { MarkerWindow } from "../src/elements/window";
import { CanvasRenderingContext2D } from "canvas";

global.CanvasRenderingContext2D = CanvasRenderingContext2D as any;
let windowElement: MarkerWindow;
let drawListener: EventListener;
let onDraw: () => void;
let frame: number;
const framesPerTest = 1;
let done: Promise<boolean>;

beforeEach(() => {
  windowElement = document.createElement("m-window") as MarkerWindow;
  onDraw = () => {};
  frame = 0;
  done = new Promise((resolve) => {
    drawListener = () => {
      onDraw();
      expect(windowElement.frame).toBe(frame);
      frame++;
      if (frame > framesPerTest) {
        resolve(frame === framesPerTest + 1);
        windowElement.removeEventListener("draw", drawListener);
      }
    };
    windowElement.addEventListener("draw", drawListener);
  });
});

afterEach(() => {
  windowElement.removeEventListener("draw", drawListener);
  windowElement.remove();
  windowElement = null;
});

const aKey = "a";
const bKey = "b";
const any = MarkerWindow.ANY;

test("key_down", async () => {
  let aDown0: boolean;
  let aDown1: boolean;
  let bDown0: boolean;
  let bDown1: boolean;
  let anyDown0: boolean;
  let anyDown1: boolean;
  onDraw = () => {
    switch (frame) {
      case 0:
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: aKey,
          })
        );
        aDown0 = windowElement.key_down(aKey);
        bDown0 = windowElement.key_down(bKey);
        anyDown0 = windowElement.key_down(any);
        break;
      case 1:
        aDown1 = windowElement.key_down(aKey);
        bDown1 = windowElement.key_down(bKey);
        anyDown1 = windowElement.key_down(any);
        break;
    }
  };
  windowElement.setup();
  await done;
  expect(aDown0).toBe(false);
  expect(bDown0).toBe(false);
  expect(anyDown0).toBe(false);
  expect(aDown1).toBe(true);
  expect(bDown1).toBe(false);
  expect(anyDown1).toBe(true);
});

test("key_held", async () => {
  let aHeld0: boolean;
  let bHeld0: boolean;
  let anyHeld0: boolean;
  let aHeld1: boolean;
  let bHeld1: boolean;
  let anyHeld1: boolean;
  onDraw = () => {
    switch (frame) {
      case 0:
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: aKey,
          })
        );
        aHeld0 = windowElement.key_held(aKey);
        bHeld0 = windowElement.key_held(bKey);
        anyHeld0 = windowElement.key_held(any);
        break;
      case 1:
        aHeld1 = windowElement.key_held(aKey);
        bHeld1 = windowElement.key_held(bKey);
        anyHeld1 = windowElement.key_held(any);
        break;
    }
  };
  windowElement.setup();
  await done;
  expect(aHeld0).toBe(false);
  expect(bHeld0).toBe(false);
  expect(aHeld0).toBe(false);
  expect(aHeld1).toBe(true);
  expect(bHeld1).toBe(false);
  expect(anyHeld1).toBe(true);
});

test("key_up", async () => {
  let aUp0: boolean;
  let bUp0: boolean;
  let anyUp0: boolean;
  let aUp1: boolean;
  let bUp1: boolean;
  let anyUp1: boolean;
  onDraw = () => {
    switch (frame) {
      case 0:
        window.dispatchEvent(
          new KeyboardEvent("keyup", {
            key: aKey,
          })
        );
        aUp0 = windowElement.key_up(aKey);
        bUp0 = windowElement.key_up(bKey);
        anyUp0 = windowElement.key_up(any);
        break;
      case 1:
        aUp1 = windowElement.key_up(aKey);
        bUp1 = windowElement.key_up(bKey);
        anyUp1 = windowElement.key_up(any);
        break;
    }
  };
  windowElement.setup();
  await done;
  expect(aUp0).toBe(false);
  expect(bUp0).toBe(false);
  expect(anyUp0).toBe(false);
  expect(aUp1).toBe(true);
  expect(bUp1).toBe(false);
  expect(anyUp1).toBe(true);
});
