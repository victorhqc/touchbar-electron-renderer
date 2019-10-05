import {
  TouchBarPopover as NativeTouchBarPopover,
  NativeImage,
  TouchBarPopoverConstructorOptions,
} from 'electron';
import isEqual from 'lodash/isEqual';
import uuidv4 from 'uuid/v4';

import {
  insertBeforeChild,
  removeChild,
  getNativeTouchBar,
  isTruthy,
  cleanReactProps,
  Maybe,
  WithIndex,
} from '../utils';
import {
  ComponentProps,
  NativeTouchBarComponent,
  NativeTouchBarItem,
} from './types';

class TouchBarPopover implements NativeTouchBarComponent {
  public id: string;
  private props: TouchBarPopoverProps;
  private didChildrenChange: boolean;
  private instance: Maybe<NativeTouchBarPopoverIndex>;
  private builtChildrenInstances: NativeTouchBarItem[];
  private children: NativeTouchBarComponent[];

  public constructor(props: TouchBarPopoverProps) {
    this.id = uuidv4();
    this.props = props;
    this.children = [];
    this.didChildrenChange = false;
    this.instance = null;
    this.builtChildrenInstances = [];
  }

  public update({ newProps }: { newProps: TouchBarPopoverProps }) {
    if (isEqual(newProps, this.props)) {
      return false;
    }

    this.props = newProps;
    return this.updateInstance();
  }

  public appendChild(child: NativeTouchBarComponent) {
    this.children.push(child);
    this.didChildrenChange = true;
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

  private getNativeArgs(): TouchBarPopoverConstructorOptions {
    const { hideCloseButton, ...props } = this.props;

    return {
      ...props,
      ...cleanReactProps(),
      // if `hideCloseButton` is truthy, then `showCloseButton` is false.
      showCloseButton: hideCloseButton ? false : true,
    };
  }

  private getItems(buildItems = true) {
    // TODO: Figure out why some children are react components already.
    // This means that `createInstance` does not exist!
    const items = !buildItems
      ? this.builtChildrenInstances
      : this.children
          .filter(child => child.createInstance)
          .map(child => {
            return child.createInstance();
          })
          .filter(isTruthy);

    this.builtChildrenInstances = items;
    return items;
  }

  public updateInstance() {
    let isRerenderNeeded = false;

    const items = this.getItems(false);
    const args = {
      ...this.getNativeArgs(),
      items,
    } as WithIndex;

    // Update instance.
    Object.keys(args).forEach(key => {
      if (key === 'items') {
        return;
      }

      if (this.instance && this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    if (this.didChildrenChange) {
      isRerenderNeeded = true;
    }

    this.didChildrenChange = false;
    return isRerenderNeeded;
  }

  public createInstance() {
    const args = this.getNativeArgs();
    const items = this.getItems();

    const NativeTouchBar = getNativeTouchBar();
    if (!NativeTouchBar) return null;

    this.instance = new NativeTouchBar.TouchBarPopover({
      ...args,
      items: new NativeTouchBar({ items }),
    });

    this.didChildrenChange = false;
    return this.instance;
  }
}

export default TouchBarPopover;

export interface TouchBarPopoverProps extends ComponentProps {
  label?: string;
  icon?: NativeImage;
  hideCloseButton?: boolean;
  children?: NativeTouchBarComponent[];
}

interface NativeTouchBarPopoverIndex extends NativeTouchBarPopover, WithIndex {}
