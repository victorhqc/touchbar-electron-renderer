// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import flatten from 'lodash/flatten';

// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

class TouchBar {
  constructor(electronWindow) {
    this.children = [];
    this.electronWindow = electronWindow;
  }

  appendChild(child) {
    if (!child) {
      return;
    }

    this.children.push(child);
  }

  insertBefore(child, beforeChild) {
    const orderedChildren = this.children.reduce((prev, currentChild) => {
      if (beforeChild === currentChild) {
        return [child, beforeChild];
      }

      return prev;
    }, []);

    this.children = flatten(orderedChildren);
  }

  removeChild(child) {
    this.children = this.children
      .filter(childElement => childElement !== child);
  }

  createInstance() {
    console.log('CHILDREN', this.children);

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    const touchBar = NativeTouchBar ?
      new NativeTouchBar(this.children)
      : new RemoteTouchBar(this.children);

    this.electronWindow.setTouchBar(touchBar);

    return touchBar;
  }
}

export default TouchBar;
