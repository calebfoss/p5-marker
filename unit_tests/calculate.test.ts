import "../src/index";
import { CanvasRenderingContext2D } from "canvas";
import { MarkerWindow } from "../src/elements/window";
global.CanvasRenderingContext2D = CanvasRenderingContext2D as any;
let windowElement: MarkerWindow;

beforeEach(() => {
  windowElement = document.createElement("m-window") as MarkerWindow;
  document.body.appendChild(windowElement);
});

afterEach(() => {
  windowElement.remove();
  windowElement = null;
});

test("between", () => {
  windowElement.setAttribute("test1", "between(0, 100, 0.5)");
  windowElement.setAttribute("test2", "between(100, 0, 0.5)");
  windowElement.setAttribute("test3", "between(-100, 0, 0.5)");
  windowElement.setAttribute("test4", "between(0, -100, 0.5)");
  windowElement.setup();
  const element = windowElement as MarkerWindow & {
    test1: number;
    test2: number;
    test3: number;
    test4: number;
  };
  expect(element.test1).toBe(50);
  expect(element.test2).toBe(50);
  expect(element.test3).toBe(-50);
  expect(element.test4).toBe(-50);
});

test("constrain", () => {
  windowElement.setAttribute("test1", "constrain(1000, 0, 100)");
  windowElement.setAttribute("test2", "constrain(-1000, 0, 100)");
  windowElement.setAttribute("test3", "constrain(50, 0, 100)");
  windowElement.setAttribute("test4", "constrain(-50, 0, -100)");
  windowElement.setup();
  const element = windowElement as MarkerWindow & {
    test1: number;
    test2: number;
    test3: number;
    test4: number;
  };
  expect(element.test1).toBe(100);
  expect(element.test2).toBe(0);
  expect(element.test3).toBe(50);
  expect(element.test4).toBe(-50);
});

test("map", () => {
  windowElement.setAttribute("test1", "map(5, 0, 10, 0, 100)");
  windowElement.setAttribute("test2", "map(5, 10, 0, -100, 0)");
  windowElement.setAttribute("test3", "map(-5, 0, 10, 100, 200)");
  windowElement.setAttribute("test4", "map(15, 0, 10, 100, 200)");
  windowElement.setup();
  const element = windowElement as MarkerWindow & {
    test1: number;
    test2: number;
    test3: number;
    test4: number;
  };
  expect(element.test1).toBe(50);
  expect(element.test2).toBe(-50);
  expect(element.test3).toBe(50);
  expect(element.test4).toBe(250);
});
