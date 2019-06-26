import {
  TouchBarPopover as NativeTouchBarPopover,
  NativeImage,
} from 'electron';
import isEqual from 'lodash/isEqual';
import uuidv4 from 'uuid/v4';

import {
  insertBeforeChild,
  removeChild,
  getNativeTouchBar,
  isTruthy,
} from '../utils';
import {
  TouchbarElement,
  ValidTouchBarElement,
  TouchBarValidItems,
} from './types';

class TouchBarPopover implements TouchbarElement<TouchBarPopoverProps> {
  public id: string;
  private props: TouchBarPopoverProps;
  private didChildrenChange: boolean;
  private instance: Maybe<NativeTouchBarPopoverIndex>;
  private builtChildrenInstances: TouchBarValidItems[];

  private constructor(props: TouchBarPopoverProps) {
    this.id = uuidv4();
    this.props = props;
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

  public appendChild(child: ValidTouchBarElement) {
    if (!this.props.children) {
      this.props.children = [];
    }

    this.props.children.push(child);
    this.didChildrenChange = true;
  }

  public insertBefore(
    newChild: ValidTouchBarElement,
    beforeChild: ValidTouchBarElement,
  ) {
    this.props.children = insertBeforeChild({
      children: this.props.children || [],
      newChild,
      beforeChild,
    });
    this.didChildrenChange = true;
  }

  public removeChild(child: ValidTouchBarElement) {
    this.props.children = removeChild({
      children: this.props.children || [],
      child,
    });
    this.didChildrenChange = true;
  }

  private getNativeArgs(buildItems = true) {
    const { children, hideCloseButton, ...props } = this.props;

    this.builtChildrenInstances = !buildItems
      ? this.builtChildrenInstances
      : (children || []).map(child => child.createInstance()).filter(isTruthy);

    return {
      ...props,
      // if `hideCloseButton` is truthy, then `showCloseButton` is false.
      showCloseButton: hideCloseButton ? false : true,
      items: this.builtChildrenInstances,
    };
  }

  public updateInstance() {
    let isRerenderNeeded = false;

    const args = this.getNativeArgs(false) as WithIndex;

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

    const NativeTouchBar = getNativeTouchBar();
    if (!NativeTouchBar) return null;

    this.instance = new NativeTouchBar.TouchBarPopover({
      ...args,
      items: new NativeTouchBar({ items: args.items }),
    });

    this.didChildrenChange = false;
    return this.instance;
  }
}

export default TouchBarPopover;

export interface TouchBarPopoverProps {
  label?: string;
  icon?: NativeImage;
  hideCloseButton?: boolean;
  children?: ValidTouchBarElement[];
}

interface NativeTouchBarPopoverIndex extends NativeTouchBarPopover, WithIndex {}
