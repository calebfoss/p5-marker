import { MarkerElement } from "./elements/base";
import { Window } from "./elements/window";
import { Canvas } from "./elements/canvas";
import { Setting } from "./elements/setting";
import { Rectangle } from "./elements/2d_shapes";
import { stroke, fill } from "./properties/style";
import { position } from "./properties/position";

//  BASE
customElements.define("m-setting", Setting);

//  WINDOW
customElements.define("m-window", Window);

//  CANVAS
customElements.define("m-canvas", Canvas);

//  2D SHAPES
customElements.define("m-rectangle", Rectangle);

dispatchEvent(new Event("customElementsDefined"));

const Marker = {
  elementConstructors: {
    MarkerElement: MarkerElement,
    Window: Window,
    Canvas: Canvas,
    Setting: Setting,
    Rectangle: Rectangle,
  },
  propertyMixins: {
    stroke: stroke,
    fill: fill,
    xy: position,
  },
};
export { Marker };
