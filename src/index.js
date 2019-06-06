import BezierEasing from 'bezier-easing';

export default class Animator {

  static get EASE() {
    return [0.25, 0.1, 0.25, 1.0];
  }

  static get EASE_IN() {
    return [0.42, 0.0, 1.00, 1.0];
  }

  static get EASE_OUT() {
    return [0.00, 0.0, 0.58, 1.0];
  }

  static get EASE_IN_OUT() {
    return [0.42, 0.0, 0.58, 1.0];
  }

  static get LINEAR() {
    return [0.00, 0.0, 1.00, 1.0];
  }

  /**
   * @param {number} startValue
   * @param {number} endValue
   * @param {function} lambda
   * @param {object=} options
   */
  constructor(startValue, endValue, lambda, options) {

    this.isRunning = false;
    this.startValue = startValue;
    this.endValue = endValue;
    this.lambda = lambda;

    //options
    options = options || {};
    this.precision = options.precision === undefined ? 0 : options.precision;
    this.duration = options.duration === undefined ? 400 : options.duration;
    this.easing = options.easing || Animator.EASE_IN_OUT;
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

  }

  stop = () => {

    this.isRunning = false;
    this.startTime = null;
    this.endTime = null;

  };

  start = () => {

    this.isRunning = true;
    this.startTime = Date.now();
    this.endTime = this.startTime + this.duration;
    this.tick();

  };

  pause = () => {

    this.isRunning = false;
    this.timeEllapsedBeforePause = Date.now() - this.startTime;

  };

  resume = () => {

    this.isRunning = true;
    this.startTime = Date.now() - this.timeEllapsedBeforePause;
    this.endTime = this.startTime + this.duration;
    this.tick();

  };

  tick = () => {

    if (!this.isRunning) {

      return;

    }

    let now = Date.now();
    let timeElapsed = now - this.startTime;
    let percentageTimeElapsed = timeElapsed / this.duration;
    let percentageChange = this.easingFunction(percentageTimeElapsed);
    let distance = this.endValue - this.startValue;
    let nextPos = percentageChange * distance + this.startValue;

    nextPos = nextPos.toFixed(this.precision);

    //call lambda
    this.lambda.call(undefined, nextPos);

    if (now < this.endTime) {

      //next tick
      this.timingFunction.call(window, this.tick);

    } else {

      //animation finished
      this.lambda.call(undefined, this.endValue);
      this.onComplete.apply();

    }

  };

}