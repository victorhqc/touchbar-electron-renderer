import { TouchBar } from 'electron';
const { TouchBarButton: NativeTouchBarButton } = TouchBar;

function warnAboutUserInteractions({ type, props, acceptedEvents }) {
  const notValidEvents = difference(MOUSE_EVENTS, acceptedEvents);

  some(props, (prop) => {
    if (notValidEvents.indexOf(prop) >= 0) {
      console.warn(`${element} does not support event: ${prop}`);
      return true;
    }

    return false;
  });
}

class TouchBarButton {
  constructor(props) {
    this.props = props;

    // TouchBarButton can have only one child.
    this.child = null;
  }

  /**
   * TouchBarButton can only have text children.
   * @param  {stting} child
   * @return {void}
   */
  appendChild(child) {
    if (typeof child !== 'string') {
      console.warn(`TouchBarButton can only have string children but received: ${typeof child}`);
      return;
    }

    this.child = child;
  }

  removeChild() {
    this.child = null;
  }

  createInstance({ children, onClick, ...props}) {
    warnAboutUserInteractions({
      acceptedEvents: ['onClick'],
      type: 'button',
      props,
    });

    return new NativeTouchBarButton({
      ...props,
      label: this.child,
      click: onClick,
    });
  }
}

export default TouchBarButton;
