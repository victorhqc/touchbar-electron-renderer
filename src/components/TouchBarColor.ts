import uuidv4 from 'uuid/v4';

import TouchBarText from './TouchBarText';
import { TouchbarElement } from './types';

class TouchBarColor implements TouchbarElement<string> {
  id: string;
  text: Maybe<TouchBarText>;

  constructor(text: TouchBarText) {
    this.id = uuidv4();
    this.text = this.appendChild(text);
  }

  // Text can have only one child.
  appendChild(text: TouchBarText) {
    if (
      !text
      && typeof text !== 'string'
      && !text as any instanceof TouchBarText
    ) {
      console.warn(`<color /> child should be string, but received ${typeof text}`);
      return new TouchBarText('');
    }

    return text;
  }

  insertBefore(text: TouchBarText) {
    this.text = this.appendChild(text);
    return this.text;
  }

  replaceText(text: TouchBarText) {
    this.text = this.appendChild(text);
    return this.text;
  }

  removeChild() {
    this.text = null;
  }

  createInstance() {
    if (!this.text) return '';
    return this.text.createInstance();
  }
}

export default TouchBarColor;
