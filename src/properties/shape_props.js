export const addWidthHeight = (baseClass) =>
  class extends baseClass {
    #width;
    #height;
    /**
     * The width of the element in pixels.
     * @type {number}
     */
    get width() {
      return this.#width;
    }
    set width(val) {
      if (!isNaN(val)) this.#width = Number(val);
      else
        console.error(
          `${this.tagName}'s width is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The height of the element in pixels.
     * @type {number}
     */
    get height() {
      return this.#height;
    }
    set height(val) {
      if (!isNaN(val)) this.#height = Number(val);
      else
        console.error(
          `${this.tagName}'s height is being set to ${val}, but it may only be set to a number.`
        );
    }
  };
export const addXY = (baseClass) =>
  class extends baseClass {
    #x;
    #y;
    /**
     * The x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get x() {
      return this.#x;
    }
    set x(val) {
      if (!isNaN(val)) this.#x = Number(val);
      else
        console.error(
          `${this.tagName}'s x property is being set to ${val}, but it may only be set to a number`
        );
    }
    /**
     * The y-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get y() {
      return this.#y;
    }
    set y(val) {
      if (!isNaN(val)) this.#y = Number(val);
      else
        console.error(
          `${this.tagName}'s y property is being set to ${val}, but it may only be set to a number`
        );
    }
  };

const addZ = (baseClass) =>
  class extends baseClass {
    #z;
    /**
     * The z-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get z() {
      return this.#z;
    }
    set z(val) {
      if (!isNaN(val)) this.#z = Number(val);
      else
        console.error(
          `${this.tagName}'s z property is being set to ${val}, but it may only be set to a number`
        );
    }
  };
export const addXYZ = (baseClass) => class extends addXY(addZ(baseClass)) {};

const addXY1 = (baseClass) =>
  class extends baseClass {
    #x1;
    #y1;
    /**
     * The first x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get x1() {
      return this.#x1;
    }
    set x1(val) {
      if (!isNaN(val)) this.#x1 = val;
      else
        console.error(
          `${this.tagName}'s x1 is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The first y-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get y1() {
      return this.#y1;
    }
    set y1(val) {
      if (!isNaN(val)) this.#y1 = val;
      else
        console.error(
          `${this.tagName}'s y1 is being set to ${val}, but it may only be set to a number.`
        );
    }
  };
const addXY2 = (baseClass) =>
  class extends baseClass {
    #x2;
    #y2;
    /**
     * The second x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get x2() {
      return this.#x2;
    }
    set x2(val) {
      if (!isNaN(val)) this.#x2 = val;
      else
        console.error(
          `${this.tagName}'s x2 is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The second y-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get y2() {
      return this.#y2;
    }
    set y2(val) {
      if (!isNaN(val)) this.#y2 = val;
      else
        console.error(
          `${this.tagName}'s y2 is being set to ${val}, but it may only be set to a number.`
        );
    }
  };

export const addXY12 = (baseClass) =>
  class extends addXY1(addXY2(baseClass)) {};
export const addXY3 = (baseClass) =>
  class extends baseClass {
    #x3;
    #y3;
    /**
     * The third x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get x3() {
      return this.#x3;
    }
    set x3(val) {
      if (!isNaN(val)) this.#x3 = val;
      else
        console.error(
          `${this.tagName}'s x3 is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The third y-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get y3() {
      return this.#y3;
    }
    set y3(val) {
      if (!isNaN(val)) this.#y3 = val;
      else
        console.error(
          `${this.tagName}'s y3 is being set to ${val}, but it may only be set to a number.`
        );
    }
  };

const addXY123 = (baseClass) => class extends addXY12(addXY3(baseClass)) {};

const addZ1 = (baseClass) =>
  class extends baseClass {
    #z1;
    /**
     * The first z-coordinate of the element relative to the current anchor. |
     * @type {number}
     */
    get z1() {
      return this.#z1;
    }
    set z1(val) {
      if (!isNaN(val)) this.#z1 = val;
      else
        console.error(
          `${this.tagName}'s z1 is being set to ${val}, but it may only be set to a number.`
        );
    }
  };
export const addXYZ1 = (baseClass) => class extends addXY1(addZ1(baseClass)) {};
const addZ2 = (baseClass) =>
  class extends baseClass {
    #z2;
    /**
     * The second z-coordinate of the element relative to the current anchor. |
     * @type {number}
     */
    get z2() {
      return this.#z2;
    }
    set z2(val) {
      if (!isNaN(val)) this.#z2 = val;
      else
        console.error(
          `${this.tagName}'s z2 is being set to ${val}, but it may only be set to a number.`
        );
    }
  };
export const addXYZ2 = (baseClass) => class extends addXY2(addZ2(baseClass)) {};
const addXYZ12 = (baseClass) => class extends addXYZ1(addXYZ2(baseClass)) {};

export const addXY4 = (baseClass) =>
  class extends addXY123(baseClass) {
    #x4;
    #y4;
    /**
     * The fourth x-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get x4() {
      return this.#x4;
    }
    set x4(val) {
      if (!isNaN(val)) this.#x4 = val;
      else
        console.error(
          `${this.tagName}'s x4 is being set to ${val}, but it may only be set to a number.`
        );
    }
    /**
     * The fourth y-coordinate of the element relative to the current anchor.
     * @type {number}
     */
    get y4() {
      return this.#y4;
    }
    set y4(val) {
      if (!isNaN(val)) this.#y4 = val;
      else
        console.error(
          `${this.tagName}'s y4 is being set to ${val}, but it may only be set to a number.`
        );
    }
  };

export const addZ3 = (baseClass) =>
  class extends baseClass {
    #z3;
    /**
     * The third z-coordinate of the element relative to the current anchor. |
     * @type {number}
     */
    get z3() {
      return this.#z3;
    }
    set z3(val) {
      if (!isNaN(val)) this.#z3 = val;
      else
        console.error(
          `${this.tagName}'s z3 is being set to ${val}, but it may only be set to a number.`
        );
    }
  };
export const addXYZ3 = (baseClass) => class extends addXY3(addZ3(baseClass)) {};
export const addXYZ123 = (baseClass) =>
  class extends addXYZ12(addXY3(addZ3(baseClass))) {};

export const addZ4 = (baseClass) =>
  class extends baseClass {
    #z4;
    /**
     * The fourth z-coordinate of the element relative to the current anchor. |
     * @type {number}
     */
    get z4() {
      return this.#z4;
    }
    set z4(val) {
      if (!isNaN(val)) this.#z4 = val;
      else
        console.error(
          `${this.tagName}'s z4 is being set to ${val}, but it may only be set to a number.`
        );
    }
  };
export const addXYZ4 = (baseClass) => class extends addXY4(addZ4(baseClass)) {};

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

export const add2DStrokeStyling = (baseClass) =>
  class extends baseClass {
    #smooth = true;
    #stroke_cap = "round";
    #stroke_join = "miter";
    /**
     * smooth="true" draws all geometry with smooth (anti-aliased) edges. smooth="true" will also
     * improve image quality of resized images. smooth is true by
     * default on a 2D canvas. smooth="false" can be used to disable smoothing of geometry,
     * images, and fonts.
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
    /**
     * Sets the style for rendering line endings. These ends are either rounded,
     * squared or extended, each of which specified with the corresponding
     * parameters: ROUND, SQUARE and PROJECT. The default cap is ROUND.
     *
     * The value on this property must be written in ALL CAPS because they are
     * predefined as constants in ALL CAPS.
     * @type {ROUND|SQUARE|PROJECT}
     */
    get stroke_cap() {
      return this.#stroke_cap;
    }
    set stroke_cap(val) {
      this.pInst.strokeCap(val);
      this.#stroke_cap = this.pInst.drawingContext.lineCap;
    }
    /**
     * Sets the style of the joints which connect line segments. These joints
     * are either mitered, beveled or rounded and specified with the
     * corresponding parameters MITER, BEVEL and ROUND. The default joint is
     * MITER.
     *
     * The parameter to this method must be written in ALL CAPS because they are
     * predefined as constants in ALL CAPS.
     * @type {MITER|BEVEL|ROUND}
     */
    get stroke_join() {
      return this.#stroke_join;
    }
    set stroke_join(val) {
      this.pInst.strokeJoin(val);
      this.#stroke_join = this.pInst.drawingContext.lineJoin;
    }
  };

export const addCurveTightness = (baseClass) =>
  class extends baseClass {
    #tightness = 0;
    /**
     * Modifies the quality of the curve. The amount
     * determines how the curve fits to the vertex points. The value 0.0 is the
     * default value (this value defines the curves to be Catmull-Rom
     * splines) and the value 1.0 connects all the points with straight lines.
     * Values within the range -5.0 and 5.0 will deform the curves but will leave
     * them recognizable and as values increase in magnitude, they will continue to deform.
     * @type {number}
     */
    get tightness() {
      return this.#tightness;
    }
    set tightness(val) {
      this.#tightness = val;
    }
  };

export const addCXY = (baseClass) =>
  class extends baseClass {
    #cx;
    #cy;
    get cx() {
      return this.#cx;
    }
    set cx(val) {
      this.#cx = val;
    }
    get cy() {
      return this.#cy;
    }
    set cy(val) {
      this.#cy = val;
    }
  };

export const addCXYZ = (baseClass) =>
  class extends baseClass {
    #cz;
    get cz() {
      return this.#cz;
    }
    set cz(val) {
      this.#cz = val;
    }
  };
