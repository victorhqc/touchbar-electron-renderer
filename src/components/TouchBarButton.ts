import { NativeImage, TouchBarButton as TouchBarNativeButton, TouchBarButtonConstructorOptions } from 'electron'
import uuidv4 from 'uuid/v4';

import { getNativeTouchBar } from '../utils';

class TouchBarButton {
  id: string;
  props: TouchBarButtonProps;
  child?: string;
  instance: Maybe<NativeTouchBarButtonWithIndex>;

  constructor(props: TouchBarButtonProps) {
    this.props = props;
    this.id = uuidv4();

    // TouchBarButton can have only one child.
    this.child = undefined;
    this.instance = null;
  }

  /**
   * TouchBarButton can only have text children.
   * @param  {stting} child
   * @return {void}
   */
  appendChild(child: string): void {
    this.child = child;
  }

  insertBefore(child: string) {
    return this.appendChild(child);
  }

  removeChild() {
    this.child = undefined;
  }

  update({ newProps }: { newProps: TouchBarButtonProps }) {
    this.props = newProps;
    this.updateInstance();

    // No Rerender needed when button props update.
    return false;
  }

  getNativeArgs(): TouchBarConstructorOptionsWithIndex {
    const {
      // TODO: check if this is needed.
      // children,
      onClick,
      ...props
    } = this.props;

    return {
      ...props,
      label: this.child,
      click: onClick,
    };
  }

  updateInstance() {
    const args = this.getNativeArgs();

    // Update instance.
    Object.keys(args).forEach((key) => {
      if (!this.instance) return;

      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });
  }

  createInstance() {
    const args = this.getNativeArgs();

    const NativeTouchBar = getNativeTouchBar();
    if (!NativeTouchBar) return null;

    this.instance = new NativeTouchBar.TouchBarButton(args);
    return this.instance;
  }
}

export default TouchBarButton;

export interface TouchBarButtonProps {
  onClick?:() => void,
  icon?: NativeImage,
  IconPosition?:IconPosition,
  backgroundColor?: string
  // children: MaybeUndefined<string[]>
}

export enum IconPosition {
  Left = 'left',
  Right = 'right',
  Overlay = 'overlay'
};

interface TouchBarConstructorOptionsWithIndex extends TouchBarButtonConstructorOptions, WithIndex {}
interface NativeTouchBarButtonWithIndex extends TouchBarNativeButton, WithIndex {}
