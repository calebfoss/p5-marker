import { MarkerElement } from "./elements/base";
import { Window } from "./elements/window";
import { Canvas } from "./elements/canvas";
import { Rectangle } from "./elements/2d_shapes";

//  BASE
customElements.define("m-setting", MarkerElement);

//  WINDOW
customElements.define("m-window", Window);

//  CANVAS
customElements.define("m-canvas", Canvas);

//  2D SHAPES
customElements.define("m-rectangle", Rectangle);

dispatchEvent(new Event("customElementsDefined"));
