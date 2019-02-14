import uuidv4 from 'uuid/v4';

import TouchBarText from './TouchBarText';
import { buildChild } from '../utils';

export default class TouchBarSegment {
  constructor(props) {
    this.props = props;
    this.prevProps = {};
    this.id = uuidv4();

    this.children = null;
    this.instance = null;
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

  updateProps(newProps) {
    this.prevProps = Object.assign({}, this.props);
    this.props = newProps;
  }

  getNativeArgs() {
    const {
      children,
      ...props
    } = this.props;

    return {
      ...props,
      label: children,
    };
  }

  createInitialInstance() {
    const args = this.getNativeArgs();

    this.instance = args;

    return this.instance;
  }

  // TODO: Updating properties in segment does not trigger an update in TouchBar.
  // I need a flag to know if a new touchbar needs to be recreated because one of the children
  // changed.
  updateInstance() {
    const args = this.getNativeArgs();

    // Update instance.
    Object.keys(args).forEach((key) => {
      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    return this.instance;
  }

  createInstance() {
    if (this.props === this.prevProps) {
      return;
    }

    if (!this.instance) {
      return this.createInitialInstance();
    }

    return this.updateInstance();
  }
}
