import uuidv4 from 'uuid/v4';

import { TouchBarTextInterface } from './types';

class TouchBarText implements TouchBarTextInterface {
  public id: string;
  private text: string;

  private constructor(text: string) {
    this.id = uuidv4();
    this.text = text;
  }

  public replaceText(text: string) {
    this.text = text;
  }

  public createInstance() {
    return this.text;
  }
}

export default TouchBarText;
