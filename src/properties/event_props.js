export const addEventProps = (baseClass) =>
  class extends baseClass {
    /**
     * The mouse object contains infromation about the current position
     * and movement of the mouse:
     * - mouse.x - x-coordinate relative to upper left of canvas
     * - mouse.y - y-coordinate relative to upper left of canvas
     * - mouse.previous.x - x-coordinate in previous frame
     * - mouse.previous.y - y-coordinate in previous frame
     * - mouse.window.x - x-coordinate relative to upper left of window
     * - mouse.window.y - y-coordinate relative to upper left of window
     * - mouse.window.previous.x - window x-coordinate in previous frame
     * - mouse.window.previous.y - window y-coordinate in previous frame
     * - mouse.moved.x - horizontal movement of the mouse since last frame
     * - mouse.moved.y - vertical movement of the mouse since last frame
     * - mouse.pressed - boolean that is true while the mouse button is held down
     * - mouse.dragging - boolean that true while the mouse is pressed and moving
     * - mouse.button - which mouse button is currently pressed: LEFT, RIGHT, CENTER,
     *    or 0 for none.
     *
     * @type {Object}
     */
    get mouse() {
      const { pInst } = this;
      return {
        x: pInst.mouseX,
        y: pInst.mouseY,
        previous: {
          x: pInst.pmouseX,
          y: pInst.pmouseY,
        },
        window: {
          x: pInst.winMouseX,
          y: pInst.winMouseY,
          previous: {
            x: pInst.pwinMouseX,
            y: pInst.pwinMouseY,
          },
        },
        moved: {
          x: pInst.movedX,
          y: pInst.movedY,
        },
        pressed: pInst.mouseIsPressed,
        button: pInst.mouseButton,
        dragging:
          pInst.mouseIsPressed && (pInst.movedX !== 0 || pInst.movedY !== 0),
      };
    }
    get acceleration() {
      const { pInst } = this;
      return {
        x: pInst.accelerationX,
        y: pInst.accelerationY,
        z: pInst.accelerationZ,
        previous: {
          x: pInst.pAccelerationX,
          y: pInst.pAccelerationY,
          z: pInst.pAccelerationZ,
        },
      };
    }
    get device_rotation() {
      const { pInst } = this;
      return {
        x: pInst.rotationX,
        y: pInst.rotationY,
        z: pInst.rotationZ,
        previous: {
          x: pInst.pRotationX,
          y: pInst.pRotationY,
          z: pInst.pRotationZ,
        },
      };
    }
  };
