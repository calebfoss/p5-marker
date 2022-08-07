import "./modules/base.js";
import "./modules/environment.js";
import "./modules/color.js";
import "./modules/shape.js";
import "./modules/structure";
import "./modules/dom";
import "./modules/math.js";
import "./modules/rendering.js";
import "./modules/transform.js";
import "./modules/events.js";

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
