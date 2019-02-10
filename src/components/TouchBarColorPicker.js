// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import uuidv4 from 'uuid/v4';

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
    this.prevProps = {};
    this.id = uuidv4();

    this.children = [];
    this.instance = null;
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
    this.prevProps = Object.assign({}, this.props);
    this.props = newProps;
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
    if (this.props === this.prevProps) {
      console.log('NOTHING CHANGED HERE', this.prototype.name, this);
      return;
    }

    if (!this.instance) {
      return this.createInitialInstance();
    }

    return this.updateInstance();
  }
}

export default TouchBarColorPicker;
