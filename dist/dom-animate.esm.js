import BezierEasing from 'bezier-easing';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var Animator =
/*#__PURE__*/
function () {
  _createClass(Animator, null, [{
    key: "EASE",
    get: function get() {
      return [0.25, 0.1, 0.25, 1.0];
    }
  }, {
    key: "EASE_IN",
    get: function get() {
      return [0.42, 0.0, 1.00, 1.0];
    }
  }, {
    key: "EASE_OUT",
    get: function get() {
      return [0.00, 0.0, 0.58, 1.0];
    }
  }, {
    key: "EASE_IN_OUT",
    get: function get() {
      return [0.42, 0.0, 0.58, 1.0];
    }
  }, {
    key: "LINEAR",
    get: function get() {
      return [0.00, 0.0, 1.00, 1.0];
    }
    /**
     * @param {number} start
     * @param {number} end
     * @param {function} lambda
     * @param {object=} options
     */

  }]);

  function Animator(start, end, lambda, options) {
    var _this = this;

    _classCallCheck(this, Animator);

    _defineProperty(this, "stop", function () {
      _this.isRunning = false;
      _this.startTime = null;
      _this.endTime = null;
    });

    _defineProperty(this, "start", function () {
      _this.isRunning = true;
      _this.startTime = Date.now();
      _this.endTime = _this.startTime + _this.duration;

      _this.tick();
    });

    _defineProperty(this, "pause", function () {
      _this.isRunning = false;
      _this.timeEllapsedBeforePause = Date.now() - _this.startTime;
    });

    _defineProperty(this, "resume", function () {
      _this.isRunning = true;
      _this.startTime = Date.now() - _this.timeEllapsedBeforePause;
      _this.endTime = _this.startTime + _this.duration;

      _this.tick();
    });

    _defineProperty(this, "tick", function () {
      if (!_this.isRunning) {
        return;
      }

      var now = Date.now();
      var timeElapsed = now - _this.startTime;
      var percentageTimeElapsed = timeElapsed / _this.duration;

      var percentageChange = _this.easingFunction(percentageTimeElapsed);

      var nextPos = percentageChange * _this.duration + _this.start;
      nextPos = nextPos.toFixed(_this.precision); //call lambda

      _this.lambda.call(undefined, nextPos);

      if (now < _this.endTime) {
        //next tick
        _this.timingFunction(_this.tick);
      } else {
        //animation finished
        _this.lambda.call(undefined, _this.end);

        _this.onComplete.apply();
      }
    });

    this.isRunning = false;
    this.start = start;
    this.end = end;
    this.lambda = lambda; //options

    options = options || {};
    this.precision = options.precision === undefined ? 0 : options.precision;
    this.duration = options.duration === undefined ? 400 : options.duration;
    this.easing = options.easing || DOMAnimate.EASE_IN_OUT;
    this.easingFunction = BezierEasing.apply(undefined, this.easing);

    this.onComplete = options.onComplete || function () {};

    this.timingFunction = options.timingFunction || window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }; //start animation


    if (!options.autoplay) {
      this.start();
    }
  }

  return Animator;
}();

export default Animator;
