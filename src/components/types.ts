import {
  TouchBarButton,
  TouchBarColorPicker,
  TouchBarGroup,
  TouchBarLabel,
  TouchBarPopover,
  TouchBarScrubber,
  TouchBarSegmentedControl,
  TouchBarSlider,
  TouchBarSpacer,
} from 'electron';

export interface TouchbarElement {
  id: string;

  appendChild(): void;
  insertBefore(): void;
  removeChild(): void;

  updateInstance(): boolean;
  createInstance(): Maybe<TouchBarValidItems>;
}

export type TouchBarValidItems =
  | (TouchBarButton)
  | (TouchBarColorPicker)
  | (TouchBarGroup)
  | (TouchBarLabel)
  | (TouchBarPopover)
  | (TouchBarScrubber)
  | (TouchBarSegmentedControl)
  | (TouchBarSlider)
  | (TouchBarSpacer);
