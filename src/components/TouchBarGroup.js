// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';

import { insertBeforeChild, removeChild } from '../utils';

// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

class TouchBarGroup {
  constructor(electronWindow) {
    this.children = [];
    this.didChildrenChange = false;
    this.electronWindow = electronWindow;
    this.instance = null;
  }

  update() {
    return this.updateInstance()
  }

  appendChild(child) {
    if (!child) {
      return;
    }

    this.didChildrenChange = true;
    this.children.push(child);
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

  updateInstance() {
    let isRerenderNeeded = false;
    if (this.didChildrenChange) {
      this.children.map(child => child.createInstance());
      isRerenderNeeded = true;
    }

    this.didChildrenChange = false;

    return isRerenderNeeded;
  }

  createInstance() {
    const nativeChildren = this.children.map(child => child.createInstance());
    const args = {
      items: nativeChildren,
    };

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    this.instance = NativeTouchBar ?
      new NativeTouchBar.TouchBarGroup(args)
      : new RemoteTouchBar.TouchBarGroup(args);

    this.didChildrenChange = false;
    return this.instance;
  }
}

export default TouchBarGroup;
