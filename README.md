# dom-animate
Dead-simple helper function to perform any animation in the DOM or other environments.

Features:

- Really small filesize, only 1 dependency (~2.5KB uncompressed, including dependency). 
- Straightforward, simple API. 
- Supports Beizer Curves and custom easing functions, with predefined values. 
- Custom timing function (uses RAF by default if available) 
- Pause/resume/stop/restart animations.
- Supports delays that still work with pause/resume/stop/restart.
- Animations respect the actual clock, so no matter the frame rate, the animation will still properly last the appropriate amount of time.
- Lambda render functions.

## Installation

NPM:

```bash
npm i dom-animate
```

browser:

You can use either `dom-animate.umd.js` or `dom-animate.min.umd.js` 
[from the latest release](https://github.com/mhweiner/dom-animate/releases) in a `script` tag.
This includes all dependencies.

```html
<script src="dom-animate.min.umd.js"></script>
<script>
    let el = document.querySelector('.myElement');

    let animation = new DOMAnimate(0, 200, (x) => {
      el.style.height = x + 'px';
    });
</script>
```

## Example Usage

```javascript
const DOMAnimate = require('dom-animate');
const el = document.querySelector('.myElement');

//animate height from 0 to 200 with all defaults
const animation = new DOMAnimate(0, 200, x => {
  el.style.height = x + 'px';
});

//animate scale (with cross-browser support) from 1 to 2 with some options
const animation = new DOMAnimate(1, 2, x => {
  el.style.transform = `scale(${x}, ${x})`;
  el.style.webkitTransform = `scale(${x}, ${x})`;
}, {
  duration: 200,
  easing: [0.42, 0.0, 0.58, 1.0],
  onComplete: () => alert('done!')
});

//animate with pre-defined easing constant
const animation = new DOMAnimate(0, 200, x => {
  el.style.height = x + 'px';
}, {
  easing: DOMAnimate.EASING.LINEAR
});

//stops animation. `play() or resume()` both play from the beginning.
animation.stop();

//restarts animation after stopping
animation.play();

//pauses animation
animation.pause();

//resumes animation after pausing
animation.resume();

//don't animate right away. create animation object, then play after 1s
const animation = new DOMAnimate(0, 200, x => {
  el.style.height = x + 'px';
}, {
  autoplay: false
});
setTimeout(animation.play, 1000);

//provide a custom timing function instead of the default `window.requestAnimationFrame`
//in this example, it tries to render at exactly 24fps
const animation = new DOMAnimate(0, 200, (x) => {
  el.style.height = x + 'px';
}, {
  timingFunction: callback => { window.setTimeout(callback, 1000 / 24); }
});
```

## Animation with delays

You can think of a delay as just a part of the animation. It is respected by the pause/resume functionality all the same.

```javascript
const animation = new DOMAnimate(0, 1, x => {
    document.getElementById('id').style.opacity = x;
  }, {
    easing: [0.25, 0.46, 0.45, 0.9],
    delay: 1000 //1s
  });

animation.pause(); //delay is paused.
animation.resume(); //delay is resumed

/* without autoplay */

const animation = new DOMAnimate(0, 1, x => {
    document.getElementById('id').style.opacity = x;
  }, {
    easing: [0.25, 0.46, 0.45, 0.9],
    delay: 1000, //1s
    autoplay: false
  });

animation.play(); //delay starts now, along with rest of animation
```

## API

### `constructor({number} start, {number} end, {function} lamda, {object=} options)`

#### `{int} start`

The start value of the animation.

#### `{int} end`

The end value of the animation.

#### `{function} lambda({number} x)`

The function that sets the styles on frame update. `x` is a number that 
represents the current frame's animation value.

#### `{object=} options`

An optional map of parameters:

###### `{boolean} autoplay`

If true, the animation will start as soon as `animation()` is called. [Default: `true`]

###### `{integer} duration`

Animation duration in milliseconds. (Default: `400`)

###### `{array} easing`

An array to pass to the cubic-bezier easing function. (Default: `Animator.EASE_IN_OUT`)

###### `{function} onComplete`

A callback function that is called when the animation is finished.

###### `{function} timingFunction`

Lambda function that is used to call the `tick()` method. By default, if in a browser
environment, this will be `window.requestAnimationFrame`, `window.webkitRequestAnimationFrame`,
etc. If your environment doesn't support these methods, and you don't provide your own,
a default timing function will be used that is called at 60fps.

### `play()`

Starts the animation.

### `stop()`

Ends any current animation.

### `pause()`

Pauses any current animation.

### `resume()`

Resumes any current animation.

## Constants

### `EASING`

`dom-animate` ships with a small Bezier Curve library:

- `EASING.EASE`
- `EASING.EASE_IN`
- `EASING.EASE_OUT`
- `EASING.EASE_IN_OUT`
- `EASING.LINEAR`

## Additional Resources

- [Jank Free](http://jankfree.org/)
- [CSS Tricks article](https://css-tricks.com/tale-of-animation-performance/)
- [CSS Tricks](https://css-tricks.com)

## License

[MIT](https://github.com/mhweiner/dom-animate/blob/master/LICENSE). Free to use in all your things!

## Contribution

DO IT! PR's welcome. Need to add testing and linting.
