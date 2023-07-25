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

const setupComplete = new Promise((resolve) => {
  windowElement.addEventListener("setupComplete", () => {
    resolve(true);
  });
  windowElement.setup();
});

test("optionalInherit", async () => {
  await setupComplete;
  expect(settingElement.inherit("test", 0)).toBe(optionalInheritTestValue);
  expect(settingElement.inherit("nonexistent", 0)).toBe(0);
});
