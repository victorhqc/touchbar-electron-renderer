// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import { insertBeforeChild, removeChild, buildChild } from '../utils';
import TouchBarSegment from './TouchBarSegment';

// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

function isValidChild(child) {
  if (!child) { return false; }
  if ( !child instanceof TouchBarSegment && typeof child !== 'string') {
    console.warn('<segmented-control /> Can only have <segment /> or text as children.');
    return false;
  }

  return true;
}

export default class TouchBarSegmentedControl {
  constructor(props) {
    this.setProps(props);
    this.id = uuidv4();

    this.children = [];
    this.instance = null;
    this.didChildrenChange = false;
  }

  setProps(props) {
    this.props = props;
  }

  update({ newProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.setProps(newProps);
    return this.updateInstance();
  }

  /**
   * TouchBarSegmentedControl can only have <segment /> children.
   * @param  {stting} child
   * @return {void}
   */
  appendChild(child) {
    if (!isValidChild(child)) {
      return;
    }

    this.children.push(child);
    this.didChildrenChange = true;
  }

  insertBefore(newChild, beforeChild) {
    if (!isValidChild(child)) {
      return;
    }

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

  getSegments(buildItems) {
    if (!buildItems) {
      return null;
    }

    if (this.props.segments) {
      return this.props.segments;
    }

    return this.children.map(child => buildChild(child));
  }

  getNativeArgs(buildItems = true) {
    const {
      children,
      onChange,
      segments,
      selected,
      ...props
    } = this.props;

    return {
      ...props,
      change: onChange,
      selectedIndex: selected,
      segments: this.getSegments(buildItems),
    };
  }

  updateInstance() {
    let isRerenderNeeded = false;
    if(this.didChildrenChange) {
      isRerenderNeeded = true;
    }

    const args = this.getNativeArgs(false);

    // Update instance.
    Object.keys(args).forEach((key) => {
      if (key === 'items' || key === 'segments') { return; }

      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    this.didChildrenChange = false;
    return isRerenderNeeded;
  }

  createInstance() {
    const args = this.getNativeArgs();

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    if (NativeTouchBar) {
      this.instance = new NativeTouchBar.TouchBarSegmentedControl(args);
    } else {
      this.instance = new RemoteTouchBar.TouchBarSegmentedControl(args);
    }

    this.didChildrenChange = false;
    return this.instance;
  }
}
