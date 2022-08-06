const defaultAnchor = new p5.Vector();
p5.prototype._anchorStack = [defaultAnchor.copy()];

const defaultAngle = p5.prototype.createVector();
p5.prototype._angleStack = [defaultAngle.copy()];

const defaultScale = p5.prototype.createVector(1, 1, 1);
p5.prototype._scaleStack = [defaultScale.copy()];

const defaultShear = p5.prototype.createVector(1, 1);
p5.prototype._shearStack = [defaultShear.copy()];

p5.prototype._pushBase = p5.prototype.push;
p5.prototype.push = function () {
  this._setProperty(
    "_anchorStack",
    this._anchorStack.concat(defaultAnchor.copy())
  );
  this._setProperty(
    "_angleStack",
    this._angleStack.concat(defaultAngle.copy())
  );
  this._setProperty(
    "_scaleStack",
    this._scaleStack.concat(defaultScale.copy())
  );
  this._setProperty(
    "_shearStack",
    this._shearStack.concat(defaultShear.copy())
  );
  this._pushBase();
};

p5.prototype._popBase = p5.prototype.pop;
p5.prototype.pop = function () {
  this._setProperty("_anchorStack", this._anchorStack.slice(0, -1));
  this._setProperty("_angleStack", this._angleStack.slice(0, -1));
  this._setProperty("_scaleStack", this._scaleStack.slice(0, -1));
  this._setProperty("_shearStack", this._shearStack.slice(0, -1));
  this._popBase();
};

p5.prototype.RESET = "reset";

p5.prototype._defineProperties({
  anchor: {
    get: function () {
      return this._anchorStack[this._anchorStack.length - 1];
    },
    set: function (val) {
      const len = this._anchorStack.length;
      if (Array.isArray(val))
        this._anchorStack[this._anchorStack.length - 1].set(...val);
      else this._anchorStack[this._anchorStack.length - 1].set(val);
      this.translate(this.anchor);
    },
  },
  angle: {
    get: function () {
      return this._angleStack.slice(-1)[0].z;
    },
    set: function (val) {
      this._angleStack[this._anchorStack.length - 1].z = val;
      this.rotate(this.angle);
    },
  },
  angle_x: {
    get: function () {
      return this._angleStack.slice(-1)[0].x;
    },
    set: function (val) {
      this._angleStack[this._angleStack.length - 1].x = val;
      this.rotateX(this.angle_x);
    },
  },
  angle_y: {
    get: function () {
      return this._angleStack.slice(-1)[0].y;
    },
    set: function (val) {
      this._angleStack[this._angleStack.length - 1].y = val;
      this.rotateY(this.angle_y);
    },
  },
  angle_z: {
    get: function () {
      return this._angleStack.slice(-1)[0].z;
    },
    set: function (val) {
      this._angleStack[this._angleStack.length - 1].z = val;
      this.rotateZ(this.angle_z);
    },
  },
  angle_vector: {
    get: function () {
      return this._angleStack.slice(-1)[0];
    },
    set: function (val) {
      this._angleStack[this._angleStack.length - 1] = val;
    },
  },
  scale_factor: {
    get: function () {
      return this._scaleStack.slice(-1)[0];
    },
    set: function (val) {
      if (Array.isArray(val))
        this._scaleStack[this._scaleStack.length - 1].set(...val);
      else this._scaleStack[this._scaleStack.length - 1].set(val);
      this.scale(this.scale_factor);
    },
  },
  shear: {
    get: function () {
      const [lastShear] = this._shearStack.slice(-1);
      return lastShear;
    },
    set: function (val) {
      if (Array.isArray(val))
        this._shearStack[this._shearStack.length - 1].set(...val);
      else this._shearStack[this._shearStack.length - 1].set(val);
      this.shearX(this.shear.x);
      this.shearY(this.shear.y);
    },
  },
  transform_matrix: {
    get: function () {
      return this.drawingContext?.getTransform();
    },
    set: function (val) {
      if (val === this.RESET) this.resetMatrix();
      else this.applyMatrix(val);
    },
  },
});

p5.prototype.registerMethod("pre", function () {
  this._setProperty("_anchorStack", [this.anchor]);
  this.translate(this.anchor);
  this.angle_vector = this.angle_vector;
  this._setProperty("_angleStack", [this.angle_vector.copy()]);
  this.scale_factor = this.scale_factor;
  this._setProperty("_scaleStack", [this.scale_factor.copy()]);
});
