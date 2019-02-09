// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import uuidv4 from 'uuid/v4';

import difference from 'lodash/difference';
import some from 'lodash/some';

import { MOUSE_EVENTS } from '../constants';
import { buildChild } from '../utils';


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
    this.id = uuidv4();

    // TouchBarButton can have only one child.
    this.child = null;
    this.instance = null;
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

  updateProps(newProps) {
    this.props = newProps;
  }

  getNativeArgs() {
    const { children, onClick, ...props } = this.props;

    warnAboutUserInteractions({
      acceptedEvents: ['onClick'],
      type: 'button',
      props,
    });

    return {
      ...props,
      label: buildChild(this.child),
      click: onClick,
    };
  }

  createInitialInstance() {
    const args = this.getNativeArgs();

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    if (NativeTouchBar) {
      this.instance = new NativeTouchBar.TouchBarButton(args);
    } else {
      this.instance = new RemoteTouchBar.TouchBarButton(args);
    }

    return this.instance;
  }

  updateInstance() {
    const args = this.getNativeArgs();

    // Update instance.
    Object.keys(args).forEach((key) => {
      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    return this.instance;
  }

  createInstance() {
    if (!this.instance) {
      return this.createInitialInstance();
    }

    return this.updateInstance();
  }
}

export default TouchBarButton;
