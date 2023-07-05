import {
  WebGLLight,
  addLightFalloff,
  addSpecularColor,
} from "../properties/3d_props";
import { addXYZ } from "../properties/shape_props";
import { addColorVals } from "../properties/color_props";

const addLightColor = (baseClass) =>
  class extends baseClass {
    #light_color;
    /**
     * The color of light produced by this element.
     * @type {p5.Color}
     */
    get light_color() {
      return this.#light_color;
    }
    set light_color(val) {
      if (Array.isArray(val)) this.#light_color = this.pInst.color(...val);
      else if (val instanceof p5.Color) this.#light_color = val;
      else if (typeof val === "number" || typeof val === "string")
        this.#light_color = this.pInst.color(val);
      else
        console.error(
          `On ${this.tagName}, light_color was set to ${typeof val}, ` +
            `but it can only be set to a color, string, or comma-separated list of numbers.`
        );
    }
    setup(pInst, canvas) {
      super.setup(...arguments);
      if (!this.hasAttribute("light_color"))
        this.light_color = pInst.color(255);
    }
  };
const addDirection = (baseClass) =>
  class extends baseClass {
    #direction = new p5.Vector();
    /**
     * Direction the light is pointing.
     * @type {p5.Vector}
     */
    get direction() {
      return this.#direction;
    }
    set direction(val) {
      if (val instanceof p5.Vector) this.#direction = val;
      else if (Array.isArray(val)) this.#direction = this.vector(...val);
      else if (typeof val === "number") this.#direction = this.vector(val);
      else
        console.error(
          `On ${this.tagName}, directoin was set to ${typeof val}, ` +
            "but it can only be set to a vector or comma-separated list of numbers."
        );
    }
  };

/**
 * Creates an ambient light with the given color.
 *
 * Ambient light does not come from a specific direction.
 * Objects are evenly lit from all sides. Ambient lights are
 * almost always used in combination with other types of lights.
 */
class AmbientLight extends addLightColor(WebGLLight) {
  /**
   * @private
   */
  static overloads = ["light_color"];
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
 */
class DirectionalLight extends addDirection(
  addLightColor(addSpecularColor(WebGLLight))
) {
  /**
   * @private
   */
  static overloads = ["light_color, direction"];
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
 */
class PointLight extends addXYZ(
  addLightColor(addColorVals(addLightFalloff(addSpecularColor(WebGLLight))))
) {
  /**
   * @private
   */
  static overloads = ["light_color, x, y, z"];
}
customElements.define("p-point-light", PointLight);

/**
 * Places an ambient and directional light in the scene.
 * The lights are set to <ambient-light v1="128" v2="128" v3="128"> and
 * <directional-light v1="128" v2="128" v3'="128" x="0" y="0" z="-1">.
 */
class Lights extends addSpecularColor(WebGLLight) {
  /**
   * @private
   */
  static overloads = [""];
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
 */
class SpotLight extends addXYZ(
  addDirection(addLightColor(addLightFalloff(addSpecularColor(WebGLLight))))
) {
  #cone_angle = Math.PI / 3;
  #concentration = 100;
  /**
   * @private
   */
  static overloads = [
    "light_color, x, y, z, direction, [cone_angle], [concentration]",
  ];
  /**
   * Angle of cone of light.
   * @type {number}
   */
  get cone_angle() {
    return this.#cone_angle;
  }
  set cone_angle(val) {
    if (typeof val !== "number")
      console.error(
        `On ${this.tagName}, cone_angle was set to ${typeof val}, ` +
          "but it can only be set to a number"
      );
    else this.#cone_angle = val;
  }
  /**
   * Concentration of cone of light
   * @type {number}
   */
  get concentration() {
    return this.#concentration;
  }
  set concentration(val) {
    if (typeof val !== "number")
      console.error(
        `On ${this.tagName}, concentration was set to ${typeof val}, ` +
          "but it can only be set to a number"
      );
    else this.#concentration = val;
  }
}
customElements.define("p-spot-light", SpotLight);
