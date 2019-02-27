// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

import { insertBeforeChild, removeChild } from '../utils';

// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

class TouchBarScrubber {
  constructor(props) {
    this.setProps(props);
    this.children = [];
    this.didChildrenChange = false;
    this.instance = null;
  }

  setProps(props) {
    this.props = props;
  }

  update({ newProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.setProps(props);
    return this.updateInstance();
  }

  appendChild(child) {
    if (!child) {
      return;
    }

    this.didChildrenChange = true;
    this.children.push(child);
  }

  insertBefore(newChild, beforeChild) {
    this.didChildrenChange = true;
    this.children = insertBeforeChild({
      children: this.children,
      newChild,
      beforeChild,
    });
  }

  removeChild(child) {
    this.didChildrenChange = true;
    this.children = removeChild({
      children: this.children,
      child,
    });
  }

  generateChildrenInstances() {
    return this.children.map(child => child.createInstance());
  }

  getNativeArgs(buildItems = true) {
    const { children, onSelect, onHighlight, debounceTime, ...props } = this.props;

    return {
      ...props,
      // If not debounced, it causes serious performance issues
      select: onSelect && debounce(onSelect, debounceTime || 250),
      highlight: onHighlight && debounce(onHighlight, debounceTime || 250),
      items: buildItems && this.generateChildrenInstances(),
    };
  }

  updateInstance() {
    // this.didChildrenChange = true;
    let isRerenderNeeded = false;
    const args = this.getNativeArgs(false);

    // Update new/deleted items
    if (this.didChildrenChange) {
      isRerenderNeeded = true;
    }

    // Update instance.
    Object.keys(args).forEach((key) => {
      // Avoid updating functions as there's not a really easy way to know if they changed.
      if (key === 'select' || key === 'highlight' || key === 'items') {
        return;
      }

      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    this.didChildrenChange = false;
    return isRerenderNeeded;
  }

  createInstance() {
    const args = this.getNativeArgs();
    this.childrenSinceLastRender = this.children.length;

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    this.instance = NativeTouchBar ?
      new NativeTouchBar.TouchBarScrubber(args)
      : new RemoteTouchBar.TouchBarScrubber(args);

    return this.instance;
  }
}

export default TouchBarScrubber;
