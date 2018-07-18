# dom-animate-property
Smoothly animates any property on a DOM HTMLElement. Bezier curve support & pre-defined easing functions.

Animations respect the actual clock, so no matter the frame rate, the animation will still properly last the appropriate amount of time.

Animations are performed using `window.requestAnimationFrame`.

## Installation

```bash
npm i dom-animate-property
```

## Example Usage (ES6)

```javascript
import DOMAnimateProperty from 'dom-animate-property'; //require also works

let animator = new DOMAnimateProperty();

let el = document.querySelector('.myElement');

//animate height from 0 to 200
animator.animate(el, 'height', 0, 200);

// Animate translateX from 0 to 200, duration of 200ms, custom cubic-bezier easing function, callback,
// and precision of 0 decimal places (round to nearest integer).
animator.animate(el, null, 0, 200, {
  duration: 200,
  easing: [0.42, 0.0, 0.58, 1.0],
  precision: 0,
  onDone: () => alert('done!'),
  customPropertyUpdate: (el, pos) => el.style.transform = `translateX(${pos}px)`
});

// Animate scale (with cross-browser support) from 1 to 2, pre-defined cubic-bezier easing function, and precision of 5
// decimal places
animator.animate(el, null, 1, 2, {
  easing: DOMAnimateProperty.EASE_OUT,
  precision: 5,
  customPropertyUpdate: (el, pos) => {
    el.style.transform = `scale(${pos}, ${pos})`;
    el.style.webkitTransform = `scale(${pos}, ${pos})`;
  }
});

// Animate font-size in em units from 1 to 50.
animator.animate(el, 'fontSize', 1, 50, {
  unit: 'em',
});

// Cancel animation

animator.cancel();

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