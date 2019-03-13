import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import debounce from 'lodash/debounce';

import { buildChild, getNativeTouchBar } from '../utils';

class TouchBarSlider {
  constructor(props) {
    this.setProps(props);
    this.id = uuidv4();

    // TouchBarSlider can have only one child.
    this.child = null;
    this.instance = null;
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
   * TouchBarSlider can only have text children.
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

  getNativeArgs() {
    const { children, onChange, icon, ...props } = this.props;

    return {
      ...props,
      label: buildChild(this.child),
      // If not debounced, it causes serious performance issues
      change: onChange && debounce(onChange, props.debounceTime || 0),
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

    return false;
  }

  createInstance() {
    const args = this.getNativeArgs();

    const NativeTouchBar = getNativeTouchBar();
    this.instance = new NativeTouchBar.TouchBarSlider(args);
    return this.instance;
  }
}

export default TouchBarSlider;
