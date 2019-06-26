import uuidv4 from 'uuid/v4';

import { TouchBarTextComponent } from './types';

class TouchBarText implements TouchBarTextComponent {
  public id: string;
  private text: string;

  public constructor(text: string) {
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
