export const addCanvasMethods = (baseClass) =>
  class extends baseClass {
    attributeInherited(attributeName) {
      if (this.hasAttribute(attributeName) || attributeName in this.defaults)
        return true;
      return super.attributeInherited(attributeName);
    }
    runCode() {
      const canvas = this;
      const sketch = (pInst) => {
        canvas.defaults = {
          x: 0,
          x1: 0,
          x2: 0,
          x3: 100,
          x4: 100,
          cx: 0,
          y: 0,
          y1: 0,
          y2: 100,
          y3: 100,
          y4: 0,
          cy: 0,
          z: 0,
          w: 100,
          h: 100,
          d: 100,
          size: 100,
          start_angle: 0,
          stop_angle: pInst.PI,
          vector: pInst.createVector(),
          v1: 255,
          v2: 255,
          v3: 255,
          rx: 1,
          ry: 1,
          rz: -1,
          img: pInst.createImage(100, 100),
          on: true,
          repeat: false,
          change: {},
        };

        pInst.preload = () => pInst.loadAssets();

        pInst.setup = function () {
          canvas.setup(pInst, canvas);
          // Set default dimensions (100, 100)
          canvas.width = 100;
          canvas.height = 100;
          //  Set default background to transparent
          canvas.background = pInst.color(0, 0);
          pInst.assignCanvas(canvas, canvas.constructor.renderer);
        };
        pInst.draw = function () {
          if (canvas.orbit_control) canvas.pInst.orbitControl();
          canvas.draw(canvas.defaults);
        };
      };
      new p5(sketch);
    }
    render() {
      this.pInst.background(this.background);
    }
  };
