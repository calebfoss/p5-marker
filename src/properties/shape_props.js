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

export const addXYZ = (baseClass) =>
  class extends addXY(baseClass) {
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

export const addWidthHeight = (baseClass) =>
  class extends baseClass {
    #height;
    #width;
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
  };

export const addXY12 = (baseClass) =>
  class extends baseClass {
    #x1;
    #y1;
    #x2;
    #y2;
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

export const addY3 = (baseClass) =>
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

export const addXY123 = (baseClass) =>
  class extends addXY12(addY3(baseClass)) {};

export const addXYZ12 = (baseClass) =>
  class extends addXY12(baseClass) {
    #z1;
    #z2;
    /**
     * The first x-coordinate of the element relative to the current anchor.
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
    /**
     * The second x-coordinate of the element relative to the current anchor.
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
