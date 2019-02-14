// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';

import { insertBeforeChild, removeChild } from '../utils';

// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

class TouchBar {
  constructor(electronWindow) {
    this.children = [];
    this.childrenSinceLastRender = 0;
    this.electronWindow = electronWindow;
    this.instance = null;
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

  createInitialInstance() {
    this.childrenSinceLastRender = this.children.length;
    const nativeChildren = this.children.map(child => child.createInstance());
    const args = {
      items: nativeChildren,
    };

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    const touchBar = NativeTouchBar ?
      new NativeTouchBar(args)
      : new RemoteTouchBar(args);

    this.instance = touchBar;
    this.electronWindow.setTouchBar(touchBar);

    return this.instance;
  }

  updateInstance() {
    this.childrenSinceLastRender = this.children.length;
    const updatedChildren = this.children.map(child => child.createInstance());

    return this.instance;
  }

  createInstance() {
    if (
      !this.instance
      || this.childrenSinceLastRender !== this.children.length
    ) {
      return this.createInitialInstance();
    }

    return this.updateInstance();
  }
}

export default TouchBar;
