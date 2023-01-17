import { defineProperties, defineSnakeAlias } from "../utils/p5Modifiers";
import { FillStrokeElement } from "./color";

p5.prototype._debugMode = [];
p5.prototype.DEFAULT = "default";
p5.prototype.AMBIENT = "ambient";
p5.prototype.SPECULAR = "specular";
p5.prototype.EMISSIVE = "emissive";

export class WebGLGeometry extends FillStrokeElement {
  #ambient_material;
  #emissive_material;
  #shininess;
  #specular_material;
  #no_lights;
  /**
   * Sets the ambient color of the material.
   *
   * The ambient_material color is the color the object will reflect
   * under **any** lighting.
   *
   * Consider an ambient_material with the color yellow (255, 255, 0).
   * If the light emits the color white (255, 255, 255), then the object
   * will appear yellow as it will reflect the red and green components
   * of the light. If the light emits the color red (255, 0, 0), then
   * the object will appear red as it will reflect the red component
   * of the light. If the light emits the color blue (0, 0, 255),
   * then the object will appear black, as there is no component of
   * the light that it can reflect.
   * @type {p5.Color}
   */
  get ambient_material() {
    return this.#ambient_material;
  }
  set ambient_material(val) {
    if (Array.isArray(val)) this.pInst.ambientMaterial(...val);
    else this.pInst.ambientMaterial(val);
    this.#ambient_material = this.pInst.color(val);
  }
  /**
   * Sets the emissive color of the material.
   *
   * An emissive material will display the emissive color at
   * full strength regardless of lighting. This can give the
   * appearance that the object is glowing.
   *
   * Note, "emissive" is a misnomer in the sense that the material
   * does not actually emit light that will affect surrounding objects.
   *
   * @type {p5.Color}
   */
  get emissive_material() {
    return this.#emissive_material;
  }
  set emissive_material(val) {
    if (Array.isArray(val)) this.pInst.emissiveMaterial(...val);
    else this.pInst.emissiveMaterial(val);
    this.#ambient_material = this.pInst.color(val);
  }
  /**
   * Sets the current material as a normal material.
   *
   * A normal material is not affected by light. It is often used as
   * a placeholder material when debugging.
   *
   * Surfaces facing the X-axis become red, those facing the Y-axis
   * become green, and those facing the Z-axis become blue.
   *
   * @type {boolean}
   */
  get normal_material() {
    return this.pInst._renderer.useNormalMaterial;
  }
  set normal_material(val) {
    if (val) this.pInst.normalMaterial();
  }
  /**
   * Sets the <a href="#/p5.Shader">p5.Shader</a> object to
   * be used to render subsequent shapes.
   *
   * Custom shaders can be created using the
   * create_shader() method and
   * ```<shader>``` element.
   *
   * Set shader="DEFAULT" to restore the default shaders.
   *
   * Note, shaders can only be used in WEBGL mode.
   * @type {p5.Shader}
   */
  get shader() {
    return [
      this.pInst._renderer.userStrokeShader,
      this.pInst._renderer.userFillShader,
    ];
  }
  set shader(val) {
    const { pInst } = this;
    if (val === pInst.DEFAULT) pInst.resetShader();
    else pInst.shader(val);
  }
  /**
   * Sets the amount of gloss ("shininess") of a
   * specular_material.
   *
   * The default and minimum value is 1.
   * @type {number}
   * */
  get shininess() {
    return this.#shininess;
  }
  set shininess(val) {
    this.pInst.shininess(val);
    this.#shininess = val;
  }
  /**
   * Sets the specular color of the material.
   *
   * A specular material is reflective (shiny). The shininess can be
   * controlled by the shininess property.
   *
   * Like ambient_material,
   * the specular_material color is the color the object will reflect
   * under ```<ambient-light>```.
   * However unlike ambient_material, for all other types of lights
   * ```<directional-light>```,
   * ```<point-light>```,
   * ```spot-light>```,
   * a specular material will reflect the **color of the light source**.
   * This is what gives it its "shiny" appearance.
   *
   * @type {p5.Color}
   */
  get specular_material() {
    return this.#specular_material;
  }
  set specular_material(val) {
    if (Array.isArray(val)) this.pInst.specularMaterial(...val);
    else this.pInst.specularMaterial(val);
    this.#specular_material = this.pInst.color(val);
  }
  /**
   * Removes all lights present in a sketch.
   *
   * All subsequent geometry is rendered without lighting (until a new
   * light is created with a lighting element (
   * ```<lights>```,
   * ```<ambient-light>```,
   * ```<directional-light>```,
   * ```<point-light>```,
   * ```<spot-light>```).
   * @type {boolean}
   */
  get no_lights() {
    return this.#no_lights;
  }
  set no_lights(val) {
    this.#no_lights = val;
    if (val == true) this.pInst.noLights();
  }
}

export class WebGLLight extends FillStrokeElement {}

const addSpecularColor = (baseClass) =>
  class extends baseClass {
    #specular_color;
    /**
     * Sets the color of the specular highlight of a non-ambient light
     * (i.e. all lights except ```<ambient-light>```).
     *
     * specular_color affects only the lights which are created by
     * this element or its children
     *
     * This property is used in combination with
     * <a href="#/p5/specularMaterial">specularMaterial()</a>.
     * If a geometry does not use specular_material, this property
     * will have no effect.
     *
     * The default color is white (255, 255, 255), which is used if
     * specular_color is not explicitly set.
     *
     * Note: specular_color is equivalent to the Processing function
     * <a href="https://processing.org/reference/lightSpecular_.
     * html">lightSpecular</a>.
     *
     * @type {p5.Color}
     */
    get specular_color() {
      return this.#specular_color;
    }
    set specular_color(val) {
      const { pInst } = this;
      const c = Array.isArray(val) ? pInst.color(...val) : pInst.color(val);
      pInst.specularColor(c);
      this.#specular_color = c;
    }
  };

const addLightFalloff = (baseClass) =>
  class extends baseClass {
    #light_falloff;
    /**
     * Sets the falloff rate for ```<point-light>```
     * and ```<spot-light>```.
     *
     * light_falloff affects only this element and its children.
     *
     * The values are `constant`, `linear`, an `quadratic` and are used to calculate falloff as follows:
     *
     * d = distance from light position to vertex position
     *
     * falloff = 1 / (CONSTANT + d \* LINEAR + (d \* d) \* QUADRATIC)
     * @type {[number, number, number]}
     */
    get light_falloff() {
      return this.#light_falloff;
    }
    set light_falloff([constant, linear, quadratic]) {
      const { pInst } = this;
      pInst.lightFalloff(constant, linear, quadratic);
      this.#light_falloff = [
        pInst._renderer.constantAttenuation,
        pInst._renderer.linearAttenuation,
        pInst._renderer.quadraticAttenuation,
      ];
    }
  };

defineProperties({
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
class AmbientLight extends WebGLLight {
  constructor() {
    super(["v1, v2, v3, [alpha]", "gray, [alpha]", "value", "values", "color"]);
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
class DirectionalLight extends addSpecularColor(WebGLLight) {
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
class PointLight extends addLightFalloff(addSpecularColor(WebGLLight)) {
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
class Lights extends addSpecularColor(WebGLLight) {
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
class SpotLight extends addLightFalloff(addSpecularColor(WebGLLight)) {
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
