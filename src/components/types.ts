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

export interface WithId {
  id: string;
}

export interface TouchBarTextInterface extends WithId {
  replaceText(text: string): void;
}

export interface TouchBarComponent extends WithId {
  appendChild(child: WithId): void;
  insertBefore(newChild: WithId, beforeChild: WithId): void;
  removeChild(child: WithId): void;

  createInstance(): Maybe<NativeTouchBarValidItems>;
}

export interface TouchbarElement<T> extends TouchBarComponent {
  update(args: { newProps: T }): boolean;
}

export interface TouchBarInternalElement<T> extends WithId {
  appendChild(child: WithId): void;
  insertBefore(newChild: WithId, beforeChild: WithId): void;
  removeChild(child: WithId): void;

  update(args: { newProps: T }): boolean;
  createInstance(): Maybe<string | ScrubberItem | SegmentedControlSegment>;
}

export type NativeTouchBarValidItems =
  | (NativeTouchBarButton)
  | (NativeTouchBarColorPicker)
  | (NativeTouchBarGroup)
  | (NativeTouchBarLabel)
  | (NativeTouchBarPopover)
  | (NativeTouchBarScrubber)
  | (NativeTouchBarSegmentedControl)
  | (NativeTouchBarSlider)
  | (NativeTouchBarSpacer);
