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

function Animator(startValue, endValue, lambda, options) {

  var _this = this;

  this.isRunning = false;
  this.startValue = startValue;
  this.endValue = endValue;
  this.lambda = lambda;

  //options
  options = options || {};
  this.precision = options.precision === undefined ? 0 : options.precision;
  this.duration = options.duration === undefined ? 400 : options.duration;
  this.easing = options.easing || EASING_CONSTANTS.EASE_IN_OUT;
  this.easingFunction = BezierEasing.apply(undefined, this.easing);
  this.onComplete = options.onComplete || function(){};
  this.timingFunction = options.timingFunction ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function( callback ){ window.setTimeout(callback, 1000 / 60); };

  //start animation
  if (!options.autoplay) {

    this.start();

  }

  this.stop = function() {

    _this.isRunning = false;
    _this.startTime = null;
    _this.endTime = null;

  };

  this.start = function() {

    _this.isRunning = true;
    _this.startTime = Date.now();
    _this.endTime = _this.startTime + _this.duration;
    _this.tick();

  };

  this.pause = function() {

    _this.isRunning = false;
    _this.timeEllapsedBeforePause = Date.now() - _this.startTime;

  };

  this.resume = function() {

    _this.isRunning = true;
    _this.startTime = Date.now() - _this.timeEllapsedBeforePause;
    _this.endTime = _this.startTime + _this.duration;
    _this.tick();

  };

  this.tick = function() {

    if (!_this.isRunning) {

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

}

function DOMAnimate() {}
DOMAnimate.EASING = EASING;
DOMAnimate.Animator = Animator;
module.exports = DOMAnimate;