import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import { buildChild, getNativeTouchBar } from '../utils';

class TouchBarLabel {
  constructor(props) {
    this.setProps(props);
    this.id = uuidv4();

    // TouchBarLabel can have only one child.
    this.child = null;
    this.instance = null;
  }

  setProps(props) {
    this.props = props;
  }

  /**
   * TouchBarLabel can only have text children.
   * @param  {stting} child
   * @return {void}
   */
  appendChild(child) {
    this.child = child;
  }

  insertBefore(child) {
    return this.appendChild(child);
  }

  removeChild() {
    this.child = null;
  }

  update({ newProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.setProps(newProps);
    this.updateInstance();

    // No rerender needed when props change.
    return false;
  }

  getNativeArgs() {
    const { children, color, ...props } = this.props;

    return {
      ...props,
      textColor: color,
      label: buildChild(this.child),
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

    return this.instance;
  }

  createInstance() {
    const args = this.getNativeArgs();

    const NativeTouchBar = getNativeTouchBar();
    this.instance = new NativeTouchBar.TouchBarLabel(args);
    return this.instance;
  }
}

export default TouchBarLabel;
