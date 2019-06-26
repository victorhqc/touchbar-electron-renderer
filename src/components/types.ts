import {
  TouchBarButton as NativeTouchBarButton,
  TouchBarColorPicker as NativeTouchBarColorPicker,
  TouchBarGroup as NativeTouchBarGroup,
  TouchBarLabel as NativeTouchBarLabel,
  TouchBarPopover as NativeTouchBarPopover,
  TouchBarScrubber as NativeTouchBarScrubber,
  TouchBarSegmentedControl as NativeTouchBarSegmentedControl,
  TouchBarSlider as NativeTouchBarSlider,
  TouchBarSpacer as NativeTouchBarSpacer,
  ScrubberItem,
  SegmentedControlSegment,
} from 'electron';

export interface TouchBarCompositeComponent {
  id: string;
}

export interface TouchBarTextComponent extends TouchBarCompositeComponent {
  replaceText(text: string): void;
}

export interface TouchBarComponent<T> extends TouchBarCompositeComponent {
  appendChild(child: TouchBarCompositeComponent): void;
  insertBefore(
    newChild: TouchBarCompositeComponent,
    beforeChild: TouchBarCompositeComponent,
  ): void;
  removeChild(child: TouchBarCompositeComponent): void;

  update(args: { newProps: ComponentProps }): boolean;
  createInstance(): Maybe<T>;
}

export type NativeTouchBarComponent = TouchBarComponent<NativeTouchBarItem>;
export type InternalTouchBarComponent = TouchBarComponent<InternalTouchBarItem>;

// export interface TouchBarNativeComponent
//   extends TouchBarComponent<NativeTouchBarValidItems> {}
// export interface TouchBarInternalComponent
//   extends TouchBarComponent<string | ScrubberItem | SegmentedControlSegment> {}

export type NativeTouchBarItem =
  | (NativeTouchBarButton)
  | (NativeTouchBarColorPicker)
  | (NativeTouchBarGroup)
  | (NativeTouchBarLabel)
  | (NativeTouchBarPopover)
  | (NativeTouchBarScrubber)
  | (NativeTouchBarSegmentedControl)
  | (NativeTouchBarSlider)
  | (NativeTouchBarSpacer);

export type InternalTouchBarItem =
  | string
  | ScrubberItem
  | SegmentedControlSegment;

export interface ComponentProps {
  [key: string]: any;
}
