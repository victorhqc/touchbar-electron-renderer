import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';
import { TouchBarColorPicker as NativeTouchBarColorPicker, TouchBarColorPickerConstructorOptions } from 'electron';

import { insertBeforeChild, removeChild, getNativeTouchBar } from '../utils';
import TouchBarColor from './TouchBarColor';
import { TouchbarElement } from './types';

function isValidChild(child: TouchBarColor) {
  if (!child as any instanceof TouchBarColor) {
    console.warn('<color-picker /> Can only have <color /> as children.');
    return false;
  }

  return true;
}

class TouchBarColorPicker implements TouchbarElement<Maybe<NativeTouchBarColorPicker>> {
  props: TouchBarColorPickerProps;
  id: string;
  children: TouchBarColor[];
  instance: Maybe<NativeTouchBarColorPickerWithIndex>;

  constructor({ children, ...props }: TouchBarColorPickerProps) {
    this.props = props;
    this.id = uuidv4();

    this.children = children || [];
    this.instance = null;
  }


  /**
   * TouchBarColorPicker can only have <color /> children.
   * @param  {stting} child
   * @return {void}
   */
  appendChild(child: TouchBarColor): void {
    if (!isValidChild(child)) {
      return;
    }

    this.children.push(child);
  }

  insertBefore(newChild: TouchBarColor, beforeChild: TouchBarColor) {
    if (!isValidChild(newChild)) {
      return;
    }

    this.children = insertBeforeChild({
      children: this.children,
      newChild,
      beforeChild,
    });
  }

  removeChild(child: TouchBarColor) {
    this.children = removeChild({
      children: this.children,
      child,
    });
  }

  update({ newProps }: { newProps: TouchBarColorPickerProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.props = newProps;
    this.updateInstance();

    // No rerender needed when color-picker props change.
    return false;
  }

  getNativeArgs(): TouchBarColorPickerConstructorOptionsWithIndex {
    const { children, onChange, selected, ...props } = this.props;

    return {
      ...props,
      change: onChange,
      selectedColor: selected,
      availableColors: this.children
        .map(child => child.createInstance())
    };
  }

  updateInstance() {
    const args = this.getNativeArgs();

    // Update instance.
    Object.keys(args).forEach((key) => {
      if (this.instance && this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    return this.instance;
  }

  createInstance() {
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
  onChange?: (color: string) => void
}

interface NativeTouchBarColorPickerWithIndex extends NativeTouchBarColorPicker, WithIndex {}
interface TouchBarColorPickerConstructorOptionsWithIndex extends TouchBarColorPickerConstructorOptions, WithIndex {}
