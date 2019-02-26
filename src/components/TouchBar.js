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
    this.didChildrenChange = false;
    this.electronWindow = electronWindow;
    this.instance = null;
  }

  appendChild(child) {
    if (!child) {
      return;
    }

    this.children.push(child);
    this.didChildrenChange = true;
  }

  insertBefore(newChild, beforeChild) {
    this.children = insertBeforeChild({
      children: this.children,
      newChild,
      beforeChild,
    });
    this.didChildrenChange = true;
  }

  removeChild(child) {
    this.children = removeChild({
      children: this.children,
      child,
    });
    this.didChildrenChange = true;
  }

  createInitialInstance() {
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

    this.didChildrenChange = false;
    return this.instance;
  }

  // TODO: Delete me.
  updateInstance() {
    const updatedChildren = this.children.map(child => child.createInstance());
    this.didChildrenChange = false;
    return this.instance;
  }

  // TODO: Delete me.
  createInstance() {
    if (!this.instance || this.didChildrenChange) {
      return this.createInitialInstance();
    }

    return this.updateInstance();
  }

  refreshTree(isReRenderNeeded) {
    // Only create new touchbar when
    // - toucbbar is new.
    // - new nodes were added.
    // - node down in tree asks for a hard re-render.
    if (!this.instance || this.didChildrenChange || isReRenderNeeded) {
      return this.createInitialInstance();
    }
  }
}

export default TouchBar;
