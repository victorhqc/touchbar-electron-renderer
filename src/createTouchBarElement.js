import { TouchBarButton } from './components';

function createTouchBarElement(type, props) {
  switch (type) {
    case 'button':
      return new TouchBarButton(props);
    default:
      return null;
  }
}

export default createTouchBarElement;
