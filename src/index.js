"use strict";
import "./modules/core";
import "./modules/environment";
import "./modules/color";
import "./modules/shape";
import "./modules/structure";
import "./modules/dom";
import "./modules/data";
import "./modules/math";
import "./modules/rendering";
import "./modules/transform";
import "./modules/events";
import "./modules/image";
import "./modules/io";
import "./modules/typography";
import "./modules/3d";
import "./modules/collide";

//  Create an HTML element for every class from modules
(() => {
  const customElementsDefined = new Event("customElementsDefined");
  const { _customElements: elements } = p5.prototype;
  for (const i in elements) {
    customElements.define(
      elements[i].elementName,
      elements[i],
      elements[i].constructorOptions
    );
  }
  dispatchEvent(customElementsDefined);
})();
