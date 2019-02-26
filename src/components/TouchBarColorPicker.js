// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import { insertBeforeChild, removeChild, buildChild } from '../utils';
import TouchBarColor from './TouchBarColor';

// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

function isValidChild(child) {
  if (!child) { return false; }
  if ( !child instanceof TouchBarColor && typeof child !== 'string') {
    console.warn('<color-picker /> Can only have <color /> or text as children.');
    return false;
  }

  return true;
}

class TouchBarColorPicker {
  constructor(props) {
    this.setProps(props);
    this.id = uuidv4();

    this.children = [];
    this.instance = null;
  }

  setProps(props) {
    // this.prevProps = Object.assign({}, this.props);
    this.props = props;
  }

  /**
   * TouchBarColorPicker can only have <color /> children.
   * @param  {stting} child
   * @return {void}
   */
  appendChild(child) {
    if (!isValidChild(child)) {
      return;
    }

    this.children.push(child);
  }

  insertBefore(newChild, beforeChild) {
    if (!isValidChild(child)) {
      return;
    }

    this.children = insertBeforeChild({
      children: this.children,
      newChild,
      beforeChild,
    });
  }

  removeChild(child) {
    this.children = removeChild({
      children: this.children,
      child,
    });
  }

  update({ newProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.setProps(newProps);
    this.updateInstance();
  }

  getNativeArgs() {
    const { children, onChange, colors, selected, ...props } = this.props;

    return {
      ...props,
      change: onChange,
      selectedColor: selected,
      availableColors: colors || this.children.map(child => buildChild(child)),
    };
  }

  createInitialInstance() {
    const args = this.getNativeArgs();

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    if (NativeTouchBar) {
      this.instance = new NativeTouchBar.TouchBarColorPicker(args);
    } else {
      this.instance = new RemoteTouchBar.TouchBarColorPicker(args);
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
    const args = this.getNativeArgs();

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    if (NativeTouchBar) {
      this.instance = new NativeTouchBar.TouchBarColorPicker(args);
    } else {
      this.instance = new RemoteTouchBar.TouchBarColorPicker(args);
    }

    return this.instance;
  }
}

export default TouchBarColorPicker;
