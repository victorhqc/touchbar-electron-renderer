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
import { TouchbarElement } from './types';

class TouchBarColorPicker
  implements TouchbarElement<Maybe<NativeTouchBarColorPicker>> {
  public id: string;
  private props: TouchBarColorPickerProps;
  private instance: Maybe<NativeTouchBarColorPickerWithIndex>;

  private constructor(props: TouchBarColorPickerProps) {
    this.props = props;
    this.id = uuidv4();

    this.instance = null;
  }

  public appendChild(child: TouchBarColor): void {
    (this.props.children || []).push(child);
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
      return;
    }

    this.props = newProps;
    this.updateInstance();

    // No rerender needed when color-picker props change.
    return false;
  }

  private getNativeArgs(): TouchBarColorPickerConstructorOptionsWithIndex {
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
    const args = this.getNativeArgs();

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

interface TouchBarColorPickerProps {
  selected?: string;
  children?: TouchBarColor[];
  onChange?: (color: string) => void;
}

interface NativeTouchBarColorPickerWithIndex
  extends NativeTouchBarColorPicker,
    WithIndex {}
interface TouchBarColorPickerConstructorOptionsWithIndex
  extends TouchBarColorPickerConstructorOptions,
    WithIndex {}
