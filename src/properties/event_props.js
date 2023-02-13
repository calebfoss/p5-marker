export const addEventProps = (baseClass) =>
  class extends baseClass {
    get mouse() {
      return {
        x: this.pInst.mouseX,
        y: this.pInst.mouseY,
        previous: {
          x: this.pInst.pmouseX,
          y: this.pInst.pmouseY,
        },
        window: {
          x: this.pInst.winMouseX,
          y: this.pInst.winMouseY,
          previous: {
            x: this.pInst.pwinMouseX,
            y: this.pInst.pwinMouseY,
          },
        },
        moved: {
          x: this.pInst.movedX,
          y: this.pInst.movedY,
        },
        button: this.pInst.mouseButton,
      };
    }
  };
