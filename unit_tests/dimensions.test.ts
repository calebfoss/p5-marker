import "../src/index";
import { MarkerWindow } from "../src/elements/window";
import { MarkerCanvas } from "../src/elements/canvas";
import { Setting } from "../src/elements/setting";
import { CanvasRenderingContext2D } from "canvas";

global.CanvasRenderingContext2D = CanvasRenderingContext2D as any;
let windowElement: MarkerWindow,
  canvasElement: MarkerCanvas,
  settingElement: Setting;

beforeEach(async () => {
  windowElement = document.createElement("m-window") as MarkerWindow;
  canvasElement = document.createElement("m-canvas") as MarkerCanvas;
  settingElement = document.createElement("m-setting") as Setting;
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
  canvasElement.remove();
  settingElement.remove();
  windowElement = canvasElement = settingElement = null;
});

test("defaults", () => {
  expect(settingElement.width).toBe(window.innerWidth);
  expect(settingElement.height).toBe(window.innerHeight);
});

test("inheritance", () => {
  const width = 100;
  const height = 150;
  canvasElement.width = width;
  canvasElement.height = height;
  expect(settingElement.width).toBe(width);
  expect(settingElement.height).toBe(height);
});

test("set value", () => {
  const width = 200;
  const height = 250;
  settingElement.width = width;
  settingElement.height = height;
  expect(settingElement.width).toBe(width);
  expect(settingElement.height).toBe(height);
});
