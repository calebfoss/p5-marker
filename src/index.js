"use strict";
import "./core";
import "./elements/canvas_elements";
import "./elements/2d_shape_elements";
import "./modules/environment";
import "./elements/color_elements";
import "./elements/beyond_canvas_elements";
import "./modules/structure";
import "./modules/dom";
import "./modules/rendering";
import "./modules/events";
import "./modules/io";
import "./elements/image_elements";
import "./elements/typography_elements";
import "./elements/3d_shape_elements";
import "./elements/3d_light_elements";

const customElementsDefined = new Event("customElementsDefined");
dispatchEvent(customElementsDefined);
