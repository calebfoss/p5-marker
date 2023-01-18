export const addColorMethods = (baseClass) =>
  class extends baseClass {
    lerp_color() {
      return this.pInst.lerpColor(...arguments);
    }
  };
