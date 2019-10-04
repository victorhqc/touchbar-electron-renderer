'use strict';

const electron = jest.genMockFromModule('electron');

// const electron = require('electron');

// const { TouchBar } = electron;

class BrowserWindow {
  public setTouchBar: jest.Mock<any, any> | undefined;
}

BrowserWindow.prototype.setTouchBar = jest.fn();

class TouchBarButton {
  public backgroundColor: string | undefined;
  public icon: any;
}
class TouchBarColorPicker {}
class TouchBarGroup {}
class TouchBarLabel {}
class TouchBarPopover {}
class TouchBarScrubber {}
class TouchBarSegmentedControl {}
class TouchBarSlider {}
class TouchBarSpacer {}

class TouchBar {
  public static TouchBarButton: typeof TouchBarButton;
  public static TouchBarColorPicker: typeof TouchBarColorPicker;
  public static TouchBarGroup: typeof TouchBarGroup;
  public static TouchBarLabel: typeof TouchBarLabel;
  public static TouchBarPopover: typeof TouchBarPopover;
  public static TouchBarScrubber: typeof TouchBarScrubber;
  public static TouchBarSegmentedControl: typeof TouchBarSegmentedControl;
  public static TouchBarSlider: typeof TouchBarSlider;
  public static TouchBarSpacer: typeof TouchBarSpacer;
}

TouchBar.TouchBarButton = TouchBarButton;
TouchBar.TouchBarColorPicker = TouchBarColorPicker;
TouchBar.TouchBarGroup = TouchBarGroup;
TouchBar.TouchBarLabel = TouchBarLabel;
TouchBar.TouchBarPopover = TouchBarPopover;
TouchBar.TouchBarScrubber = TouchBarScrubber;
TouchBar.TouchBarSegmentedControl = TouchBarSegmentedControl;
TouchBar.TouchBarSlider = TouchBarSlider;
TouchBar.TouchBarSpacer = TouchBarSpacer;

// // @ts-ignore
// electron.TouchBar = TouchBar;

module.exports = {
  ...electron,
  BrowserWindow,
  TouchBar,
};
