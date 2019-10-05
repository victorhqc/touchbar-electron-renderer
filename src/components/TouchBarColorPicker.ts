import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';
import {
  TouchBarColorPicker as NativeTouchBarColorPicker,
  TouchBarColorPickerConstructorOptions,
} from 'electron';

import {
  isTruthy,
  insertBeforeChild,
  removeChild,
  getNativeTouchBar,
  cleanReactProps,
  Maybe,
  WithIndex,
} from '../utils';
import TouchBarColor from './TouchBarColor';
import { ComponentProps, NativeTouchBarComponent } from './types';

class TouchBarColorPicker implements NativeTouchBarComponent {
  public id: string;
  private props: TouchBarColorPickerProps;
  private instance: Maybe<NativeTouchBarColorPickerWithIndex>;
  private children: TouchBarColor[];

  public constructor({ children, ...props }: TouchBarColorPickerProps) {
    this.id = uuidv4();
    this.props = props;
    this.children = children || [];

    this.instance = null;
  }

  public appendChild(child: TouchBarColor): void {
    this.children.push(child);
  }

  public insertBefore(newChild: TouchBarColor, beforeChild: TouchBarColor) {
    this.children = insertBeforeChild({
      children: this.children,
      newChild,
      beforeChild,
    });
  }

  public removeChild(child: TouchBarColor) {
    this.children = removeChild({
      children: this.children,
      child,
    });
  }

  public update({ newProps }: { newProps: TouchBarColorPickerProps }) {
    if (isEqual(newProps, this.props)) {
      return false;
    }

    this.props = newProps;
    this.updateInstance();

    // No rerender needed when color-picker props change.
    return false;
  }

  private getNativeArgs(): TouchBarColorPickerConstructorOptions {
    const { onChange, selected, ...props } = this.props;

    return {
      ...props,
      ...cleanReactProps(),
      change: onChange,
      selectedColor: selected,
      availableColors: this.children
        .map(child => child.createInstance())
        .filter(isTruthy),
    };
  }

  private updateInstance() {
    const args = this.getNativeArgs() as WithIndex;

    // Update instance.
    Object.keys(args).forEach(key => {
      if (this.instance && this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    return this.instance;
  }

  public createInstance() {
    const args = this.getNativeArgs();

    const NativeTouchBar = getNativeTouchBar();
    if (!NativeTouchBar) return null;

    this.instance = new NativeTouchBar.TouchBarColorPicker(args);

    return this.instance;
  }
}

export default TouchBarColorPicker;

interface TouchBarColorPickerProps extends ComponentProps {
  selected?: string;
  children?: TouchBarColor[];
  onChange?: (color: string) => void;
}

interface NativeTouchBarColorPickerWithIndex
  extends NativeTouchBarColorPicker,
    WithIndex {}
