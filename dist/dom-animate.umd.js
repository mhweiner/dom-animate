(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.DOMAnimate = factory());
}(this, function () { 'use strict';

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

  /**
   * https://github.com/gre/bezier-easing
   * BezierEasing - use bezier curve for transition easing function
   * by Gaëtan Renaudeau 2014 - 2015 – MIT License
   */

  // These values are established by empiricism with tests (tradeoff: performance VS precision)
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 0.001;
  var SUBDIVISION_PRECISION = 0.0000001;
  var SUBDIVISION_MAX_ITERATIONS = 10;

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  var float32ArraySupported = typeof Float32Array === 'function';

  function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
  function C (aA1)      { return 3.0 * aA1; }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

  function binarySubdivide (aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }

  function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
   for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
     var currentSlope = getSlope(aGuessT, mX1, mX2);
     if (currentSlope === 0.0) {
       return aGuessT;
     }
     var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
     aGuessT -= currentX / currentSlope;
   }
   return aGuessT;
  }

  var src = function bezier (mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error('bezier x values must be in [0, 1] range');
    }

    // Precompute samples table
    var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    if (mX1 !== mY1 || mX2 !== mY2) {
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function getTForX (aX) {
      var intervalStart = 0.0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      // Interpolate to provide an initial guess for t
      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;

      var initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function BezierEasing (x) {
      if (mX1 === mY1 && mX2 === mY2) {
        return x; // linear
      }
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (x === 0) {
        return 0;
      }
      if (x === 1) {
        return 1;
      }
      return calcBezier(getTForX(x), mY1, mY2);
    };
  };

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
       * @param {number} startValue
       * @param {number} endValue
       * @param {function} lambda
       * @param {object=} options
       */

    }]);

    function Animator(startValue, endValue, lambda, options) {
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

        var nextPos = percentageChange * _this.duration + _this.startValue;
        nextPos = nextPos.toFixed(_this.precision); //call lambda

        _this.lambda.call(undefined, nextPos);

        if (now < _this.endTime) {
          //next tick
          _this.timingFunction(_this.tick);
        } else {
          //animation finished
          _this.lambda.call(undefined, _this.endValue);

          _this.onComplete.apply();
        }
      });

      this.isRunning = false;
      this.startValue = start;
      this.endValue = end;
      this.lambda = lambda; //options

      options = options || {};
      this.precision = options.precision === undefined ? 0 : options.precision;
      this.duration = options.duration === undefined ? 400 : options.duration;
      this.easing = options.easing || DOMAnimate.EASE_IN_OUT;
      this.easingFunction = src.apply(undefined, this.easing);

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

  return Animator;

}));
