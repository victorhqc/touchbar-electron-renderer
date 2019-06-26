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
} from '../utils';
import TouchBarColor from './TouchBarColor';
import { ComponentProps, NativeTouchBarComponent } from './types';

class TouchBarColorPicker implements NativeTouchBarComponent {
  public id: string;
  private props: TouchBarColorPickerProps;
  private instance: Maybe<NativeTouchBarColorPickerWithIndex>;

  public constructor(props: TouchBarColorPickerProps) {
    this.props = props;
    this.id = uuidv4();

    this.instance = null;
  }

  public appendChild(child: TouchBarColor): void {
    if (!this.props.children) {
      this.props.children = [];
    }

    this.props.children.push(child);
  }

  public insertBefore(newChild: TouchBarColor, beforeChild: TouchBarColor) {
    this.props.children = insertBeforeChild({
      children: this.props.children || [],
      newChild,
      beforeChild,
    });
  }

  public removeChild(child: TouchBarColor) {
    this.props.children = removeChild({
      children: this.props.children || [],
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
    const { children, onChange, selected, ...props } = this.props;

    return {
      ...props,
      change: onChange,
      selectedColor: selected,
      availableColors: (children || [])
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
