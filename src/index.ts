import { Base } from "./elements/base";
import { Window } from "./elements/window";
import { Canvas } from "./elements/canvas";
import { Setting } from "./elements/setting";
import { Rectangle } from "./elements/2d_shapes";
import { stroke, fill } from "./mixins/style";
import { position } from "./mixins/position";

dispatchEvent(new Event("customElementsDefined"));

const Marker = {
  elementConstructors: {
    MarkerElement: Base,
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
