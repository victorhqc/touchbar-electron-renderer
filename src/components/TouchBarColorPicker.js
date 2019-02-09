// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import difference from 'lodash/difference';
import some from 'lodash/some';

import { insertBeforeChild, removeChild, buildChild } from '../utils';
import TouchBarColor from './TouchBarColor';

// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

function isValidChild(child) {
  if (!child) { return false; }
  if ( !child instanceof TouchBarColor && typeof child !== 'string') {
    console.warn('<touch-bar /> Can only have <color /> or text as children.');
    return false;
  }

  return true;
}

class TouchBarColorPicker {
  constructor(props) {
    this.props = props;

    this.children = [];
  }

  /**
   * TouchBarColorPicker can only have text children.
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

  updateProps(newProps) {
    this.props = newProps;
  }

  createInstance() {
    const { children, onChange, colors, ...props } = this.props;
    console.log('CHILDREN IN TouchBarColorPicker', children);

    const args = {
      ...props,
      change: onChange,
      availableColors: colors || children.map(child => buildChild(child)),
    };

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    if (NativeTouchBar) {
      return new NativeTouchBar.TouchBarColorPicker(args);
    }

    return new RemoteTouchBar.TouchBarColorPicker(args);
  }
}

export default TouchBarColorPicker;
