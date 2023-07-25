import "../src/index";
import { Window } from "../src/elements/window";
import { Canvas } from "../src/elements/canvas";
import { Setting } from "../src/elements/setting";

const windowElement = document.createElement("m-window") as Window;
const canvasElement = document.createElement("m-canvas") as Canvas;
const settingElement = document.createElement("m-setting") as Setting;

test("create elements", () => {
  expect(windowElement).not.toBe(null);
  expect(canvasElement).not.toBe(null);
  expect(settingElement).not.toBe(null);
});

windowElement.appendChild(canvasElement).appendChild(settingElement);

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

const optionalInheritTestValue = 123456;
canvasElement.setAttribute("test", optionalInheritTestValue.toString());

settingElement.setAttribute("change.position.x", "position.x + 1");
settingElement.setAttribute("each.position.x", "position.x + 1");
settingElement.setAttribute("repeat", "until position.x is at least 10");
settingElement.setAttribute("position.y", "angle");

const setupComplete = new Promise((resolve) => {
  windowElement.addEventListener("setup", () => {
    resolve(true);
  });
  windowElement.setup();
});

let frame = 0;

test("each", async () => {
  const baseRender = settingElement.render.bind(settingElement);
  let calls = 0;
  settingElement.render = (context) => {
    calls++;
    baseRender(context);
  };
  settingElement.draw(canvasElement.drawing_context);
  frame++;
  expect(calls).toBe(10);
});

test("getter", async () => {
  await setupComplete;
  while (frame < 10) {
    canvasElement.angle = frame;
    settingElement.draw(canvasElement.drawing_context);
    expect(settingElement.position.y).toBe(frame);
    frame++;
  }
});

test("change", async () => {
  await setupComplete;
  while (frame < 20) {
    expect(settingElement.position.x).toBe(frame);
    settingElement.draw(canvasElement.drawing_context);
    frame++;
  }
  settingElement.addChange(() => {
    settingElement.position.x = settingElement.position.x + 1;
  });
  const startingFrame = frame;
  while (frame < 21) {
    expect(settingElement.position.x).toBe(frame + (frame - startingFrame));
    settingElement.draw(canvasElement.drawing_context);
    frame++;
  }
});

test("inherit", async () => {
  await setupComplete;
  expect(settingElement.inherit("test", 0)).toBe(optionalInheritTestValue);
  expect(settingElement.inherit("nonexistent", 0)).toBe(0);
});
