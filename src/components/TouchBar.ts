import { BrowserWindow, TouchBar as NativeTouchBar } from 'electron';

import {
  insertBeforeChild,
  removeChild,
  setNativeTouchBar,
  getNativeTouchBar,
  isTruthy,
  TouchBarType,
} from '../utils';
import { ValidTouchBarElement } from './types';

class TouchBar {
  private children: ValidTouchBarElement[];
  private didChildrenChange: boolean;
  private electronWindow: BrowserWindow;
  private instance: Maybe<NativeTouchBar>;

  private constructor(
    electronWindow: BrowserWindow,
    NativeTouchBar: TouchBarType,
  ) {
    this.children = [];
    this.didChildrenChange = false;
    this.electronWindow = electronWindow;
    this.instance = null;
    setNativeTouchBar(NativeTouchBar);
  }

  public appendChild(child: ValidTouchBarElement) {
    if (!child) {
      return;
    }

    this.children.push(child);
    this.didChildrenChange = true;
  }

  public insertBefore(
    newChild: ValidTouchBarElement,
    beforeChild: ValidTouchBarElement,
  ) {
    this.children = insertBeforeChild({
      children: this.children,
      newChild,
      beforeChild,
    });
    this.didChildrenChange = true;
  }

  public removeChild(child: ValidTouchBarElement) {
    this.children = removeChild({
      children: this.children,
      child,
    });
    this.didChildrenChange = true;
  }

  public createInitialInstance() {
    const nativeChildren = this.children
      .map(child => child.createInstance())
      .filter(isTruthy);

    const args = {
      items: nativeChildren,
    };

    const NativeTouchBar = getNativeTouchBar();
    if (!NativeTouchBar) return null;

    this.instance = new NativeTouchBar(args);
    if (!this.instance) return null;

    this.electronWindow.setTouchBar(this.instance);

    this.didChildrenChange = false;
    return this.instance;
  }

  // TODO: Delete me.
  public updateInstance() {
    this.children.map(child => child.createInstance());
    this.didChildrenChange = false;
    return this.instance;
  }

  // TODO: Delete me.
  public createInstance() {
    if (!this.instance || this.didChildrenChange) {
      return this.createInitialInstance();
    }

    return this.updateInstance();
  }

  public refreshTree(isReRenderNeeded: boolean) {
    // Only create new touchbar when
    // - toucbbar is new.
    // - new nodes were added.
    // - node down in tree asks for a hard re-render.
    if (!this.instance || this.didChildrenChange || isReRenderNeeded) {
      return this.createInitialInstance();
    }

    return null;
  }
}

export default TouchBar;
