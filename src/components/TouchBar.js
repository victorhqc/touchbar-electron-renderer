import { TouchBar as NativeTouchBar } from 'electron';
import { MOUSE_EVENTS } from '../constants';

class TouchBar {
  constructor(children = []) {
    this.children = children;
  }

  appendChild(child) {
    this.children.push(child);
  }

  removeChild(child) {
    this.children = this.children
      .filter(childElement => childElement !== child);
  }

  createInstance() {
    const touchBar = new NativeTouchBar(this.children);
    this.setTouchBar(touchBar);

    return touchBar;
  }
}

export default TouchBar;
