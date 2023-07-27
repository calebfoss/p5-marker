import "../src/index";
import { Window } from "../src/elements/window";
import { Canvas as MarkerCanvas } from "../src/elements/canvas";
import { Setting } from "../src/elements/setting";
import { CanvasRenderingContext2D } from "canvas";

global.CanvasRenderingContext2D = CanvasRenderingContext2D as any;
let windowElement: Window, canvasElement: MarkerCanvas, settingElement: Setting;
const inheritValue = 123456;

beforeEach(async () => {
  windowElement = document.createElement("m-window") as Window;
  canvasElement = document.createElement("m-canvas") as MarkerCanvas;
  settingElement = document.createElement("m-setting") as Setting;
  settingElement.setAttribute("change.position.x", "position.x + 1");
  settingElement.setAttribute("each.position.x", "position.x + 1");
  settingElement.setAttribute("repeat", "until position.x is at least 10");
  settingElement.setAttribute("position.y", "angle");
  canvasElement.setAttribute("test", inheritValue.toString());
  windowElement.appendChild(canvasElement).appendChild(settingElement);
  await new Promise((resolve) => {
    windowElement.addEventListener("setup", () => {
      resolve(true);
    });
    windowElement.setup();
  });
});

afterEach(() => {
  windowElement.remove();
  windowElement = canvasElement = settingElement = null;
  expect(windowElement).toBe(null);
  expect(canvasElement).toBe(null);
  expect(settingElement).toBe(null);
});

test("create elements", () => {
  expect(windowElement).not.toBe(null);
  expect(canvasElement).not.toBe(null);
  expect(settingElement).not.toBe(null);
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

test("dimensions", () => {
  expect(settingElement.width).toBe(window.innerWidth);
  expect(settingElement.height).toBe(window.innerHeight);
});

test("getter", async () => {
  for (let frame = 0; frame < 10; frame++) {
    canvasElement.angle = frame;
    settingElement.draw(canvasElement.drawing_context);
    expect(settingElement.position.y).toBe(frame);
    frame++;
  }
});

test("each", () => {
  const baseRender = settingElement.renderToCanvas.bind(settingElement);
  let calls = 0;
  settingElement.renderToCanvas = (context) => {
    calls++;
    baseRender(context);
  };
  settingElement.draw(canvasElement.drawing_context);
  expect(calls).toBe(10);
});

test("change", async () => {
  let frame = 0;
  while (frame < 10) {
    expect(settingElement.position.x).toBe(frame);
    settingElement.draw(canvasElement.drawing_context);
    frame++;
  }
  settingElement.addChange(
    settingElement.propertyManager.position.object.propertyManager.x,
    () => settingElement.position.x + 1
  );
  const startingFrame = frame;
  while (frame < 20) {
    expect(settingElement.position.x).toBe(frame + (frame - startingFrame));
    settingElement.draw(canvasElement.drawing_context);
    frame++;
  }
});

test("inherit", async () => {
  expect(settingElement.inherit("test", 0)).toBe(inheritValue);
  expect(settingElement.inherit("nonexistent", 0)).toBe(0);
});
