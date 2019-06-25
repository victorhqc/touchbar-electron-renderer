import { insertBeforeChild, removeChild, getNativeTouchBar } from '../utils';

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
      isRerenderNeeded = true;
      // this.children.map(child => child.createInstance());
    }

    this.didChildrenChange = false;

    return isRerenderNeeded;
  }

  createInstance() {
    const nativeChildren = this.children.map(child => child.createInstance());
    const args = {
      items: nativeChildren,
    };

    const NativeTouchBar = getNativeTouchBar();
    this.instance = new NativeTouchBar.TouchBarGroup(args);

    this.didChildrenChange = false;
    return this.instance;
  }
}

export default TouchBarGroup;
