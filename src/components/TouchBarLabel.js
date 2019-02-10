// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import uuidv4 from 'uuid/v4';

import { buildChild } from '../utils';


// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

class TouchBarLabel {
  constructor(props) {
    this.props = props;
    this.id = uuidv4();

    // TouchBarLabel can have only one child.
    this.child = null;
    this.instance = null;
  }

  /**
   * TouchBarLabel can only have text children.
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
    const { children, color, ...props } = this.props;

    return {
      ...props,
      textColor: color,
      label: buildChild(this.child),
    };
  }

  createInitialInstance() {
    const args = this.getNativeArgs();

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    if (NativeTouchBar) {
      this.instance = new NativeTouchBar.TouchBarLabel(args);
    } else {
      this.instance = new RemoteTouchBar.TouchBarLabel(args);
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

export default TouchBarLabel;
