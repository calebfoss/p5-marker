import "../src/index";
import { MarkerWindow } from "../src/elements/window";
import { Canvas as MarkerCanvas } from "../src/elements/canvas";
import { Setting } from "../src/elements/setting";
import { CanvasRenderingContext2D } from "canvas";
import { MarkerElement } from "../src/elements/base";

global.CanvasRenderingContext2D = CanvasRenderingContext2D as any;
let windowElement: MarkerWindow,
  canvasElement: MarkerCanvas,
  settingElement: Setting;
let drawListener: EventListener;
let onDraw: () => void;
let frame: number;
const framesPerTest = 10;
let done: Promise<boolean>;

export const wrapMethod = <
  T extends MarkerElement,
  PropKey extends keyof T,
  MethodKey extends {
    [key in keyof T]: T[key] extends Function ? key : never;
  }[PropKey]
>(
  element: T,
  methodName: MethodKey,
  getWrappedMethod: (baseMethod: T[MethodKey]) => T[MethodKey]
) => {
  const baseMethod = (element[methodName] as Function).bind(element);
  element[methodName] = getWrappedMethod(baseMethod);
};

beforeEach(() => {
  windowElement = document.createElement("m-window") as MarkerWindow;
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
      if (frame >= framesPerTest) {
        resolve(frame === framesPerTest - 1);
        windowElement.removeEventListener("draw", drawListener);
      }
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

test("get value from parent", async () => {
  canvasElement.setAttribute("angle", "frame");
  settingElement.setAttribute("position.y", "angle");
  const angles: number[] = [];
  const y_positions: number[] = [];
  canvasElement.addEventListener("draw", () => {
    angles[windowElement.frame] = canvasElement.angle;
  });
  settingElement.addEventListener("draw", () => {
    y_positions[windowElement.frame] = settingElement.position.y;
  });
  windowElement.setup();
  await done;
  expect(angles.length).toBe(y_positions.length);
  expect(angles.length).toBe(framesPerTest);
  for (let i = 0; i < y_positions.length; i++) {
    expect(y_positions[i]).toBe(angles[i]);
  }
});

test("each", async () => {
  const repeatUntil = 10;
  settingElement.setAttribute("position.x", "0");
  settingElement.setAttribute("each.position.x", "position.x + 1");
  settingElement.setAttribute(
    "repeat",
    `until(position.x is at least ${repeatUntil})`
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

test("then", async () => {
  settingElement.setAttribute("then.position.x", "position.x + 1");
  const positions = [];
  settingElement.addEventListener("draw", () => {
    positions[windowElement.frame] = settingElement.position.x;
  });
  windowElement.setup();
  await done;
  expect(positions.length).toBe(framesPerTest);
  for (let i = 0; i < positions.length; i++) {
    expect(positions[i]).toBe(i);
  }
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
  let calls: number;
  onDraw = () => {
    calls = 0;
  };
  wrapMethod(settingElement, "renderToCanvas", (baseRender) => (context) => {
    expect(settingElement.count).toBe(calls);
    calls++;
    baseRender(context);
  });
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
  expect(settingElement.inherit("test" as any, 0)).toBe(value);
  expect(settingElement.inherit("nonexistent" as any, 0)).toBe(0);
});

test("max_count", async () => {
  const max_count = 100;
  settingElement.setAttribute("max_count", max_count.toString());
  settingElement.setAttribute("repeat", "true");
  let calls = 0;
  const warn = console.warn;
  console.warn = () => {};
  wrapMethod(settingElement, "renderToCanvas", (baseRender) => (context) => {
    calls++;
    baseRender(context);
  });
  windowElement.setup();
  await done;
  console.warn = warn;
  expect(frame).toBe(framesPerTest);
  expect(calls).toBe(framesPerTest * max_count);
});

test("on", async () => {
  settingElement.setAttribute("on", "frame % 2 is 0");
  let calls = 0;
  wrapMethod(settingElement, "renderToCanvas", (baseRender) => (context) => {
    calls++;
    baseRender(context);
  });
  windowElement.setup();
  await done;
  expect(calls).toBe(Math.floor(framesPerTest / 2));
});

test("parent", () => {
  expect(settingElement.parent).toBe(canvasElement);
  const childElement = document.createElement("m-setting") as Setting;
  childElement.parent = settingElement;
  expect(childElement.parent).toBe(settingElement);
});

test("repeat", async () => {
  const iterations = 100;
  const childElement = document.createElement("m-setting") as Setting;
  childElement.parent = settingElement;
  settingElement.setAttribute(
    "repeat",
    `until(count is at least ${iterations})`
  );
  let parentCalls = 0,
    childCalls = 0;
  wrapMethod(settingElement, "renderToCanvas", (baseRender) => (context) => {
    parentCalls++;
    baseRender(context);
  });
  wrapMethod(childElement, "renderToCanvas", (baseRender) => (context) => {
    childCalls++;
    baseRender(context);
  });
  windowElement.setup();
  await done;
  expect(parentCalls).toBe(framesPerTest * iterations);
  expect(childCalls).toBe(framesPerTest * iterations);
});

test("window", () => {
  expect(settingElement.window).toBe(windowElement);
  expect(canvasElement.window).toBe(windowElement);
  expect(() => {
    (settingElement.window as any) = canvasElement;
  }).toThrow();
});
