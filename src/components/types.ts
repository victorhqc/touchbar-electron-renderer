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
import { Maybe } from '../utils';

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

  update(args: {
    newProps: ComponentProps;
    oldProps: ComponentProps;
    type: TouchBarType;
  }): boolean;
  createInstance(): Maybe<T>;
}

export type NativeTouchBarComponent = TouchBarComponent<NativeTouchBarItem>;
export type InternalTouchBarComponent = TouchBarComponent<InternalTouchBarItem>;
export type AnyTouchBarComponent = TouchBarComponent<
  NativeTouchBarItem | InternalTouchBarItem
>;

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
  readonly [key: string]: any;
}

// TODO: Figure out how to live happily with Typescript JSX.IntrinsicElements.
export type TouchBarType =
  | 'button'
  | 'touchbar-button'
  | 'color'
  | 'touchbar-color'
  | 'color-picker'
  | 'touchbar-color-picker'
  | 'group'
  | 'touchbar-group'
  | 'label'
  | 'touchbar-label'
  | 'popover'
  | 'touchbar-popover'
  | 'scrubber'
  | 'touchbar-scrubber'
  | 'scrub-item'
  | 'touchbar-scrub-item'
  | 'segment'
  | 'touchbar-segment'
  | 'segmented-control'
  | 'touchbar-segmented-control'
  | 'slider'
  | 'touchbar-slider'
  | 'spacer'
  | 'touchbar-spacer';
