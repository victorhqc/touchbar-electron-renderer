import uuidv4 from 'uuid/v4';

import TouchBarText from './TouchBarText';
import { ComponentProps, InternalTouchBarComponent } from './types';

class TouchBarColor implements InternalTouchBarComponent {
  public id: string;
  private props: TouchBarColorProps;

  public constructor(props: TouchBarColorProps) {
    this.id = uuidv4();
    this.props = props;
  }

  public appendChild(text: TouchBarText) {
    this.props.children = text;
  }

  public insertBefore(text: TouchBarText) {
    this.appendChild(text);
  }

  public update({ newProps }: { newProps: TouchBarColorProps }): boolean {
    this.props = newProps;

    if (this.props.children) {
      this.appendChild(this.props.children);
    }

    return false;
  }

  public removeChild() {
    this.props.children = undefined;
  }

  public createInstance() {
    if (!this.props.children) return null;

    return this.props.children.createInstance();
  }
}

export default TouchBarColor;

export interface TouchBarColorProps extends ComponentProps {
  children?: TouchBarText;
}
