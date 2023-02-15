import {
  defineProperties,
  defineSnakeAlias,
  wrapMethod,
} from "../utils/p5Modifiers";

defineSnakeAlias("deviceOrientation", "turnAxis", "keyIsDown");

//  TODO - test on mobile device
p5.prototype.device_moved = false;

//  TODO - test on mobile device
p5.prototype.device_turned = false;

p5.prototype.mouse_down = false;

p5.prototype.mouse_up = false;

p5.prototype.mouse_dragging = false;

p5.prototype.mouse_double_clicked = false;

p5.prototype._mouseWheel = 0;

p5.prototype.key_down = false;

p5.prototype.key_up = false;

//  TODO - test on mobile device
p5.prototype.touch_started = false;
p5.prototype.touch_moved = false;
p5.prototype.touch_ended = false;

p5.prototype._startAngleZ;
wrapMethod(
  "_handleMotion",
  (base) =>
    function () {
      base.call(this);
      this._setProperty("deviced_moved", true);
    }
);

wrapMethod(
  "_onmousedown",
  (base) =>
    function (e) {
      base.call(this, e);
      this._setProperty("mouse_down", true);
    }
);

wrapMethod(
  "_ondbclick",
  (base) =>
    function (e) {
      base.call(this, e);
      this._setProperty("mouse_double_clicked", true);
    }
);

wrapMethod(
  "_onmousemove",
  (base) =>
    function (e) {
      base.call(this, e);
      this._setProperty("mouse_dragging", this.mouseIsPressed);
      this._setProperty("touch_moved", this.mouseIsPressed);
    }
);

wrapMethod(
  "_onwheel",
  (base) =>
    function (e) {
      base.call(this, e);
      this._setProperty("_mouseWheel", this._mouseWheelDeltaY);
    }
);

wrapMethod(
  "_onkeyup",
  (base) =>
    function (e) {
      base.call(this, e);
      this._setProperty("key_up", true);
      this._setProperty("key_held", false);
    }
);

wrapMethod(
  "_onkeydown",
  (base) =>
    function (e) {
      base.call(this, e);
      this._setProperty("key_down", true);
    }
);

wrapMethod(
  "_ontouchbase",
  (base) =>
    function (e) {
      base.call(this, e);
      this._setProperty("touch_started", true);
    }
);

wrapMethod(
  "_ontouchmove",
  (base) =>
    function (e) {
      base.call(this, e);
      this._setProperty("touch_moved", true);
    }
);

wrapMethod(
  "_ontouchend",
  (base) =>
    function (e) {
      base.call(this, e);
      this._setProperty("touch_ended", true);
    }
);

p5.prototype.registerMethod("pre", function () {
  this._setProperty(
    "mouse_up",
    this.mouseIsPressed == false && this.mouse_held == true
  );
  this._setProperty("mouse_held", this.mouseIsPressed);
  this._setProperty("key_held", this.key_down);
});

p5.prototype.registerMethod("post", function () {
  this._setProperty("device_moved", false);
  this._setProperty("mouse_down", false);
  this._setProperty("mouse_dragging", false);
  this._setProperty("mouse_double_clicked", false);
  this._setProperty("_mouseWheel", false);
  this._setProperty("key_up", false);
  this._setProperty("key_down", false);
  this._setProperty("touch_started", false);
  this._setProperty("touch_moved", false);
  this._setProperty("touch_ended", false);
});

//  Create properties with default value
p5.prototype._moveThreshold = 0.5;
p5.prototype._shakeThreshold = 30;

defineProperties({
  //  TODO - test on mobile device
  device_turned: {
    get: function () {
      if (
        this.rotationX === null &&
        this.rotationY === null &&
        this.rotationZ === null
      )
        return false;
      return (
        this.rotationX !== this.pRotationX ||
        this.rotationY !== this.pRotationY ||
        this.rotationZ !== this.pRotationZ
      );
    },
  },
  key_code: {
    get: function () {
      return this.keyCode;
    },
  },
  mouse_wheel: {
    get: function () {
      return this._mouseWheel;
    },
  },
  move_threshold: {
    get: function () {
      return this._moveThreshold;
    },
    set: function (val) {
      this.setMoveThreshold(val);
    },
  },
  pointer_lock_request: {
    get: function () {
      return document.pointerLockElement === this._curElement.elt;
    },
    set: function (val) {
      if (val) this.requestPointerLock();
      else this.exitPointerLock();
    },
  },
  shake_threshold: {
    get: function () {
      return this._shakeThreshold;
    },
    set: function (val) {
      this.setShakeThreshold(val);
    },
  },
});
