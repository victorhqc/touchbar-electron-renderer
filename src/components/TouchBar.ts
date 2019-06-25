import { TouchBar as TouchBarType, BrowserWindow } from 'electron';

import { insertBeforeChild, removeChild, setNativeTouchBar, getNativeTouchBar } from '../utils';
import { TouchbarElement } from './types'

class TouchBar {
  children: TouchbarElement[];
  didChildrenChange: boolean;
  electronWindow: BrowserWindow;
  instance: TouchBarType;

  constructor(electronWindow: BrowserWindow, NativeTouchBar: TouchBarType) {
    this.children = [];
    this.didChildrenChange = false;
    this.electronWindow = electronWindow;
    this.instance = null;
    setNativeTouchBar(NativeTouchBar);
  }

  appendChild(child: TouchbarElement) {
    if (!child) {
      return;
    }

    this.children.push(child);
    this.didChildrenChange = true;
  }

  insertBefore(newChild: TouchbarElement, beforeChild: TouchbarElement) {
    this.children = insertBeforeChild({
      children: this.children,
      newChild,
      beforeChild,
    });
    this.didChildrenChange = true;
  }

  removeChild(child: TouchbarElement) {
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
    this.children.map(child => child.createInstance());
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

  refreshTree(isReRenderNeeded: boolean) {
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
