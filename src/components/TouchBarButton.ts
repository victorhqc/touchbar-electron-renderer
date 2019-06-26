import {
  NativeImage,
  TouchBarButton as NativeTouchBarButton,
  TouchBarButtonConstructorOptions,
} from 'electron';
import uuidv4 from 'uuid/v4';

import { getNativeTouchBar } from '../utils';
import { TouchbarElement } from './types';
import TouchBarText from './TouchBarText';

class TouchBarButton implements TouchbarElement<Maybe<NativeTouchBarButton>> {
  public id: string;
  private props: TouchBarButtonProps;
  private instance: Maybe<NativeTouchBarButtonWithIndex>;

  private constructor(props: TouchBarButtonProps) {
    this.props = props;
    this.id = uuidv4();

    this.instance = null;
  }

  public appendChild(child: TouchBarText): void {
    this.props.children = child;
  }

  public insertBefore(child: TouchBarText) {
    return this.appendChild(child);
  }

  public removeChild() {
    this.props.children = undefined;
  }

  public update({ newProps }: { newProps: TouchBarButtonProps }) {
    this.props = newProps;
    this.updateInstance();

    // No Rerender needed when button props update.
    return false;
  }

  public getNativeArgs(): TouchBarButtonConstructorOptions {
    const { children, onClick, ...props } = this.props;

    return {
      ...props,
      label: children && children.createInstance(),
      click: onClick,
    };
  }

  private updateInstance() {
    const args = this.getNativeArgs() as WithIndex;

    // Update instance.
    Object.keys(args).forEach(key => {
      if (!this.instance) return;

      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });
  }

  public createInstance() {
    const args = this.getNativeArgs();

    const NativeTouchBar = getNativeTouchBar();
    if (!NativeTouchBar) return null;

    this.instance = new NativeTouchBar.TouchBarButton(args);
    return this.instance;
  }
}

export default TouchBarButton;

export interface TouchBarButtonProps {
  onClick?: () => void;
  icon?: NativeImage;
  iconPosition?: 'left' | 'right' | 'overlay';
  backgroundColor?: string;
  children?: TouchBarText;
}

interface NativeTouchBarButtonWithIndex
  extends NativeTouchBarButton,
    WithIndex {}
