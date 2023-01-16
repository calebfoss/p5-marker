import { defineProperties, defineSnakeAlias } from "../utils/p5Modifiers";
import { P5Function } from "./core";
import { ColorFunction, FillStrokeFunction } from "./color";

p5.prototype._debugMode = [];
p5.prototype.DEFAULT = "default";
p5.prototype.AMBIENT = "ambient";
p5.prototype.SPECULAR = "specular";
p5.prototype.EMISSIVE = "emissive";

defineProperties({
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

/**
 * Creates an ambient light with the given color.
 *
 * Ambient light does not come from a specific direction.
 * Objects are evenly lit from all sides. Ambient lights are
 * almost always used in combination with other types of lights.
 * @element ambient-light
 * @attribute {Number}   v1     red or hue value relative to the current color
 *                                range
 * @attribute {Number}   v2     green or saturation value relative to the
 *                                current color range
 * @attribute {Number}   v3     blue or brightness value relative to the current
 *                                color range
 * @attribute {Number}   alpha  alpha value relative to current color range
 *                                (default is 0-255)
 * @attribute {Number}   gray   number specifying value between
 *                                white and black
 * @attribute {String}   value  a color string
 * @attribute {Number[]} values an array containing the red,green,blue &
 *                                 and alpha components of the color
 * @attribute {p5.Color} color  color as a <a
 *                                 href="https://p5js.org/reference/#/p5.Color"
 *                                 target="_blank">p5.Color</a>
 */
class AmbientLight extends ColorFunction {
  constructor() {
    super([]);
  }
}
customElements.define("p-ambient-light", AmbientLight);

/**
 * Creates a directional light with the given color and direction.
 *
 * Directional light comes from one direction.
 * The direction is specified as numbers inclusively between -1 and 1.
 * For example, setting the direction as (0, -1, 0) will cause the
 * geometry to be lit from below (since the light will be facing
 * directly upwards). Similarly, setting the direction as (1, 0, 0)
 * will cause the geometry to be lit from the left (since the light
 * will be facing directly rightwards).
 *
 * Directional lights do not have a specific point of origin, and
 * therefore cannot be positioned closer or farther away from a geometry.
 *
 * A maximum of **5** directional lights can be active at once.
 * @element    directional-light
 * @attribute  {Number}   v1     red or hue value relative to the current color
 *                                range
 * @attribute  {Number}   v2     green or saturation value relative to the
 *                                current color range
 * @attribute  {Number}   v3     blue or brightness value relative to the
 *                                current color range
 * @attribute  {Number}   x      x component of direction (inclusive range of
 *                                -1 to 1)
 * @attribute  {Number}   y      y component of direction (inclusive range of
 *                                -1 to 1)
 * @attribute  {Number}   z      z component of direction (inclusive range of
 *                                -1 to 1)
 * @attribute  {p5.Vector} direction  direction of light as a <a
 *                             href="https://p5js.org/reference/#/p5.Vector"
 *                             >p5.Vector</a>
 * @attribute {p5.Color} color  color as a <a
 *                                 href="https://p5js.org/reference/#/p5.Color"
 *                                 target="_blank">p5.Color</a>
 */
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

/**
 * Creates a point light with the given color and position.
 *
 * A point light emits light from a single point in all directions.
 * Because the light is emitted from a specific point (position),
 * it has a different effect when it is positioned farther vs. nearer
 * an object.
 *
 * A maximum of **5** point lights can be active at once.
 *
 * @attribute  {Number}   v1   red or hue value relative to the current color
 *                                range
 * @attribute  {Number}   v2   green or saturation value relative to the
 *                                current color range
 * @attribute  {Number}   v3   blue or brightness value relative to the
 *                                current color range
 * @attribute  {Number}    x   x component of position
 * @attribute  {Number}    y   y component of position
 * @attribute  {Number}    z   z component of position
 * @attribute  {p5.Vector}  position position of light as a <a
 *                            href="https://p5js.org/reference/#/p5.Vector"
 *                            >p5.Vector</a>
 * @attribute  {p5.Color|Number[]|String} color  color as a <a
 *                href="https://p5js.org/reference/#/p5.Color">p5.Color</a>,
 *                as an array, or as a CSS string
 */
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

/**
 * Places an ambient and directional light in the scene.
 * The lights are set to <ambient-light v1="128" v2="128" v3="128"> and
 * <directional-light v1="128" v2="128" v3'="128" x="0" y="0" z="-1">.
 * @element lights
 */
class Lights extends P5Function {
  constructor() {
    super([""]);
  }
}
customElements.define("p-lights", Lights);

/**
 * Creates a spot light with the given color, position,
 * light direction, angle, and concentration.
 *
 * Like a ```<point-light>```, a ```<spot-light>```
 * emits light from a specific point (position). It has a different effect
 * when it is positioned farther vs. nearer an object.
 *
 * However, unlike a ```<point-light>```, the light is emitted in **one
 * direction**
 * along a conical shape. The shape of the cone can be controlled using
 * the `angle` and `concentration` parameters.
 *
 * The `angle` parameter is used to
 * determine the radius of the cone. And the `concentration`
 * parameter is used to focus the light towards the center of
 * the cone. Both parameters are optional, however if you want
 * to specify `concentration`, you must also specify `angle`.
 * The minimum concentration value is 1.
 *
 * A maximum of **5** spot lights can be active at once.
 *
 * @element spot-light
 * @attribute  {Number}    v1             red or hue value relative to the
 *                                            current color range
 * @attribute  {Number}    v2             green or saturation value relative
 *                                            to the current color range
 * @attribute  {Number}    v3             blue or brightness value relative
 *                                            to the current color range
 * @attribute  {Number}    x              x component of position
 * @attribute  {Number}    y              y component of position
 * @attribute  {Number}    z              z component of position
 * @attribute  {Number}    rx             x component of light direction
 *                                            (inclusive range of -1 to 1)
 * @attribute  {Number}    ry             y component of light direction
 *                                            (inclusive range of -1 to 1)
 * @attribute  {Number}    rz             z component of light direction
 *                                            (inclusive range of -1 to 1)
 * @attribute  {Number}    angle          angle of cone. Defaults to PI/3
 * @attribute  {Number}    concentration  concentration of cone. Defaults to
 *                                            100
 */
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
