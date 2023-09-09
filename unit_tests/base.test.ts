import "../src/index";
import { MarkerWindow } from "../src/elements/window";
import { MarkerCanvas } from "../src/elements/canvas";
import { Setting } from "../src/elements/setting";
import { CanvasRenderingContext2D } from "canvas";
import { wrapMethod } from "./wrapMethod";
import { MarkerSVG } from "../src/elements/svg";
import { Rectangle } from "../src/elements/rectangle";

global.CanvasRenderingContext2D = CanvasRenderingContext2D as any;
let windowElement: MarkerWindow,
  canvasElement: MarkerCanvas,
  settingElement: Setting;
global.SVGRectElement = {
  [Symbol.hasInstance](obj) {
    return (
      Object.getPrototypeOf(
        document.createElementNS("http://www.w3.org/2000/svg", "rect")
      ) === Object.getPrototypeOf(obj)
    );
  },
} as any;
let drawListener: EventListener;
let onDraw: () => void;
let frame: number;
const framesPerTest = 10;
let done: Promise<boolean>;

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

test("custom elements defined", () => {
  expect(windowElement).not.toBe(null);
  expect(canvasElement).not.toBe(null);
  expect(settingElement).not.toBe(null);
});

test("get value from parent", async () => {
  canvasElement.setAttribute("angle", "frame");
  settingElement.setAttribute("origin.y", "angle");
  const angles: number[] = [];
  const y_origins: number[] = [];
  canvasElement.addEventListener("draw", () => {
    angles[windowElement.frame] = canvasElement.angle;
  });
  settingElement.addEventListener("draw", () => {
    y_origins[windowElement.frame] = settingElement.origin.y;
  });
  windowElement.setup();
  await done;
  expect(angles.length).toBe(y_origins.length);
  expect(angles.length).toBe(framesPerTest);
  for (let i = 0; i < y_origins.length; i++) {
    expect(y_origins[i]).toBe(angles[i]);
  }
});

test("each", async () => {
  const repeatUntil = 10;
  settingElement.setAttribute("origin.x", "0");
  settingElement.setAttribute("each.origin.x", "origin.x + 1");
  settingElement.setAttribute(
    "repeat",
    `until(origin.x is at least ${repeatUntil})`
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
  settingElement.setAttribute("then.origin.x", "origin.x + 1");
  const origins = [];
  settingElement.addEventListener("draw", () => {
    origins[windowElement.frame] = settingElement.origin.x;
  });
  windowElement.setup();
  await done;
  expect(origins.length).toBe(framesPerTest);
  for (let i = 0; i < origins.length; i++) {
    expect(origins[i]).toBe(i);
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

describe("clicked", () => {
  let canvasRect: Rectangle,
    domRect: Rectangle,
    svg: MarkerSVG,
    svgRect: Rectangle;
  const domRectId = "dom-rect";
  const svgRectId = "svg-rect";
  beforeEach(() => {
    canvasRect = canvasElement.create("rectangle", "canvas-rect") as Rectangle;
    domRect = windowElement.create("rectangle", domRectId) as Rectangle;
    svg = windowElement.create("svg") as MarkerSVG;
    svgRect = svg.create("rectangle", svgRectId) as Rectangle;
  });
  afterEach(() => {
    canvasRect.remove();
    domRect.remove();
    svg.remove();
    svgRect.remove();
  });
  test("clicked", async () => {
    let canvasDom: HTMLCanvasElement,
      domRectRendered: HTMLDivElement,
      svgRectRendered: SVGRectElement;
    let canvasRectClicked: boolean,
      domRectClicked: boolean,
      svgRectClicked: boolean;
    const canvasListener = jest.fn();
    canvasElement.addEventListener("click", canvasListener);
    let canvasRectClickedFrame;
    const canvasRectListener = jest.fn(() => {
      canvasRectClickedFrame = canvasRect.frame;
    });
    canvasRect.addEventListener("click", canvasRectListener);
    const domRectListener = jest.fn();
    domRect.addEventListener("click", domRectListener);
    const svgRectListener = jest.fn();
    svgRect.addEventListener("click", svgRectListener);
    onDraw = () => {
      switch (frame) {
        case 0:
          windowElement.document_element.dispatchEvent(
            new MouseEvent("mousemove", {
              clientX: windowElement.width / 2,
              clientY: windowElement.height / 2,
            })
          );
          windowElement.dispatchEvent(
            new MouseEvent("mouseup", {
              clientX: windowElement.width / 2,
              clientY: windowElement.height / 2,
            })
          );
          break;
        case 1:
          canvasDom = canvasElement.document_element as HTMLCanvasElement;
          domRectRendered = domRect.document_element as HTMLDivElement;
          domRectRendered.click();
          svgRectRendered = svgRect.document_element as SVGRectElement;
          svgRectRendered.dispatchEvent(new MouseEvent("click"));
          break;
        case 2:
          canvasRectClicked = canvasRect.clicked;
          domRectClicked = domRect.clicked;
          svgRectClicked = svgRect.clicked;
          break;
      }
    };
    windowElement.setup();
    await done;
    expect(canvasDom).not.toBe(null);
    expect(domRectRendered).not.toBe(null);
    expect(svgRectRendered).not.toBe(null);
    expect(canvasListener).toBeCalled();
    expect(canvasRectListener).toBeCalled();
    expect(domRectListener).toBeCalled();
    expect(svgRectListener).toBeCalled();
    expect(canvasRectClickedFrame).toBe(1);
    expect(canvasRectClicked).toBe(true);
    expect(domRectClicked).toBe(true);
    expect(svgRectClicked).toBe(true);
  });
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

test("create", async () => {
  const createdSetting1 = windowElement.create("setting");
  expect(createdSetting1).toBeInstanceOf(Setting);
  expect(windowElement.lastElementChild).toBe(createdSetting1);
  const createdSetting2 = windowElement.create("m-setting");
  expect(createdSetting2).toBeInstanceOf(Setting);
  expect(windowElement.lastElementChild).toBe(createdSetting2);
});

test("document_element", async () => {
  expect(windowElement.document_element).toBeInstanceOf(HTMLDivElement);
  expect(settingElement.document_element).toBeInstanceOf(HTMLDivElement);
  expect(canvasElement.document_element).toBeInstanceOf(HTMLCanvasElement);
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
