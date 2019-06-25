import uuidv4 from 'uuid/v4';

import { TouchbarElement } from './types';

class TouchBarText implements TouchbarElement<string> {
  id: string;
  text: Maybe<string>;

  constructor(text: string) {
    this.id = uuidv4();
    this.text = text;
  }

  insertBefore(text: string) {
    this.text = text;
    return this.text;
  }

  replaceText(text: string) {
    this.text = text;
    return this.text;
  }

  removeChild() {
    this.text = null;
  }

  createInstance() {
    return this.text || '';
  }
}

export default TouchBarText;
