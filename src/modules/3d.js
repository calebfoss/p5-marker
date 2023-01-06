import { defineProperties, defineSnakeAlias } from "../utils/p5Modifiers";
import { P5Function } from "./core";
import { ColorFunction } from "./color";

p5.prototype._orbitControl = { on: false, sensitivity: [] };
p5.prototype._debugMode = [];
p5.prototype.registerMethod("pre", function () {
  if (this._orbitControl.on)
    this.orbitControl(...this._orbitControl.sensitivity);
});
p5.prototype.DEFAULT = "default";
p5.prototype.AMBIENT = "ambient";
p5.prototype.SPECULAR = "specular";
p5.prototype.EMISSIVE = "emissive";

defineProperties({
  orbit_control: {
    get: function () {
      return this._orbitControl;
    },
    set: function (val) {
      if (val === false) return (this._orbitControl = false);
      this._orbitControl.on = true;
      if (val === true) return;
      if (Array.isArray(val)) this._orbitControl.sensitivity = val;
      this._orbitControl.sensitivity = [val];
    },
  },
  debug_mode: {
    get: function () {
      return this._debugMode;
    },
    set: function (val) {
      if (val === this.NONE) this.noDebugMode();
      else {
        this._debugMode = val;
        if (val === true) this.debugMode();
        else this.debugMode(val);
      }
    },
  },
  specular_color: {
    get: function () {
      return this._renderer.specularColors;
    },
    set: function (val) {
      if (Array.isArray(val)) this.specularColor(...val);
      else this.specularColor(val);
    },
  },
  light_falloff: {
    get: function () {
      return [
        this._renderer.constantAttenuation,
        this._renderer.linearAttenuation,
        this._renderer.quadraticAttenuation,
      ];
    },
  },
  remove_lights: {
    set: function () {
      this.noLights();
    },
  },
  shader: {
    get: function () {
      return [this._renderer.userStrokeShader, this._renderer.userFillShader];
    },
    set: function (val) {
      if (val === this.DEFAULT) this.resetShader();
      else this.shader(val);
    },
  },
  texture: {
    get: function () {
      return this._renderer._tex;
    },
    set: function (val) {
      this.texture(val);
    },
  },
  texture_mode: {
    get: function () {
      return this._renderer.textureMode;
    },
    set: function (val) {
      this.textureMode(val);
    },
  },
  texture_wrap: {
    get: function () {
      return [this._renderer.textureWrapX, this._renderer.textureWrapY];
    },
    set: function (val) {
      if (Array.isArray(val)) this.textureWrap(...val);
      else this.textureWrap(val);
    },
  },
  material: {
    get: function () {
      if (this._renderer._useNormalMaterial) return this.NORMAL;
      if (this._renderer._useAmbientMaterial) return this.AMBIENT;
      if (this._renderer._useEmissiveMaterial) return this.EMISSIVE;
      if (this._renderer._useSpecularMaterial) return this.SPECULAR;
    },
    set: function (val) {
      switch (val) {
        case this.NORMAL:
          this.normalMaterial();
          break;
        case this.AMBIENT:
          this.ambientMaterial();
          break;
        case this.EMISSIVE:
          this.emissiveMaterial();
          break;
        case this.SPECULAR:
          this.specularMaterial();
          break;
      }
    },
  },

  shininess: {
    get: function () {
      return this._renderer._useShininess;
    },
    set: function (val) {
      this.shininess(val);
    },
  },
  camera: {
    get: function () {
      return this._renderer._curCamera;
    },
    set: function (val) {
      this.setCamera(val);
    },
  },
});

defineSnakeAlias("createShader", "createCamera");

class AmbientLight extends ColorFunction {
  constructor() {
    super([]);
  }
}
customElements.define("p-ambient-light", AmbientLight);
class DirectionalLight extends P5Function {
  constructor() {
    super([
      "v1, v2, v3, x, y, z",
      "v1, v2, v3, direction",
      "color, x, y, z",
      "color, direction",
    ]);
  }
}
customElements.define("p-directional-light", DirectionalLight);
class PointLight extends P5Function {
  constructor() {
    super([
      "v1, v2, v3, x, y, z",
      "v1, v2, v3, position",
      "color, x, y, z",
      "color, position",
    ]);
  }
}
customElements.define("p-point-light", PointLight);
class Lights extends P5Function {
  constructor() {
    super([""]);
  }
}
customElements.define("p-lights", Lights);
class SpotLight extends P5Function {
  constructor() {
    super([
      "v1, v2, v3, x, y, z, rx, ry, rz, [angle], [concentration]",
      "color, position, direction, [angle], [concentration]",
      "v1, v2, v3, position, direction, [angle], [concentration]",
      "color, x, y, z, direction, [angle], [concentration]",
      "color, position, rx, ry, rz, [angle], [concentration]",
      "v1, v2, v3, x, y, z, direction, [angle], [concentration]",
      "v1, v2, v3, position, rx, ry, rz, [angle], [concentration]",
      "color, x, y, z, rx, ry, rz, [angle], [concentration]",
    ]);
  }
}
customElements.define("p-spot-light", SpotLight);
