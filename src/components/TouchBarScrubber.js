// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';

import { insertBeforeChild, removeChild } from '../utils';

// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

class TouchBarScrubber {
  constructor(props) {
    this.children = [];
    this.childrenSinceLastRender = 0;
    this.props = props;
    this.prevProps = {};
    this.instance = null;
  }

  updateProps(newProps) {
    this.prevProps = Object.assign({}, this.props);
    this.props = newProps;
  }

  appendChild(child) {
    if (!child) {
      return;
    }

    this.children.push(child);
  }

  insertBefore(newChild, beforeChild) {
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

  getNativeArgs() {
    const { children, onChange, onClick, ...props } = this.props;

    return {
      ...props,
      select: onChange,
      highlight: onClick,
      items: this.children.map(child => child.createInstance()),
    };
  }

  createInitialInstance() {
    this.childrenSinceLastRender = this.children.length;
    const args = this.getNativeArgs();

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    this.instance = NativeTouchBar ?
      new NativeTouchBar.TouchBarScrubber(args)
      : new RemoteTouchBar.TouchBarScrubber(args);

    return this.instance;
  }

  updateInstance() {
    this.childrenSinceLastRender = this.children.length;

    const args = this.getNativeArgs();

    // Update instance.
    Object.keys(args).forEach((key) => {
      if (key === 'items') { return; }

      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    const updatedChildren = this.children.map(child => child.createInstance());

    return this.instance;
  }

  createInstance() {
    if (this.props === this.prevProps) {
      console.log('NOTHING CHANGED HERE', this.prototype.name, this);
      return;
    }

    if (
      !this.instance
      || this.childrenSinceLastRender !== this.children.length
    ) {
      return this.createInitialInstance();
    }

    return this.updateInstance();
  }
}

export default TouchBarScrubber;
