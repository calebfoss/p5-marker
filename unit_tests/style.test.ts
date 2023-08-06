import "../src/index";
import { MarkerWindow } from "../src/elements/window";
import { Canvas as MarkerCanvas } from "../src/elements/canvas";
import { Setting } from "../src/elements/setting";
import { CanvasRenderingContext2D } from "canvas";
import { wrapMethod } from "./base.test";

global.CanvasRenderingContext2D = CanvasRenderingContext2D as any;
let windowElement: MarkerWindow,
  canvasElement: MarkerCanvas,
  settingElement: Setting;
let drawListener: EventListener;
let frame: number;
const framesPerTest = 1;
let done: Promise<boolean>;

const fill1 = "#012345";
const fill2 = "#543210";
const stroke1 = "#012345";
const stroke2 = "#543210";
const line_cap1: CanvasLineCap = "round";
const line_cap2: CanvasLineCap = "square";
const line_join1: CanvasLineJoin = "bevel";
const line_join2: CanvasLineJoin = "miter";
const line_width1 = 5;
const line_width2 = 10;

beforeEach(() => {
  windowElement = document.createElement("m-window") as MarkerWindow;
  canvasElement = document.createElement("m-canvas") as MarkerCanvas;
  settingElement = document.createElement("m-setting") as Setting;
  windowElement.appendChild(canvasElement).appendChild(settingElement);
  frame = 0;
  done = new Promise((resolve) => {
    drawListener = () => {
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

test("fill - canvas", async () => {
  settingElement.setAttribute("fill", `'${fill1}'`);
  let renderFill: string | CanvasGradient | CanvasPattern;
  wrapMethod(settingElement, "renderToCanvas", (baseRender) => (context) => {
    baseRender(context);
    renderFill = context.fillStyle;
  });
  windowElement.setup();
  await done;
  expect(renderFill).toBe(fill1);
  settingElement.fill = fill2;
  expect(settingElement.fill).toBe(fill2);
});

test("fill - dom", async () => {
  const fill3 = "rgb(10, 20, 30)";
  settingElement.parent = windowElement;
  settingElement.setAttribute("fill", `'${fill3}'`);
  await new Promise((resolve) => {
    windowElement.addEventListener("setup", () => {
      resolve(true);
    });
    windowElement.setup();
  });
  const testElement = document.createElement("div");
  settingElement.styleDOMElement(testElement);
  expect(testElement.style.background).toBe(fill3);
});

test("stroke - canvas", async () => {
  settingElement.setAttribute("stroke", `'${stroke1}'`);
  settingElement.setAttribute("line_cap", `'${line_cap1}'`);
  settingElement.setAttribute("line_join", `'${line_join1}'`);
  settingElement.setAttribute("line_width", line_width1.toString());
  let renderStrokeStyle: string | CanvasGradient | CanvasPattern,
    renderLineCap: CanvasLineCap,
    renderLineJoin: CanvasLineJoin,
    renderLineWidth: number;
  wrapMethod(settingElement, "renderToCanvas", (baseRender) => (context) => {
    baseRender(context);
    renderStrokeStyle = context.strokeStyle;
    renderLineCap = context.lineCap;
    renderLineJoin = context.lineJoin;
    renderLineWidth = context.lineWidth;
  });
  windowElement.setup();
  await done;
  expect(renderStrokeStyle).toBe(stroke1);
  expect(renderLineCap).toBe(line_cap1);
  expect(renderLineJoin).toBe(line_join1);
  expect(renderLineWidth).toBe(line_width1);
  settingElement.stroke = stroke2;
  settingElement.line_cap = line_cap2;
  settingElement.line_join = line_join2;
  settingElement.line_width = line_width2;
  expect(settingElement.stroke).toBe(stroke2);
  expect(settingElement.line_cap).toBe(line_cap2);
  expect(settingElement.line_join).toBe(line_join2);
  expect(settingElement.line_width).toBe(line_width2);
});

test("stroke - dom", async () => {
  const stroke3 = "rgb(20, 30, 40)";
  settingElement.parent = windowElement;
  settingElement.setAttribute("stroke", `'${stroke3}'`);
  settingElement.setAttribute("line_width", line_width1.toString());
  await new Promise((resolve) => {
    windowElement.addEventListener("setup", () => {
      resolve(true);
    });
    windowElement.setup();
  });
  const testElement = document.createElement("div");
  settingElement.styleDOMElement(testElement);
  expect(testElement.style.outlineColor).toBe(stroke3);
  expect(testElement.style.outlineWidth).toBe(`${line_width1}px`);
});
