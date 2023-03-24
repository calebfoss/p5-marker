export const addCanvasMethods = (baseClass) =>
  class extends baseClass {
    attributeInherited(attributeName) {
      if (this.hasAttribute(attributeName)) return true;
      return super.attributeInherited(attributeName);
    }
    runCode() {
      const canvas = this;
      const sketch = (pInst) => {
        pInst.preload = () => pInst.loadAssets();

        pInst.setup = function () {
          canvas.setup(pInst, canvas);
          canvas.updateState();
          //  Set default background to light gray
          canvas.background = pInst.color(220);
          pInst.assignCanvas(canvas, canvas.constructor.renderer);
        };
        pInst.draw = function () {
          if (canvas.orbit_control) canvas.pInst.orbitControl();
          canvas.draw();
        };
      };
      new p5(sketch);
    }
    render() {
      this.pInst.background(this.background);
    }
  };
