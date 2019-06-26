import uuidv4 from 'uuid/v4';

import TouchBarText from './TouchBarText';
import { TouchbarElement } from './types';

class TouchBarColor implements TouchbarElement<string | undefined> {
  public id: string;
  private props: TouchBarColorProps;

  private constructor(props: TouchBarColorProps) {
    this.id = uuidv4();
    this.props = props;
  }

  public appendChild(text: TouchBarText) {
    this.props.children = text;
  }

  public insertBefore(text: TouchBarText) {
    this.appendChild(text);
  }

  public replaceText(text: TouchBarText) {
    this.appendChild(text);
  }

  public removeChild() {
    this.props.children = undefined;
  }

  public createInstance() {
    if (!this.props.children) return;
    return this.props.children.createInstance();
  }
}

export default TouchBarColor;

export interface TouchBarColorProps {
  children?: TouchBarText;
}
