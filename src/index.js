/**
 * https://github.com/mhweiner/dom-animate
 * dom-animate - Dead-simple helper function to perform any animation in the DOM or other environments.
 * @author Marc H. Weiner
 * @license MIT
 */

var BezierEasing = require('bezier-easing');

var EASING = {
  EASE: [0.25, 0.1, 0.25, 1],
  EASE_IN: [0.42, 0, 1, 1],
  EASE_OUT: [0, 0, 0.58, 1],
  EASE_IN_OUT: [0.42, 0, 0.58, 1],
  LINEAR: [0, 0, 1, 1]
};

function DOMAnimate(startValue, endValue, lambda, options) {

  var _this = this;

  this.isRunning = false;
  this.startValue = startValue;
  this.endValue = endValue;
  this.lambda = lambda;

  //options
  options = options || {};
  this.precision = options.precision === undefined ? 0 : options.precision;
  this.duration = options.duration === undefined ? 400 : options.duration;
  this.easing = options.easing || EASING.EASE_IN_OUT;
  this.easingFunction = BezierEasing.apply(undefined, this.easing);
  this.onComplete = options.onComplete || function(){};
  this.timingFunction = options.timingFunction ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function( callback ){ window.setTimeout(callback, 1000 / 60); };


  function endDelayAndContinue() {

    _this.delayTimeout = null;
    _this.delayEnded = true;
    _this.delayRemaining = null;
    _this.delayStartTime = null;

    _this.startTime = Date.now();
    _this.endTime = _this.startTime + _this.duration;
    _this.tick();

  }

  function startDelay() {

    _this.delayStartTime = Date.now();
    _this.delayTimeout = setTimeout(endDelayAndContinue, options.delay);

  }

  function stopDelay() {

    clearTimeout(_this.delayTimeout);
    _this.delayStartTime = null;
    _this.delayRemaining = null;
    _this.delayEnded = null;

  }

  function pauseDelay() {

    clearTimeout(_this.delayTimeout);

    var timeElapsed = Date.now() - _this.delayStartTime;

    _this.delayRemaining -= timeElapsed;

    if (_this.delayRemaining <= 0) {

      _this.delayEnded = true;
      _this.delayRemaining = null;
      _this.delayStartTime = null;

    }

  }

  function resumeDelay() {

    if (_this.delayRemaining <= 0) {

      endDelayAndContinue();

    }

    _this.delayStartTime = Date.now();

    if (!_this.delayRemaining) {

      _this.delayRemaining = options.delay;

    }

    _this.delayTimeout = setTimeout(endDelayAndContinue, _this.delayRemaining);

  }

  this.stop = function() {

    _this.isRunning = false;
    _this.startTime = null;
    _this.endTime = null;
    stopDelay();

  };

  this.play = function() {

    _this.isRunning = true;

    if (options.delay) {

      stopDelay();
      startDelay();

    } else {

      _this.startTime = Date.now();
      _this.endTime = _this.startTime + _this.duration;
      _this.tick();

    }

  };

  this.pause = function() {

    _this.isRunning = false;

    if (options.delay && !_this.delayEnded) {

      pauseDelay();

    } else {

      _this.timeEllapsedBeforePause = Date.now() - _this.startTime;

    }

  };

  this.resume = function() {

    _this.isRunning = true;

    if (options.delay && !_this.delayEnded) {

      resumeDelay();

    } else {

      _this.startTime = Date.now() - _this.timeEllapsedBeforePause;
      _this.endTime = _this.startTime + _this.duration;
      _this.tick();

    }

  };

  this.tick = function() {

    if (!_this.isRunning || (options.delay && !_this.delayEnded)) {

      return;

    }

    var now = Date.now();
    var timeElapsed = now - _this.startTime;
    var percentageTimeElapsed = timeElapsed / _this.duration;
    var percentageChange = _this.easingFunction(percentageTimeElapsed);
    var distance = _this.endValue - _this.startValue;
    var nextPos = percentageChange * distance + _this.startValue;

    nextPos = nextPos.toFixed(_this.precision);

    //call lambda
    _this.lambda.call(undefined, nextPos);

    if (now < _this.endTime) {

      //next tick
      _this.timingFunction.call(window, _this.tick);

    } else {

      //animation finished
      _this.lambda.call(undefined, _this.endValue);
      _this.onComplete.apply();

    }

  };

  //start animation
  if (!options.autoplay) {

    this.play();

  }

}

DOMAnimate.EASING = EASING;

module.exports = DOMAnimate;
