import electron from 'electron';

import { insertBeforeChild, removeChild, setNativeTouchBar, getNativeTouchBar } from '../utils';

class TouchBar {
  constructor(electronWindow, NativeTouchBar) {
    this.children = [];
    this.didChildrenChange = false;
    this.electronWindow = electronWindow;
    this.instance = null;
    setNativeTouchBar(NativeTouchBar);
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

    const NativeTouchBar = getNativeTouchBar();
    this.instance = new NativeTouchBar(args);
    this.electronWindow.setTouchBar(this.instance);

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
