import BezierEasing from 'bezier-easing';

export default class DOMAnimate {

  /**
   * @param {number} start
   * @param {number} end
   * @param {function} lambda
   * @param {object=} options
   */
  constructor(start, end, lambda, options) {

    this.isRunning = false;
    this.start = start;
    this.end = end;
    this.options = options || {};

    //default options
    this.options.precision = this.options.precision === undefined ? 0 : this.options.precision;
    this.options.duration = this.options.duration === undefined ? 400 : this.options.duration;
    this.options.easing = this.options.easing || DOMAnimate.EASE_IN_OUT;

    //easing
    this.easingFunction = BezierEasing.apply(undefined, this.options.easing);

    //timing function
    this.timingFunction = this.options.timingFunction ||
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function( callback ){ window.setTimeout(callback, 1000 / 60); };


    //start animation
    if (!this.options.autoplay) {

      this.start();

    }

  }

  raf = (() => {
    return  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function( callback ){ window.setTimeout(callback, 1000 / 60); };
  })();



  stop = () => {

    this.isRunning = false;

  };

  start = () => {

    tick();

  };

  pause = () => {


  };

  resume = () => {


  };

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
   * @param {number} start
   * @param {number} end
   * @param {function} lambda
   * @param {object=} options
   */
  animate = (start, end, lambda, options) => {

    this.isRunning = true;

    options = options || {};
    options.precision = options.precision === undefined ? 0 : options.precision;
    options.duration = options.duration === undefined ? 400 : options.duration;
    options.easing = options.easing || DOMAnimate.EASE_IN_OUT;

    let easingFunction = BezierEasing.apply(undefined, options.easing);

    let raf = (function(){
      return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
    })();

    let startTime = Date.now();
    let endTime = startTime + options.duration;
    let totalDelta = end - start;

    let tick = () => {

      if (!this.isRunning) {

        return;

      }

      let currentTime = Date.now();
      let timeElapsed = currentTime - startTime;
      let percentageTimeElapsed = timeElapsed / options.duration;
      let percentageChange = easingFunction(percentageTimeElapsed);
      let nextPos = percentageChange * totalDelta + start;

      //precision
      if (options.precision !== undefined) {

        nextPos = +nextPos.toFixed(options.precision);

      }

      //call lambda
      lambda.call(undefined, nextPos);

      // do the animation unless its over
      if (currentTime < endTime) {

        raf(tick);

      } else {

        //done!

        //call lambda
        lambda.call(undefined, end);

        if (options && options.onComplete === 'function') {

          options.onComplete.apply();

        }

      }

    };

  }

}