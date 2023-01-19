import { RenderedElement } from "../core";
import { addFillStroke } from "../properties/color_props";

p5.prototype.DEFAULT = "default";
p5.prototype.AMBIENT = "ambient";
p5.prototype.SPECULAR = "specular";
p5.prototype.EMISSIVE = "emissive";

export class WebGLGeometry extends addFillStroke(RenderedElement) {
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
   * Sets the texture that will be used to render subsequent shapes.
   *
   * A texture is like a "skin" that wraps around a 3D geometry. Currently
   * supported textures are images, video, and offscreen renders.
   *
   * To texture a geometry created by a ```<shape>``` element,
   * you will need to specify uv coordinates in ```<vertex>``` element.
   *
   * Note, texture can only be used in WEBGL mode.
   *
   * @type {p5.Image|p5.MediaElement|p5.Graphics|p5.Texture}
   */
  get texture() {
    return this.pInst._renderer._tex;
  }
  set texture(val) {
    this.pInst.texture(val);
  }
  /**
   * Sets the coordinate space for texture mapping. The default mode is IMAGE
   * which refers to the actual coordinates of the image.
   * NORMAL refers to a normalized space of values ranging from 0 to 1.
   *
   * With IMAGE, if an image is 100×200 pixels, mapping the image onto the
   * entire
   * size of a quad would require the points (0,0) (100, 0) (100,200) (0,200).
   * The same mapping in NORMAL is (0,0) (1,0) (1,1) (0,1).
   *
   * @type {IMAGE|NORMAL}
   */
  get texture_mode() {
    return this.pInst._renderer.textureMode;
  }
  set texture_mode(val) {
    this.pInst.textureMode(val);
  }
  /**
   * Sets the global texture wrapping mode. This controls how textures behave
   * when their uv's go outside of the 0 to 1 range. There are three options:
   * CLAMP, REPEAT, and MIRROR.
   *
   * CLAMP causes the pixels at the edge of the texture to extend to the bounds.
   * REPEAT causes the texture to tile repeatedly until reaching the bounds.
   * MIRROR works similarly to REPEAT but it flips the texture with every new tile.
   *
   * REPEAT & MIRROR are only available if the texture
   * is a power of two size (128, 256, 512, 1024, etc.).
   *
   * This method will affect all textures in your sketch until another element
   * sets texture_mode.
   *
   * If only one value is provided, it will be applied to both the
   * horizontal and vertical axes.
   * @type {[CLAMP|REPEAT|MIRROR, CLAMP|REPEAT|MIRROR]}
   */
  get texture_wrap() {
    return [
      this.pInst._renderer.textureWrapX,
      this.pInst._renderer.textureWrapY,
    ];
  }
  set texture_wrap(val) {
    if (Array.isArray(val)) this.pInst.textureWrap(...val);
    else this.pInst.textureWrap(val);
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

export class WebGLLight extends RenderedElement {
  draw(inherited) {
    //  Set no_lights to false so that children won't delete this light
    super.draw({ ...inherited, ...{ no_lights: false } });
  }
}

export const addSpecularColor = (baseClass) =>
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

export const addLightFalloff = (baseClass) =>
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

export const addRectMode = (baseClass) =>
  class extends baseClass {
    #rect_mode;
    /**
     * Modifies the location from which rectangles are drawn by changing the way
     * in which x and y coordinates are interpreted.
     *
     * The default mode is CORNER, which interprets the x and y as the
     * upper-left corner of the shape.
     *
     * rect_mode="CORNERS" interprets x and y as the location of
     * one of the corners, and width and height as the location of
     * the diagonally opposite corner. Note, the rectangle is drawn between the
     * coordinates, so it is not necessary that the first corner be the upper left
     * corner.
     *
     * rect_mode="CENTER" interprets x and y as the shape's center
     * point.
     *
     * rect_mode="RADIUS" also uses x and y as the shape's
     * center
     * point, but uses width and height to specify half of the shape's
     * width and height respectively.
     *
     * The value to this property must be written in ALL CAPS because they are
     * predefined as constants in ALL CAPS.
     *
     * @type {CORNER|CORNERS|CENTER|RADIUS}
     */
    get rect_mode() {
      return this.#rect_mode;
    }
    set rect_mode(mode) {
      this.pInst.rectMode(mode);
      this.#rect_mode = this.pInst._renderer._rectMode;
    }
  };

export const add3DShapeStyling = (baseClass) =>
  class extends baseClass {
    #smooth = false;
    /**
     * smooth="true" draws all geometry with smooth (anti-aliased) edges. smooth="true" will also
     * improve image quality of resized images. On a 3D canvas, smooth is false
     * by default, so it is necessary to set smooth="true" if you would like
     * smooth (antialiased) edges on your geometry.
     * @type {boolean}
     */
    get smooth() {
      return this.#smooth;
    }
    set smooth(val) {
      if (typeof val !== "boolean")
        return console.error(
          `${this.tagName}'s smooth property is being set to ${val}, but it may only be set to true or false.`
        );
      if (val) this.pInst.smooth();
      else this.pInst.noSmooth();
      this.#smooth = val;
    }
  };
