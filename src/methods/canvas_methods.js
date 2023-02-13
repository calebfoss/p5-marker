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
          //  Set default background to transparent
          canvas.background = pInst.color(0, 0);
          pInst.assignCanvas(canvas, canvas.constructor.renderer);
          // Set default dimensions (100, 100)
          canvas.width = 100;
          canvas.height = 100;
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
