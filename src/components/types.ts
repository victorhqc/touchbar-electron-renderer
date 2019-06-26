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
} from 'electron';

import TouchBarText from './TouchBarText';
import TouchBarButton from './TouchBarButton';
import TouchBarColor from './TouchBarColor';
import TouchBarColorPicker from './TouchBarColorPicker';
import TouchBarLabel from './TouchBarLabel';
import TouchBarScrubber from './TouchBarScrubber';
import TouchBarScrubItem from './TouchBarScrubItem';
import TouchBarSegment from './TouchBarSegment';

export interface WithId {
  id: string;
}

export interface TouchBarTextInterface extends WithId {
  replaceText(text: string): void;
}

export interface TouchbarElement<T> extends WithId {
  appendChild(child: validChildren): void;
  insertBefore(newChild: validChildren, beforeChild: validChildren): void;
  removeChild(child: validChildren): void;

  update(args: { newProps: T }): boolean;
  createInstance(): Maybe<TouchBarValidItems | string | ScrubberItem>;
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

export type validChildren =
  | (TouchBarText)
  | (TouchBarButton)
  | (TouchBarColor)
  | (TouchBarColorPicker)
  | (TouchBarLabel)
  | (TouchBarScrubber)
  | (TouchBarScrubItem)
  | (TouchBarSegment);
