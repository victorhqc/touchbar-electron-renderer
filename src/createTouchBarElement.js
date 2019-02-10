import {
  TouchBarButton,
  TouchBarColor,
  TouchBarColorPicker,
  TouchBarGroup,
  TouchBarLabel,
  TouchBarPopover,
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
    default:
      return null;
  }
}

export default createTouchBarElement;
