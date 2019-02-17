// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import debounce from 'lodash/debounce';

import { insertBeforeChild, removeChild } from '../utils';

// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

class TouchBarScrubber {
  constructor(props) {
    this.children = [];
    this.childrenSinceLastRender = 0;
    this.props = props;
    this.prevProps = {};
    this.instance = null;
    this.childrenChanged = false;
  }

  updateProps(newProps) {
    this.prevProps = Object.assign({}, this.props);
    this.props = newProps;
  }

  appendChild(child) {
    if (!child) {
      return;
    }

    this.childrenChanged = true;
    this.children.push(child);
  }

  insertBefore(newChild, beforeChild) {
    this.childrenChanged = true;
    this.children = insertBeforeChild({
      children: this.children,
      newChild,
      beforeChild,
    });
  }

  removeChild(child) {
    this.childrenChanged = true;
    this.children = removeChild({
      children: this.children,
      child,
    });
  }

  didChildrenChange() {
    return this.childrenChanged;
  }

  generateChildrenInstances() {
    return this.children.map(child => child.createInstance());
  }

  getNativeArgs() {
    const { children, onSelect, onHighlight, debounceTime, ...props } = this.props;

    return {
      ...props,
      // If not debounced, it causes serious performance issues
      select: onSelect && debounce(onSelect, debounceTime || 250),
      highlight: onHighlight && debounce(onHighlight, debounceTime || 250),
      items: this.generateChildrenInstances(),
    };
  }

  createInitialInstance() {
    const args = this.getNativeArgs();
    this.childrenSinceLastRender = this.children.length;

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    this.instance = NativeTouchBar ?
      new NativeTouchBar.TouchBarScrubber(args)
      : new RemoteTouchBar.TouchBarScrubber(args);

    return this.instance;
  }

  updateInstance() {
    const args = this.getNativeArgs();

    // Update new/deleted items
    if (this.didChildrenChange()) {
      this.instance.items = args.items;
      this.childrenChanged = false;
    }

    // Update instance.
    Object.keys(args).forEach((key) => {
      // Avoid updating functions as there's not a really easy way to know if they changed.
      if (key === 'select' || key === 'highlight') {
        return;
      }

      // Items are updated manually.
      if (key === 'items') {
        return;
      }

      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });


    this.childrenSinceLastRender = this.children.length;
    return this.instance;
  }

  createInstance() {
    if (this.props === this.prevProps) {
      return;
    }

    if (
      !this.instance
      // || this.childrenSinceLastRender !== this.children.length
    ) {
      return this.createInitialInstance();
    }

    return this.updateInstance();
  }
}

export default TouchBarScrubber;
