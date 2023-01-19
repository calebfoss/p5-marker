import { defineRendererGetterSetters } from "../utils/p5Modifiers";

const pointTangentOverload = (fn) =>
  function () {
    const args = arguments;
    if (args.length !== 9) return fn(...args);
    return this.createVector(
      fn(args[0], args[2], args[4], args[6], args[8]),
      fn(args[1], args[3], args[5], args[7], args[8])
    );
  };
p5.prototype.bezierPoint = pointTangentOverload(p5.prototype.bezierPoint);
p5.prototype.bezierTangent = pointTangentOverload(p5.prototype.bezierTangent);
p5.prototype.curvePoint = pointTangentOverload(p5.prototype.curvePoint);
p5.prototype.curveTangent = pointTangentOverload(p5.prototype.curveTangent);

defineRendererGetterSetters("ellipseMode", "rectMode", "curveTightness");
