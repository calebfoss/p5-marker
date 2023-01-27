import { defineProperties, wrapMethod } from "../utils/p5Modifiers";

p5.prototype._fullscreen = p5.prototype.fullscreen;
p5.prototype._width = p5.prototype.width;
p5.prototype._height = p5.prototype.height;

p5.prototype._createDescriptionContainer = function () {
  const cnvId = this.canvas.id;
  const descriptionContainer = document.createElement("div");
  descriptionContainer.setAttribute("id", `${cnvId}_Description`);
  descriptionContainer.setAttribute("role", "region");
  descriptionContainer.setAttribute("aria-label", "Canvas Description");
  const p = document.createElement("p");
  p.setAttribute("id", `${cnvId}_fallbackDesc`);
  descriptionContainer.append(p);
  this.canvas.append(descriptionContainer);
  return descriptionContainer;
};
const fallbackDescId = "_fallbackDesc";
wrapMethod(
  "_describeHTML",
  (base) =>
    function (type, text) {
      const cnvId = this.canvas.id;
      const describeId = `#${cnvId}_Description`;
      if (type === "fallback") {
        if (!this.dummyDOM.querySelector(describeId)) {
          const fallback = this._createDescriptionContainer().querySelector(
            `#${cnvId}_fallbackDesc`
          );
          fallback.innerHTML = text;
        } else {
          base.call(this, type, text);
        }
        //if the container for the description exists
        this.descriptions.fallback = this.dummyDOM.querySelector(
          `#${cnvId}${fallbackDescId}`
        );
        this.descriptions.fallback.innerHTML = text;
      }
    }
);

wrapMethod(
  "_describeElementHTML",
  (base) =>
    function (type, name, text) {
      const cnvId = this.canvas.id;
      if (
        type === "fallback" &&
        !this.dummyDOM.querySelector(`#${cnvId}_Description`)
      ) {
        this._createDescriptionContainer();
      }
      base.call(this, type, name, text);
    }
);

wrapMethod(
  "_createOutput",
  (base) =>
    function (type, display) {
      const cnvId = this.canvas.id;
      if (!this.dummyDOM) {
        this.dummyDOM = document.getElementById(cnvId).parentNode;
      }
      if (
        (type === "textOutput" || type === "gridOutput") &&
        !this.dummyDOM.querySelector(`#${cnvId}accessibleOutput${display}`)
      )
        this._createDescriptionContainer();
      base.call(this, type, display);
    }
);

p5.prototype.registerMethod("post", function () {
  if (this.text_output || this.grid_output) this._updateAccsOutput();
});

defineProperties({
  frame_rate: {
    get: function () {
      return this._frameRate;
    },
    set: function (val) {
      this.frameRate(val);
    },
  },
  fullscreen: {
    get: function () {
      return this._fullscreen();
    },
    set: function (val) {
      this._fullscreen(val);
    },
  },
  window_width: {
    get: function () {
      return this.windowWidth;
    },
  },
  window_height: {
    get: function () {
      return this.windowHeight;
    },
  },
  grid_output: {
    get: function () {
      return this._accessibleOutputs.grid;
    },
    set: function (val) {
      if (val === true) this.gridOutput();
      else this.gridOutput(val);
    },
  },
  pixel_density: {
    get: function () {
      return this.pixelDensity();
    },
    set: function (val) {
      this.pixelDensity(val);
    },
  },
  description: {
    set: function (val) {
      this.describeElement(...val);
    },
  },
  display_density: {
    get: function () {
      return this.displayDensity();
    },
  },
  url: {
    get: function () {
      return this.getURL();
    },
  },
  url_path: {
    get: function () {
      return this.getURLPath();
    },
  },
  url_params: {
    get: function () {
      return this.getURLParams();
    },
  },
  log: {
    set: function (val) {
      this.print(val);
    },
  },
  text_output: {
    get: function () {
      return this._accessibleOutputs.text;
    },
    set: function (val) {
      if (val === true) this.textOutput();
      else this.textOutput(val);
    },
  },
});
