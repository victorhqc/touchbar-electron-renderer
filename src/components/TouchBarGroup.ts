import { TouchBarGroup as NativeTouchBarGroup } from 'electron';
import uuidv4 from 'uuid/v4';

import {
  insertBeforeChild,
  removeChild,
  getNativeTouchBar,
  isTruthy,
  Maybe,
} from '../utils';
import { ComponentProps, NativeTouchBarComponent } from './types';

class TouchBarGroup implements NativeTouchBarComponent {
  public id: string;
  private didChildrenChange: boolean;
  private instance: Maybe<NativeTouchBarGroup>;
  private children: NativeTouchBarComponent[];

  public constructor() {
    this.id = uuidv4();
    this.children = [];

    this.didChildrenChange = false;
    this.instance = null;
  }

  public update() {
    return this.updateInstance();
  }

  public appendChild(child: NativeTouchBarComponent) {
    this.didChildrenChange = true;
    this.children.push(child);
  }

  public insertBefore(
    newChild: NativeTouchBarComponent,
    beforeChild: NativeTouchBarComponent,
  ) {
    this.children = insertBeforeChild({
      children: this.children,
      newChild,
      beforeChild,
    });

    this.didChildrenChange = true;
  }

  public removeChild(child: NativeTouchBarComponent) {
    this.children = removeChild({
      children: this.children,
      child,
    });

    this.didChildrenChange = true;
  }

  public updateInstance() {
    let isRerenderNeeded = false;
    if (this.didChildrenChange) {
      isRerenderNeeded = true;
    }

    this.didChildrenChange = false;
    return isRerenderNeeded;
  }

  public createInstance() {
    const nativeChildren = this.children
      .map(child => child.createInstance())
      .filter(isTruthy);

    const NativeTouchBar = getNativeTouchBar();
    if (!NativeTouchBar) return null;

    const args = {
      items: new NativeTouchBar({ items: nativeChildren }),
    };

    this.instance = new NativeTouchBar.TouchBarGroup(args);

    this.didChildrenChange = false;
    return this.instance;
  }
}

export default TouchBarGroup;

export interface TouchBarGroupProps extends ComponentProps {
  children?: NativeTouchBarComponent[];
}
