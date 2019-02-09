import {
  TouchBarButton,
  TouchBarColor,
  TouchBarColorPicker,
} from './components';

function createTouchBarElement(type, props) {
  switch (type) {
    case 'button':
      return new TouchBarButton(props);
    case 'color':
      return new TouchBarColor(props);
    case 'color-picker':
      return new TouchBarColorPicker(props);
    default:
      return null;
  }
}

export default createTouchBarElement;
