import {
  TouchBarButton,
  TouchBarColor,
  TouchBarColorPicker,
  TouchBarLabel,
  TouchBarGroup,
} from './components';

function createTouchBarElement(type, props) {
  switch (type) {
    case 'button':
      return new TouchBarButton(props);
    case 'color':
      return new TouchBarColor(props);
    case 'color-picker':
      return new TouchBarColorPicker(props);
    case 'label':
      return new TouchBarLabel(props);
    case 'group':
      return new TouchBarGroup(props);
    default:
      return null;
  }
}

export default createTouchBarElement;
