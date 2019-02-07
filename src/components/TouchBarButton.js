// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';

import difference from 'lodash/difference';
import some from 'lodash/some';

import { MOUSE_EVENTS } from '../constants';


// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

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

  createInstance() {
    const { children, onClick, ...props} = this.props;

    warnAboutUserInteractions({
      acceptedEvents: ['onClick'],
      type: 'button',
      props,
    });

    const args = {
      ...props,
      label: this.child,
      click: onClick,
    };

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    if (NativeTouchBar) {
      return new NativeTouchBar.TouchBarButton(args);
    }

    return new RemoteTouchBar.TouchBarButton(args);
  }
}

export default TouchBarButton;
