import { Base } from "./elements/base";
import { MarkerWindow } from "./elements/window";
import { MarkerCanvas } from "./elements/canvas";
import { Setting } from "./elements/setting";
import { MarkerSVG } from "./elements/svg";
import { Line } from "./elements/line";
import { Rectangle } from "./elements/rectangle";
import { stroke, fill } from "./mixins/style";
import { position } from "./mixins/position";

dispatchEvent(new Event("customElementsDefined"));

const Marker = {
  elementConstructors: {
    MarkerElement: Base,
    Window: MarkerWindow,
    Canvas: MarkerCanvas,
    Line: Line,
    Setting: Setting,
    Rectangle: Rectangle,
    SVG: MarkerSVG,
  },
  propertyMixins: {
    stroke: stroke,
    fill: fill,
    xy: position,
  },
};
export { Marker };
