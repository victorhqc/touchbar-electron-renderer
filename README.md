# touchbar-electron-renderer
A React renderer for building declarative touchbar interfaces for Electron in Mac OSX.

![](https://github.com/victorhqc/touchbar-electron-renderer/workflows/Publish%20CI/badge.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

**This library is in alpha state, use at your own risk**

## Getting started

First install dependency
```sh
npm i touchbar-electron-renderer --save
```

Create a simple touchbar interface.

```js
import { app, BrowserWindow, TouchBar as NativeTouchBar } from 'electron';
import React, { Component, Fragment } from 'react';
import { ReactTouchBar, TouchBar } from 'touchbar-electron-renderer';

const getRandomValue = () => {
  const values = ['🍒', '💎', '7️⃣', '🍊', '🔔', '⭐', '🍇', '🍀']
  return values[Math.floor(Math.random() * values.length)]
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reel1: null,
      reel2: null,
      reel3: null,
      result: null,
      resultColor: null,
    }

    this.doSpin = this.doSpin.bind(this);
  }

  updateReels() {
    this.setState({
      reel1: getRandomValue(),
      reel2: getRandomValue(),
      reel3: getRandomValue(),
    });
  }

  finishSpin() {
    const { reel1, reel2, reel3 } = this.state;
    const uniqueValues = new Set([reel1, reel2, reel3]).size;

    if (uniqueValues === 1) {
      // All 3 values are the same
      this.setState({
        result: '💰 Jackpot!',
        resultColor: '#FDFF00',
      });
    } else if (uniqueValues === 2) {
      // 2 values are the same
      this.setState({
        result: '😍 Winner!',
        resultColor: '#FDFF00',
      });
    } else {
      // No values are the same
      this.setState({
        result: '🙁 Spin Again',
        resultColor: null,
      });
    }

    this.spinning = false;
  }

  doSpin() {
    if (this.spinning) {
      return;
    }

    this.spinning = true;
    this.setState({
      result: null,
    });

    let timeout = 10
    const spinLength = 4 * 1000 // 4 seconds
    const startTime = Date.now();

    const spinReels = () => {
      this.updateReels()

      if ((Date.now() - startTime) >= spinLength) {
        this.finishSpin();
      } else {
        // Slow down a bit on each spin
        timeout *= 1.1
        setTimeout(spinReels, timeout)
      }
    }

    spinReels()
  }

  render() {
    const { reel1, reel2, reel3, result, resultColor } = this.state;

    return (
      <Fragment>
        <button backgroundColor="#7851A9" onClick={this.doSpin}>
          🎰 Spin
        </button>
        <spacer large />
        <label>{reel1}</label>
        <spacer small />
        <label>{reel2}</label>
        <spacer small />
        <label>{reel3}</label>
        <spacer large />
        <label color={resultColor}>{result}</label>
      </Fragment>
    );
  }
}

function render() {
  ReactTouchBar.render(<App />, new TouchBar(window, NativeTouchBar));
}

let window;
app.once('ready', () => {
  window = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hiddenInset',
    width: 200,
    height: 200,
    backgroundColor: '#000'
  });

  window.loadURL('about:blank');

  render();
})
```

## API
For further reference about `TouchBar` classes, check [the official documentation](https://electronjs.org/docs/api/touch-bar).

### TouchBar
> Create TouchBar layouts for native macOS applications

Only the root element should be a `TouchBar`. The children of TouchBar should be contained in a
`Fragment` or `<>` element.

**Constructor arguments**
- **_window:_** The electron window.

Example
```js
const App = () => (
  <>
    <label>Hello world</label>
    <label>This is a touchbar</label>
  </>
)

ReactTouchBar.render(<App />, new TouchBar(window));
```

### TouchBarButton, `<button />`
> Create a button in the touch bar for native macOS applications

```js
<button onClick={someCallback} icon={someIcon}>This is a button</button>
```

**Props**
- **_children:_** String, `<button />` only accepts **text** as children. It'll be mapped to `label`.
- **_onClick:_** Function,  It'll be mapped to `click` in the native element.
- **_icon:_** [NativeImage](https://electronjs.org/docs/api/native-image), Button's Icon.
- **_iconPosition:_** String, Can be `left`, `right` or `overlay`.
- **_backgroundColor:_** String, background color.

_Note: Use only Hex colors._

For more information go [here](https://electronjs.org/docs/api/touch-bar-button).

### TouchBarColorPicker, `<color-picker />`
> Create a color picker in the touch bar for native macOS applications

```js
<color-picker onChange={chooseColor} selected="#f2a4af">
  <color>#f2a4af</color>
  <color>#d9b1b1</color>
  <color>#bb95a4</color>
  <color>#b3ad99</color>
  <color>#a3b9b7</color>
  <color>#b1b1b0</color>
</color-picker>
```

**Props**
- **_selected:_** String, selected color.
- **_children:_** Only `<color />` are valid children of `<color-picker`.
- **_onChange:_** Function, Called when user chooses color.
  - _color_: String, The chosen color.

#### `<color />`
Only valid as children of `<color-picker />`

```js
<color>#b1b1b0</color>
```

**Props**
- **_children:_** String, Hex color.

For more information go [here](https://electronjs.org/docs/api/touch-bar-color-picker).

### TouchBarGroup, `<group />`
> Create a group in the touch bar for native macOS applications

```js
<group>
  <label>Foo bar</label>
  <button>Hello World</button>
</group>
```

**Props**
- **_children:_** TouchBar elements.

For more information go [here](https://electronjs.org/docs/api/touch-bar-group).

### TouchBarLabel, `<label />`
> Create a label in the touch bar for native macOS applications

```js
<label color="#f2a4af">Hello world</label>
```

**Props**
- **_children:_** String, `<label />` only accepts **text** as children. It'll be mapped to `label`.
- **_color:_** String, Hex color for text. It'll be mapped to `textColor`.

For more information go [here](https://electronjs.org/docs/api/touch-bar-label).

### TouchBarPopover, `<popover />`
> Create a popover in the touch bar for native macOS applications

```js
<popover label="😀">
  <button>A button in a popover</button>
  <label>You can use any valid TouchBar element here.</label>
</popover>
```

**Props**
- **_label:_** String, Popover button text.
- **_icon:_** [NativeImage](https://electronjs.org/docs/api/native-image), Popover's Icon.
- **_children:_** Touchbar elements.
- **_hideCloseButton:_** Boolean, `true` to hide the close button of the popover. Default `false`. It'll be mapped & negated to `showCloseButton`. The reason for this is because is easier to read `<popover hideCloseButton />` than `<popover showCloseButton={false} />`.

For more information go [here](https://electronjs.org/docs/api/touch-bar-popover).

### TouchBarScrubber, `<scrubber />`
> Create a scrubber (a scrollable selector)

```js
<scrubber onHighlight={someCallback}>
  <scrub-item>😀</scrub-item>
  <scrub-item>😁</scrub-item>
  <scrub-item>😎</scrub-item>
</scrubber>
```

**Props**
- **_children:_** Only `<scrub-item />` elements are valid.
- **_onSelect:_** Function, Called when the user taps an item that was not the last tapped item. It'll be mapped to `select`.
  - _selectedIndex:_ Integer, The index of the item the user selected.
- **_onHighlight:_** Function, Called when the user taps any item. It'll be mapped to `highlight`.
  - _highlightedIndex_ Integer, The index of the item the user touched.
- **_debounceTime:_** Integer, used to debounce `onSelect` and `onHighlight`, default 250.
- **_selectedStyle:_** String, Represents the style that selected items in the scrubber should have. Possible values:
  - `background`, Maps to `[NSScrubberSelectionStyle roundedBackgroundStyle]`.
  - `outline`, Maps to `[NSScrubberSelectionStyle outlineOverlayStyle]`.
  - `null`, Actually null, not a string, removes all styles.
- **_overlayStyle:_** String, Represents the style that selected items in the scrubber should have. This style is overlayed on top of the scrubber item instead of being placed behind it. Possible values:
  - `background`, Maps to `[NSScrubberSelectionStyle roundedBackgroundStyle]`.
  - `outline`, Maps to `[NSScrubberSelectionStyle outlineOverlayStyle]`.
  - `null`, Actually null, not a string, removes all styles.
- **_showArrowButtons:_** Boolean, represents whether to show the left / right selection arrows in this scrubber.
- **_mode:_** String, represents the mode of this scrubber. Possible values:
  - `fixed`, Maps to `NSScrubberModeFixed`.
  - `free`, Maps to `NSScrubberModeFree`.
- **_continuous:_** Boolean, represents whether this scrubber is continuous or not.

#### `<scrub-item />`
Only valid as children of `<scrubber />`

```js
<scrub-item icon={someIcon}>Some text</scrub-item>
```

**Props**
- **_children:_** String, only text is valid.
- **_icon:_** [NativeImage](https://electronjs.org/docs/api/native-image).

For more information go [here](https://electronjs.org/docs/api/touch-bar-scrubber).

### TouchBarSegmentedControl, `<segmented-control />`
> Create a segmented control (a button group) where one button has a selected state

```js
<segmented-control style="rounded" onChange={someCallback}>
  <segment>Choose one button</segment>
  <segment>Or another</segment>
  <segment disabled>This segment is disabled</segment>
</segmented-control>
```

**Props**
- **_children:_** Only `<segment />` elements are valid.
- **_segmentStyle:_** String, valid styles are:
  - `automatic` - Default. The appearance of the segmented control is automatically determined based on the type of window in which the control is displayed and the position within the window.
  - `rounded` - The control is displayed using the rounded style.
  - `textured-rounded` - The control is displayed using the textured rounded style.
  - `round-rect` - The control is displayed using the round rect style.
  - `textured-square` - The control is displayed using the textured square style.
  - `capsule` - The control is displayed using the capsule style.
  - `small-square` - The control is displayed using the small square style.
  - `separated` - The segments in the control are displayed very close to each other but not touching.
- **_mode:_** String, Selection mode, valid modes are:
  - `single` - Default. One item selected at a time, selecting one deselects the previously selected item.
  - `multiple` - Multiple items can be selected at a time.
  - `buttons` - Make the segments act as buttons, each segment can be pressed and released but never marked as active.
- **_selected:_** Integer, The index of the currently selected segment, will update automatically with user interaction. When the mode is multiple it will be the last selected item. It'll be mapped to `selectedIndex`.
- **_onChange:_** Function, called when user chooses a segment.
  - _selectedIndex:_ Integer, The index of the segment the user selected.
  - _isSelected:_ Boolean, Whether as a result of user selection the segment is selected or not.

#### <segment />
Only valid as children of `<segmented-control />`.

```js
<segment icon={someIcon} disabled>Hello world</segment>
```

**Props**
- **_children:_** String, only text is valid.
- **_icon:_** [NativeImage](https://electronjs.org/docs/api/native-image).
- **_disabled:_** Boolean, if `true` then disable the segment. It'll be mapped and negated to `enabled`.

For more information go [here](https://electronjs.org/docs/api/touch-bar-segmented-control).

### TouchBarSlider, `<slider />`
> Create a slider in the touch bar for native macOS applications

```js
<slider value={50} minValue={0} maxValue={100} onChange={someCallback}>Choose value</slider>
```

**Props**
- **_children:_** String, only text is valid, it'll be mapped to `label`.
- **_value:_** Integer, selected value.
- **_minValue:_** Integer, Minimum value.
- **_maxValue:_** Integer, Maximum value.
- **_onChange:_** Function, called when the slider is changed. It'll be mapped to `change`.
  - _newValue:_ Number, The value that the user selected on the Slider.

### TouchBarSpacer, `<spacer />`
> Create a spacer between two items in the touch bar for native macOS applications

```js
<spacer large />
```

**Props**
- **_small:_** It'll be mapped to `size="small"`.
- **_large:_** It'll be mapped to `size="large"`.
- **_flexible:_** It'll be mapped to `size="flexible"`.

For more information go [here](https://electronjs.org/docs/api/touch-bar-spacer).

## Known issues
### Scrubber updates
When using `onHighlight`, it's called even when user is scrolling and didn't really chose a new element.

### Hooks
For some reason, `hooks` are not working properly. More investigation is needed.

### Renderer
Lots of improvements are still needed. At this point, the code is more an ugly hack than a real solution.

## Next steps
- [ ] Add tests.
- [ ] Write more complex examples.
- [ ] Fix bugs.
- [ ] Improve performance.
- [ ] Add support for esc key.
