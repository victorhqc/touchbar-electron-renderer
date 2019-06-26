import { TouchBarGroup as NativeTouchBarGroup } from 'electron';
import uuidv4 from 'uuid/v4';

import {
  insertBeforeChild,
  removeChild,
  getNativeTouchBar,
  isTruthy,
} from '../utils';
import { ComponentProps, NativeTouchBarComponent } from './types';

class TouchBarGroup implements NativeTouchBarComponent {
  public id: string;
  private props: TouchBarGroupProps;
  private didChildrenChange: boolean;
  private instance: Maybe<NativeTouchBarGroup>;

  public constructor(props: TouchBarGroupProps) {
    this.id = uuidv4();
    this.props = props;

    this.didChildrenChange = false;
    this.instance = null;
  }

  public update() {
    return this.updateInstance();
  }

  public appendChild(child: NativeTouchBarComponent) {
    if (!this.props.children) {
      this.props.children = [];
    }

    this.didChildrenChange = true;
    this.props.children.push(child);
  }

  public insertBefore(
    newChild: NativeTouchBarComponent,
    beforeChild: NativeTouchBarComponent,
  ) {
    this.props.children = insertBeforeChild({
      children: this.props.children || [],
      newChild,
      beforeChild,
    });

    this.didChildrenChange = true;
  }

  public removeChild(child: NativeTouchBarComponent) {
    this.props.children = removeChild({
      children: this.props.children || [],
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
    const nativeChildren = (this.props.children || [])
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
