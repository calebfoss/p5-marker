import "../src/index";
import { Window } from "../src/elements/window";
import { Canvas } from "../src/elements/canvas";
import { MarkerElement } from "../src/elements/base";

const windowElement = document.createElement("m-window") as Window;
const canvasElement = document.createElement("m-canvas") as Canvas;
const settingElement = document.createElement("m-setting") as MarkerElement;

test("create elements", () => {
  expect(windowElement).not.toBe(null);
  expect(canvasElement).not.toBe(null);
  expect(settingElement).not.toBe(null);
});

windowElement.appendChild(canvasElement).appendChild(settingElement);

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
  expect(settingElement.optionalInherit("test", 0)).toBe(
    optionalInheritTestValue
  );
});
