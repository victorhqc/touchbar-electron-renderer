import { NativeImage, TouchBarButton as NativeTouchBarButton, TouchBarButtonConstructorOptions } from 'electron'
import uuidv4 from 'uuid/v4';

import { getNativeTouchBar } from '../utils';
import { TouchbarElement } from './types';
import TouchBarText from './TouchBarText';

class TouchBarButton implements TouchbarElement<Maybe<NativeTouchBarButton>> {
  id: string;
  props: TouchBarButtonProps;
  instance: Maybe<NativeTouchBarButtonWithIndex>;

  constructor(props: TouchBarButtonProps) {
    this.props = props;
    this.id = uuidv4();

    this.instance = null;
  }

  appendChild(child: TouchBarText): void {
    this.props.children = child;
  }

  insertBefore(child: TouchBarText) {
    return this.appendChild(child);
  }

  removeChild() {
    this.props.children = undefined;
  }

  update({ newProps }: { newProps: TouchBarButtonProps }) {
    this.props = newProps;
    this.updateInstance();

    // No Rerender needed when button props update.
    return false;
  }

  getNativeArgs(): TouchBarConstructorOptionsWithIndex {
    const {
      children,
      onClick,
      ...props
    } = this.props;

    return {
      ...props,
      label: children && children.createInstance(),
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
  onClick?:() => void;
  icon?: NativeImage;
  IconPosition?:IconPosition;
  backgroundColor?: string;
  children?: TouchBarText;
}

export enum IconPosition {
  Left = 'left',
  Right = 'right',
  Overlay = 'overlay'
};

interface TouchBarConstructorOptionsWithIndex extends TouchBarButtonConstructorOptions, WithIndex {}
interface NativeTouchBarButtonWithIndex extends NativeTouchBarButton, WithIndex {}
