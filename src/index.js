import BezierEasing from 'bezier-easing';

export default class DOMAnimateProperty {

  constructor() {

    this.isRunning = false;

  }

  cancel() {

    this.isRunning = false;

  }

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
   * Animate scrolling element to position. Possible options:
   * [string=] unit (default: 'px')
   * [int=] duration (default: 400)
   * [array=] easing (default: DOMAnimateProperty.EASE_IN_OUT)
   * [function=] onDone (default: null)
   * @param {HTMLElement} el
   * @param {string} property
   * @param {number} start
   * @param {number} end
   * @param {object} options
   */
  animate(el, property, start, end, options) {

    this.isRunning = true;

    let that = this;

    //defaults
    if (typeof el !== 'object') {

      throw 'el is required and must be an object';

    }
    options = options || {};
    options.unit = options.unit || 'px';
    options.duration = options.duration === undefined ? 400 : options.duration;
    options.easing = options.easing || DOMAnimateProperty.EASE_IN_OUT;

    let easingFunction = BezierEasing.apply(undefined, options.easing);

    let raf = (function(){
      return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
    })();

    function applyStyle(pos) {

      el.style[property] = pos + options.unit;

    }

    let startTime = Date.now();
    let endTime = startTime + options.duration;
    let totalDelta = end - start;

    function tick() {

      if (!that.isRunning) {

        return;

      }

      let currentTime = Date.now();
      let timeElapsed = currentTime - startTime;
      let percentageTimeElapsed = timeElapsed / options.duration;
      let percentageChange = easingFunction(percentageTimeElapsed);
      let nextPos = percentageChange * totalDelta + start;

      // update element
      applyStyle(nextPos);

      // do the animation unless its over
      if (currentTime < endTime) {

        raf(tick);

      } else {

        //done!
        applyStyle(end);

        if (typeof options.onDone === 'function') {

          options.onDone.apply();

        }

      }

    }

    //start animation
    tick();

  }

}