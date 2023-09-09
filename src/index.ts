import { Base } from "./elements/base";
import { MarkerWindow } from "./elements/window";
import { MarkerCanvas } from "./elements/canvas";
import { Setting } from "./elements/setting";
import { MarkerSVG } from "./elements/svg";
import { Line } from "./elements/line";
import { Rectangle } from "./elements/rectangle";
import { Ellipse } from "./elements/ellipse";
import { stroke, fill } from "./mixins/style";
import { origin } from "./mixins/origin";

dispatchEvent(new Event("customElementsDefined"));

const Marker = {
  elementConstructors: {
    MarkerElement: Base,
    Window: MarkerWindow,
    Canvas: MarkerCanvas,
    Ellipse: Ellipse,
    Line: Line,
    Setting: Setting,
    Rectangle: Rectangle,
    SVG: MarkerSVG,
  },
  propertyMixins: {
    stroke: stroke,
    fill: fill,
    xy: origin,
  },
};
export { Marker };
