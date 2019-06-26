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

// import TouchBarText from './TouchBarText';
// import TouchBarButton from './TouchBarButton';
// import TouchBarColor from './TouchBarColor';
// import TouchBarColorPicker from './TouchBarColorPicker';
// import TouchBarLabel from './TouchBarLabel';
// import TouchBarScrubber from './TouchBarScrubber';
// import TouchBarScrubItem from './TouchBarScrubItem';
// import TouchBarSegment from './TouchBarSegment';

export interface WithId {
  id: string;
}

export interface TouchBarTextInterface extends WithId {
  replaceText(text: string): void;
}

export interface ValidTouchBarElement extends WithId {
  appendChild(child: WithId): void;
  insertBefore(newChild: WithId, beforeChild: WithId): void;
  removeChild(child: WithId): void;

  createInstance(): Maybe<TouchBarValidItems>;
}

export interface TouchbarElement<T> extends ValidTouchBarElement {
  update(args: { newProps: T }): boolean;
}

export interface TouchBarInternalElement<T> extends WithId {
  appendChild(child: WithId): void;
  insertBefore(newChild: WithId, beforeChild: WithId): void;
  removeChild(child: WithId): void;

  update(args: { newProps: T }): boolean;
  createInstance(): Maybe<string | ScrubberItem | SegmentedControlSegment>;
}

export type TouchBarValidItems =
  | (NativeTouchBarButton)
  | (NativeTouchBarColorPicker)
  | (NativeTouchBarGroup)
  | (NativeTouchBarLabel)
  | (NativeTouchBarPopover)
  | (NativeTouchBarScrubber)
  | (NativeTouchBarSegmentedControl)
  | (NativeTouchBarSlider)
  | (NativeTouchBarSpacer);

// export type validChildren =
//   | (TouchBarText)
//   | (TouchBarButton)
//   | (TouchBarColor)
//   | (TouchBarColorPicker)
//   | (TouchBarLabel)
//   | (TouchBarScrubber)
//   | (TouchBarScrubItem)
//   | (TouchBarSegment);
