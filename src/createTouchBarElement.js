import {
  TouchBarButton,
  TouchBarColor,
  TouchBarColorPicker,
  TouchBarGroup,
  TouchBarLabel,
  TouchBarPopover,
  TouchBarScrubber,
} from './components';

function createTouchBarElement(type, props) {
  switch (type) {
    case 'button':
      return new TouchBarButton(props);
    case 'color':
      return new TouchBarColor(props);
    case 'color-picker':
      return new TouchBarColorPicker(props);
    case 'group':
      return new TouchBarGroup(props);
    case 'label':
      return new TouchBarLabel(props);
    case 'popover':
      return new TouchBarPopover(props);
    case 'scrubber':
      return new TouchBarScrubber(props);
    default:
      return null;
  }
}

export default createTouchBarElement;
