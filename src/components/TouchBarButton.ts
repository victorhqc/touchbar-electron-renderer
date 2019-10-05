import {
  NativeImage,
  TouchBarButton as NativeTouchBarButton,
  TouchBarButtonConstructorOptions,
} from 'electron';
import uuidv4 from 'uuid/v4';

import { getNativeTouchBar, cleanReactProps, Maybe, WithIndex } from '../utils';
import { ComponentProps, NativeTouchBarComponent } from './types';
import TouchBarText from './TouchBarText';

export class TouchBarButton implements NativeTouchBarComponent {
  public id: string;
  private props: TouchBarButtonProps;
  private instance: Maybe<NativeTouchBarButtonWithIndex>;
  private children: TouchBarText | undefined;

  public constructor({ children, ...props }: TouchBarButtonProps) {
    this.props = props;
    this.children = children;
    this.id = uuidv4();

    this.instance = null;
  }

  public appendChild(child: TouchBarText): void {
    this.children = child;
  }

  public insertBefore(child: TouchBarText) {
    this.appendChild(child);
  }

  public removeChild() {
    this.children = undefined;
  }

  public update({ newProps }: { newProps: TouchBarButtonProps }) {
    this.props = newProps;
    this.updateInstance();

    // No Rerender needed when button props update.
    return false;
  }

  public getNativeArgs(): TouchBarButtonConstructorOptions {
    const { onClick, ...props } = this.props;

    return {
      ...props,
      ...cleanReactProps(),
      label: this.children && this.children.createInstance(),
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

export interface TouchBarButtonProps extends ComponentProps {
  onClick?: () => void;
  icon?: NativeImage;
  iconPosition?: 'left' | 'right' | 'overlay';
  backgroundColor?: string;
  children?: TouchBarText;
}

interface NativeTouchBarButtonWithIndex
  extends NativeTouchBarButton,
    WithIndex {}
