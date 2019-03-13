import isEqual from 'lodash/isEqual';

import { insertBeforeChild, removeChild, getNativeTouchBar } from '../utils';

class TouchBarPopover {
  constructor(props) {
    this.children = [];
    this.didChildrenChange = false;
    this.setProps(props);
    this.instance = null;
  }

  update({ newProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.setProps(newProps);
    return this.updateInstance();
  }

  setProps(props) {
    this.props = props;
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

  getNativeArgs(buildItems = true) {
    const { children, hideCloseButton, ...props } = this.props;

    return {
      ...props,
      showCloseButton: hideCloseButton ? false : true, // if `hideCloseButton` is truthy, then `showCloseButton` is false.
      items: buildItems && this.children.map(child => child.createInstance()),
    };
  }

  updateInstance() {
    this.childrenSinceLastRender = this.children.length;
    let isRerenderNeeded = false;

    const args = this.getNativeArgs(false);

    // Update instance.
    Object.keys(args).forEach((key) => {
      if (key === 'items') { return; }

      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    if (this.didChildrenChange) {
      isRerenderNeeded = true;
    }

    this.didChildrenChange = false;
    return isRerenderNeeded;
  }

  createInstance() {
    this.childrenSinceLastRender = this.children.length;
    const args = this.getNativeArgs();

    const NativeTouchBar = getNativeTouchBar();
    this.instance = new NativeTouchBar.TouchBarPopover(args);

    this.didChildrenChange = false;
    return this.instance;
  }
}

export default TouchBarPopover;
