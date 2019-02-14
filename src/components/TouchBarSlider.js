// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import uuidv4 from 'uuid/v4';

import difference from 'lodash/difference';
import some from 'lodash/some';

import { buildChild } from '../utils';


// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

class TouchBarSlider {
  constructor(props) {
    this.props = props;
    this.id = uuidv4();

    // TouchBarSlider can have only one child.
    this.child = null;
    this.instance = null;
  }

  /**
   * TouchBarSlider can only have text children.
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
    const { children, onChange, icon, ...props } = this.props;

    return {
      ...props,
      label: buildChild(this.child),
      change: onChange,
    };
  }

  createInitialInstance() {
    const args = this.getNativeArgs();

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    if (NativeTouchBar) {
      this.instance = new NativeTouchBar.TouchBarSlider(args);
    } else {
      this.instance = new RemoteTouchBar.TouchBarSlider(args);
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

export default TouchBarSlider;
