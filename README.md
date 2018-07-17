# dom-animate-property
Smoothly animates any property on a DOM HTMLElement. Bezier curve support & pre-defined easing functions.

Animations respect the actual clock, so no matter the frame rate, the animation will still properly last the appropriate amount of time.

Animations are performed using `window.requestAnimationFrame`.

## Installation

```bash
npm i dom-animate-property
```

## Example Usage

```javascript
let DOMAnimateProperty = require('dom-animate-property'); //or you can use import, too

let el = document.querySelector('.myElement');

//animate height from 0 to 200
DOMAnimateProperty.animate({
  el: el,
  property: 'height',
  start: 0,
  end: 200
});

// Animate height from 0 to 200, with a duration of 200ms, a custom cubic-bezier easing function, and callback
DOMAnimateProperty.animate({
  el: el,
  property: 'height',
  start: 0,
  end: 200,
  options: {
    duration: 200,
    easing: [0.42, 0.0, 0.58, 1.0],
    onDone: () => alert('done!')
  }
});

// Animate width from 0 to 100 and pre-defined easing function
DOMAnimateProperty.animate({
  el: el,
  property: 'width',
  start: 0,
  end: 100,
  options: {
    easing: DOMAnimateProperty.EASE_OUT
  }
});

```

## API

### `animate({HTMLElement} el, {string} property, {number} start, {number} end, {object=} options)`

Animates `property` of a given element.

#### `{HTMLElement} el`

The element to animate.

#### `{int} start`

The start value of the property.

#### `{int} end`

The end value of the property.

#### `{object=} options`

An optional map of parameters:

###### `{string} unit`

Unit of value. (Default: `"px"`)

###### `{integer} duration`

Animation duration in milliseconds. (Default: `400`)

###### `{array} easing`

An array to pass to the cubic-bezier easing function. (Default: `DOMAnimateProperty.EASE_IN_OUT`)

###### `{function} onDone`

A callback function that is called when the animation is finished.

## Constants

### Bezier Curve Easing Functions

`EASE`, `EASE_IN`, `EASE_OUT`, `EASE_IN_OUT`, `LINEAR`

## License

[MIT](https://github.com/mhweiner/mr-router/blob/master/LICENSE). Free to use in all your things!

## Contribution

DO IT! PR's welcome. Need to add testing, linting, and support for `scrollX`, or both x/y at the same time.