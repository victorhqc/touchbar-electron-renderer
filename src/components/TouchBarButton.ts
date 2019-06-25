import uuidv4 from 'uuid/v4';

import difference from 'lodash/difference';
import some from 'lodash/some';

import { MOUSE_EVENTS } from '../constants';
import { buildChild, isValidIcon, getNativeTouchBar } from '../utils';

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
    this.setProps(props);
    this.id = uuidv4();

    // TouchBarButton can have only one child.
    this.child = null;
    this.instance = null;
  }

  setProps(props) {
    this.props = props;
  }

  /**
   * TouchBarButton can only have text children.
   * @param  {stting} child
   * @return {void}
   */
  appendChild(child) {
    this.child = child;
  }

  insertBefore(child) {
    return this.appendChild(child);
  }

  removeChild() {
    this.child = null;
  }

  update({ newProps }) {
    this.setProps(newProps);
    this.updateInstance();

    // No Rerender needed when button props update.
    return false;
  }

  getNativeArgs() {
    const { children, onClick, icon, ...props } = this.props;

    warnAboutUserInteractions({
      acceptedEvents: ['onClick'],
      type: 'button',
      props,
    });

    return {
      ...props,
      label: this.child && buildChild(this.child),
      icon: icon && isValidIcon(icon) ? icon : null,
      click: onClick,
    };
  }

  updateInstance() {
    const args = this.getNativeArgs();

    // Update instance.
    Object.keys(args).forEach((key) => {
      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });
  }

  createInstance() {
    const args = this.getNativeArgs();

    const NativeTouchBar = getNativeTouchBar();
    this.instance = new NativeTouchBar.TouchBarButton(args);
    return this.instance;
  }
}

export default TouchBarButton;
