/// <reference types="jest" />
declare const electron: unknown;
declare class BrowserWindow {
    setTouchBar: jest.Mock<any, any> | undefined;
}
declare class TouchBarButton {
    backgroundColor: string | undefined;
    icon: any;
}
declare class TouchBarColorPicker {
}
declare class TouchBarGroup {
}
declare class TouchBarLabel {
}
declare class TouchBarPopover {
}
declare class TouchBarScrubber {
}
declare class TouchBarSegmentedControl {
}
declare class TouchBarSlider {
}
declare class TouchBarSpacer {
}
declare class TouchBar {
    static TouchBarButton: typeof TouchBarButton;
    static TouchBarColorPicker: typeof TouchBarColorPicker;
    static TouchBarGroup: typeof TouchBarGroup;
    static TouchBarLabel: typeof TouchBarLabel;
    static TouchBarPopover: typeof TouchBarPopover;
    static TouchBarScrubber: typeof TouchBarScrubber;
    static TouchBarSegmentedControl: typeof TouchBarSegmentedControl;
    static TouchBarSlider: typeof TouchBarSlider;
    static TouchBarSpacer: typeof TouchBarSpacer;
}
