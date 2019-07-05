import {
  TouchBarButton,
  TouchBarColor,
  TouchBarColorPicker,
  TouchBarGroup,
  TouchBarLabel,
  TouchBarPopover,
  TouchBarScrubber,
  TouchBarScrubItem,
  TouchBarSegment,
  TouchBarSegmentedControl,
  TouchBarSlider,
  TouchBarSpacer,
  ComponentProps,
  AnyTouchBarComponent,
  TouchBarType,
} from './components';
import { Maybe } from './utils';

function createTouchBarElement(
  type: TouchBarType,
  props: ComponentProps,
): Maybe<AnyTouchBarComponent> {
  switch (type) {
    case 'button':
    case 'touchbar-button':
      return new TouchBarButton(props);
    case 'color':
    case 'touchbar-color':
      return new TouchBarColor(props);
    case 'color-picker':
    case 'touchbar-color-picker':
      return new TouchBarColorPicker(props);
    case 'group':
    case 'touchbar-group':
      return new TouchBarGroup();
    case 'label':
    case 'touchbar-label':
      return new TouchBarLabel(props);
    case 'popover':
    case 'touchbar-popover':
      return new TouchBarPopover(props);
    case 'scrubber':
    case 'touchbar-scrubber':
      return new TouchBarScrubber(props);
    case 'scrub-item':
    case 'touchbar-scrub-item':
      return new TouchBarScrubItem(props);
    case 'segment':
    case 'touchbar-segment':
      return new TouchBarSegment(props);
    case 'segmented-control':
    case 'touchbar-segmented-control':
      return new TouchBarSegmentedControl(props);
    case 'slider':
    case 'touchbar-slider':
      return new TouchBarSlider(props);
    case 'spacer':
    case 'touchbar-spacer':
      return new TouchBarSpacer(props);
    default:
      return null;
  }
}

export default createTouchBarElement;
