import uuidv4 from 'uuid/v4';

import TouchBarText from './TouchBarText';
import { TouchbarElement } from './types';

class TouchBarColor implements TouchbarElement<string | undefined> {
  id: string;
  props: TouchBarColorProps;

  constructor(props: TouchBarColorProps) {
    this.id = uuidv4();
    this.props = props;
  }

  // Text can have only one child.
  appendChild(text: TouchBarText) {
    if (
      !text
      && typeof text !== 'string'
      && !text as any instanceof TouchBarText
    ) {
      console.warn(`<color /> child should be string, but received ${typeof text}`);
      return;
    }

    this.props.children = text;
  }

  insertBefore(text: TouchBarText) {
    this.appendChild(text);
  }

  replaceText(text: TouchBarText) {
    this.appendChild(text);
  }

  removeChild() {
    this.props.children = undefined;
  }

  createInstance() {
    if (!this.props.children) return;
    return this.props.children.createInstance();
  }
}

export default TouchBarColor;

export interface TouchBarColorProps {
  children?: TouchBarText;
}
