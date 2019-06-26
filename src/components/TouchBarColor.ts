import uuidv4 from 'uuid/v4';

import TouchBarText from './TouchBarText';
import { ComponentProps, InternalTouchBarComponent } from './types';

class TouchBarColor implements InternalTouchBarComponent {
  public id: string;
  private children: TouchBarText | undefined;

  public constructor({ children }: TouchBarColorProps) {
    this.id = uuidv4();
    this.children = children;
  }

  public appendChild(text: TouchBarText) {
    this.children = text;
  }

  public insertBefore(text: TouchBarText) {
    this.appendChild(text);
  }

  public update({ newProps }: { newProps: TouchBarColorProps }): boolean {
    if (newProps.children) {
      this.appendChild(newProps.children);
    }

    return false;
  }

  public removeChild() {
    this.children = undefined;
  }

  public createInstance() {
    if (!this.children) return null;

    return this.children.createInstance();
  }
}

export default TouchBarColor;

export interface TouchBarColorProps extends ComponentProps {
  children?: TouchBarText;
}
