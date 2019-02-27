import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import TouchBarText from './TouchBarText';
import { buildChild } from '../utils';

export default class TouchBarSegment {
  constructor(props) {
    this.setProps(props);
    this.id = uuidv4();

    this.children = null;
    this.instance = null;
  }

  setProps(props) {
    this.props = props;
  }

  update({ newProps }) {
    if (isEqual(newProps, this.props)) {
      return
    }

    this.setProps(props);
    return this.updateInstance();
  }

  // Text can have only one child.
  appendChild(label) {
    if (
      !label
      && typeof label !== 'string'
      && !label instanceof TouchBarText
    ) {
      console.warn(`<color /> child should be string, but received ${typeof label}`);
      return;
    }

    this.children = label;
  }

  insertBefore(label) {
    return this.appendChild(label);
  }

  replaceText(label) {
    return this.appendChild(label);
  }

  removeChild() {
    this.children = null;
  }

  getNativeArgs() {
    const {
      children,
      disabled,
      ...props
    } = this.props;

    return {
      ...props,
      enabled: disabled ? false : true, // When disabled is truthy, then `enabled` is false.
      label: children,
    };
  }

  updateInstance() {
    const args = this.getNativeArgs();

    // Update instance.
    Object.keys(args).forEach((key) => {
      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    // When an update happens in a segment, a hard re-render is needed*
    return true;
  }

  createInstance() {
    const args = this.getNativeArgs();

    this.instance = args;
    return this.instance;
  }
}
