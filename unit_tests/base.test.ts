import "../src/index";
import { Window } from "../src/elements/window";
import { Canvas as MarkerCanvas } from "../src/elements/canvas";
import { Setting } from "../src/elements/setting";
import { CanvasRenderingContext2D } from "canvas";

global.CanvasRenderingContext2D = CanvasRenderingContext2D as any;
let windowElement: Window, canvasElement: MarkerCanvas, settingElement: Setting;
let drawListener: EventListener;
let onDraw: () => void;
let frame: number;
const framesPerTest = 10;
let done: Promise<boolean>;

beforeEach(() => {
  windowElement = document.createElement("m-window") as Window;
  canvasElement = document.createElement("m-canvas") as MarkerCanvas;
  settingElement = document.createElement("m-setting") as Setting;
  windowElement.appendChild(canvasElement).appendChild(settingElement);
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
  windowElement.removeEventListener("draw", drawListener);
  windowElement.remove();
  canvasElement.remove();
  settingElement.remove();
  windowElement = canvasElement = settingElement = null;
});

test("create elements", () => {
  expect(windowElement).not.toBe(null);
  expect(canvasElement).not.toBe(null);
  expect(settingElement).not.toBe(null);
});

test("getter", async () => {
  settingElement.setAttribute("position.y", "angle");
  onDraw = () => {
    canvasElement.angle = frame;
    expect(settingElement.position.y).toBe(frame);
  };
  windowElement.setup();
  await done;
});

test("each", async () => {
  const repeatUntil = 10;
  settingElement.setAttribute("each.position.x", "position.x + 1");
  settingElement.setAttribute(
    "repeat",
    `until position.x is at least ${repeatUntil}`
  );
  const baseRender = settingElement.renderToCanvas.bind(settingElement);
  let calls = 0;
  settingElement.renderToCanvas = (context) => {
    calls++;
    baseRender(context);
  };
  windowElement.setup();
  await done;
  expect(calls).toBe(framesPerTest * repeatUntil);
});

test("change", async () => {
  settingElement.setAttribute("change.position.x", "position.x + 1");
  onDraw = () => {
    expect(settingElement.position.x).toBe(frame);
  };
  windowElement.setup();
  await done;
});

test("addChange", async () => {
  settingElement.addChange(
    settingElement.propertyManager.position.object.propertyManager.x,
    () => settingElement.position.x + 1
  );
  onDraw = () => {
    expect(settingElement.position.x).toBe(frame);
  };
  windowElement.setup();
  await done;
});

test("addEach", async () => {
  settingElement.addEach(
    settingElement.propertyManager.angle,
    () => settingElement.angle + 1
  );
  const baseRender = settingElement.renderToCanvas.bind(settingElement);
  let calls: number;
  onDraw = () => {
    calls = 0;
  };
  settingElement.renderToCanvas = (context) => {
    expect(settingElement.angle).toBe(calls);
    calls++;
    baseRender(context);
  };
  windowElement.setup();
  await done;
});

test("addGetter", async () => {
  settingElement.addGetter(settingElement.propertyManager.width, () => frame);
  onDraw = () => {
    expect(settingElement.width).toBe(frame);
  };
  windowElement.setup();
  await done;
});

test("assert type", () => {
  expect(() => settingElement.assertType("test", 1, "number")).not.toThrow();
  expect(() => settingElement.assertType("test", 1, "boolean")).toThrow();
  expect(() =>
    settingElement.assertType("test", 1, "boolean", "number")
  ).not.toThrow();
});

test("canvas property", () => {
  expect(settingElement.canvas).toBe(canvasElement);
});

test("count", async () => {
  const baseRender = settingElement.renderToCanvas.bind(settingElement);
  let calls: number;
  onDraw = () => {
    calls = 0;
  };
  settingElement.renderToCanvas = (context) => {
    expect(settingElement.count).toBe(calls);
    calls++;
    baseRender(context);
  };
  windowElement.setup();
  await done;
});

test("frame", async () => {
  onDraw = () => {
    expect(windowElement.frame).toBe(canvasElement.frame);
    expect(canvasElement.frame).toBe(settingElement.frame);
    expect(settingElement.frame).toBe(frame);
  };
  windowElement.setup();
  await done;
});

test("inherit", async () => {
  const value = 123456;
  canvasElement.setAttribute("test", value.toString());
  windowElement.setup();
  await done;
  expect(settingElement.inherit("test", 0)).toBe(value);
  expect(settingElement.inherit("nonexistent", 0)).toBe(0);
});

test("max_count", async () => {
  const max_count = 100;
  settingElement.setAttribute("max_count", max_count.toString());
  settingElement.setAttribute("repeat", "true");
  const baseRender = settingElement.renderToCanvas.bind(settingElement);
  let calls = 0;
  settingElement.renderToCanvas = (context) => {
    calls++;
    baseRender(context);
  };
  windowElement.setup();
  await done;
  expect(frame).toBe(framesPerTest);
  expect(calls).toBe(framesPerTest * max_count);
});

test("on", async () => {
  settingElement.setAttribute("on", "frame % 2 is 0");
  const baseRender = settingElement.renderToCanvas.bind(settingElement);
  let calls = 0;
  settingElement.renderToCanvas = (context) => {
    calls++;
    baseRender(context);
  };
  windowElement.setup();
  await done;
  expect(calls).toBe(Math.floor(framesPerTest / 2));
});
