# dom-animate
Dead-simple helper function to perform any animation in the DOM or other environments.

Features:

- Really small filesize, only 1 dependency. 
- Supports Beizer Curves and custom easing functions, with predefined values. 
- Custom timing function (uses RAF by default if available) 
- Custom render function 
- Pause/resume/stop/restart animations. 
- Animations respect the actual clock, so no matter the frame rate, the animation will still properly last the appropriate amount of time.

## Installation

```bash
npm i dom-animate
```

## Example Usage (ES6)

```javascript
import Animator from 'dom-animate'; //require also works

let el = document.querySelector('.myElement');

//animate height from 0 to 200 with all defaults
let animation = new Animator(0, 200, (x) => {
  el.style.height = x + 'px';
});

//animate scale (with cross-browser support) from 1 to 2 with some options
let animation = new Animator(1, 2, x => {
  el.style.transform = `scale(${x}, ${x})`;
  el.style.webkitTransform = `scale(${x}, ${x})`;
}, {
  duration: 200,
  easing: [0.42, 0.0, 0.58, 1.0],
  precision: 0,
  onComplete: () => alert('done!')
});

//stop animation
animation.stop();

//restart animation after stopping
animation.play();

//pause animation
animation.pause();

//resume animation after pausing
animation.resume();

//don't animate right away. create animation, then play after 1s
let animation = new Animator(0, 200, (x) => {
  el.style.height = x + 'px';
}, {
  autoplay: false
});

setTimeout(animation.play, 1000);

//provide a custom timing function instead of the default `window.requestAnimationFrame`
//in this example, it tries to render at exactly 24fps
let animation = new Animator(0, 200, (x) => {
  el.style.height = x + 'px';
}, {
  timingFunction: callback => { window.setTimeout(callback, 1000 / 24); }
});
```

## API

### `animate({number} start, {number} end, {function} lamda, {object=} options)`

#### `{int} start`

The start value of the animation.

#### `{int} end`

The end value of the animation.

### `{function} lambda({number} x)`

The function that sets the styles on frame update. `x` is a number that 
represents the current frame's animation value.

#### `{object=} options`

An optional map of parameters:

###### `{boolean} autoplay`

If true, the animation will start as soon as `animation()` is called. [Default: `true`]

###### `{integer} precision`

Number of decimal places to round to. (Default: `null`)

###### `{integer} duration`

Animation duration in milliseconds. (Default: `400`)

###### `{array} easing`

An array to pass to the cubic-bezier easing function. (Default: `Animator.EASE_IN_OUT`)

###### `{function} onComplete`

A callback function that is called when the animation is finished.

###### `{function} timingFunction`

Lambda function that is used to call the `renderFrame()` function. By default, if in a browser
environment, this will be `window.requestAnimationFrame`, `window.webkitRequestAnimationFrame`,
etc. If your environment doesn't support these methods, and you don't provide your own,
a default timing function will be used that is called at 60fps.

### `play()`

Ends any current animation and starts the animation from the beginning. 

### `stop()`

Ends any current animation.

### `pause()`

Pauses any current animation.

### `resume()`

Resumes any current animation.

## Constants

### Bezier Curve Easing Functions

`EASE`, `EASE_IN`, `EASE_OUT`, `EASE_IN_OUT`, `LINEAR`

## Additional Resources

- [Jank Free](http://jankfree.org/)
- [CSS Tricks article](https://css-tricks.com/tale-of-animation-performance/)
- [CSS Tricks](https://css-tricks.com)

## License

[MIT](https://github.com/mhweiner/mr-router/blob/master/LICENSE). Free to use in all your things!

## Contribution

DO IT! PR's welcome. Need to add testing and linting.
