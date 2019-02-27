import uuidv4 from 'uuid/v4';

import TouchBarText from './TouchBarText';
import { buildChild } from '../utils';

class TouchBarScrubItem {
  constructor(props) {
    this.setProps(props);
    this.id = uuidv4();

    // TouchBarScrubItem can have only one child.
    this.child = null;
    this.instance = null;
  }

  setProps(props) {
    this.props = props;
  }

  update() {}

  /**
   * TouchBarScrubItem can only have text children.
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

  createInstance() {
    const { children, ...props } = this.props;

    this.instance = {
      ...props,
      label: buildChild(this.child),
    };

    return this.instance;
  }
}

export default TouchBarScrubItem;
