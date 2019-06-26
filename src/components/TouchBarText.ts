import uuidv4 from 'uuid/v4';

import { TouchbarElement } from './types';

class TouchBarText implements TouchbarElement<string> {
  public id: string;
  private text: Maybe<string>;

  private constructor(text: string) {
    this.id = uuidv4();
    this.text = text;
  }

  public insertBefore(text: string) {
    this.text = text;
    return this.text;
  }

  public replaceText(text: string) {
    this.text = text;
    return this.text;
  }

  public removeChild() {
    this.text = null;
  }

  public createInstance() {
    return this.text || '';
  }
}

export default TouchBarText;
