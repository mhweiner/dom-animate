# dom-animate
Helper function to smoothly do any animation in the DOM. Bezier curve support & pre-defined easing functions.

Animations respect the actual clock, so no matter the frame rate, the animation will still properly last the appropriate amount of time.

Ability to pause and resume or cancel animations.

Animations are performed using `window.requestAnimationFrame`.

## Installation

```bash
npm i dom-animate
```

## Example Usage (ES6)

```javascript
import animate from 'dom-animate'; //require also works

let el = document.querySelector('.myElement');

//animate height from 0 to 200 with all defaults
let animation = new animate(0, 200, (x) => {
  el.style.height = x + 'px';
});

//animate scale (with cross-browser support) from 1 to 2 with some options
let animation = new animate(1, 2, x => {
  el.style.transform = `scale(${x}, ${x})`;
  el.style.webkitTransform = `scale(${x}, ${x})`;
}, {
  duration: 200,
  easing: [0.42, 0.0, 0.58, 1.0],
  precision: 0,
  onDone: () => alert('done!')
});

//stop animation
animation.stop();

//restart animation after stopping
animation.play();

//pause animation
animation.pause();

//resume animation after pausing
animation.resume();

//don't animate right away. create animation, then play after 1s, then pause after 1s, then resume after 1, 
//then stop after 1s.
let animation = new animate(0, 200, (x) => {
  el.style.height = x + 'px';
}, {
  autoStart: false
});
setTimeout(() => {
  animate.play();
  setTimeout(() => {
    animate.pause();
    setTimeout(() => {
      animate.resume();
      setTimeout(() => {
        animate.stop();
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);





```

## API

### `animate({HTMLElement} el, {string} styleProperty, {number} start, {number} end, {object=} options)`

Performs the animation on `el`.

#### `{HTMLElement} el`

The element to animate.

#### `{string}` styleProperty

The style property to animate. If you are using `options.customPropertyUpdate`, this parameter will be ignored. In that
case, feel free to pass `null` for this parameter.

#### `{int} start`

The start value of the property.

#### `{int} end`

The end value of the property.

#### `{object=} options`

An optional map of parameters:

###### `{string} unit`

Unit of value. (Default: `"px"`)

###### `{integer} precision`

Number of decimal places to round to. (Default: `null`)

###### `{integer} duration`

Animation duration in milliseconds. (Default: `400`)

###### `{array} easing`

An array to pass to the cubic-bezier easing function. (Default: `DOMAnimateProperty.EASE_IN_OUT`)

###### `{function} onDone`

A callback function that is called when the animation is finished.

###### `{function} customPropertyUpdate(el, pos, unit)`

If you are not trying to animate a property on `el.style`, then a custom function to use for updating the element will
be required. This function takes 3 parameters: it is passed the original `el`, the next `pos`, and whatever
`options.unit` was passed. See the example above.

### `cancel()`

Stops the animation.

## Constants

### Bezier Curve Easing Functions

`EASE`, `EASE_IN`, `EASE_OUT`, `EASE_IN_OUT`, `LINEAR`

## License

[MIT](https://github.com/mhweiner/mr-router/blob/master/LICENSE). Free to use in all your things!

## Contribution

DO IT! PR's welcome. Need to add testing and linting.