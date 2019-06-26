import { TouchBarLabel as NativeTouchBarLabel, TouchBarLabelConstructorOptions } from 'electron';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import { getNativeTouchBar } from '../utils';
import { TouchbarElement } from './types';
import TouchBarText from './TouchBarText';

class TouchBarLabel implements TouchbarElement<Maybe<NativeTouchBarLabel>> {
  id: string;
  props: TouchBarLabelProps;
  text: Maybe<TouchBarText>;
  instance: Maybe<NativeTouchBarLabelIndex>;

  constructor({ children, ...props }: TouchBarLabelProps) {
    this.props = props;
    this.id = uuidv4();

    // TouchBarLabel can have only one child.
    this.text = children || null;
    this.instance = null;
  }

  /**
   * TouchBarLabel can only have text children.
   * @param  {stting} text
   * @return {void}
   */
  appendChild(text: TouchBarText): void {
    this.text = text;
  }

  insertBefore(text: TouchBarText): void {
    this.text = text;
  }

  removeChild() {
    this.text = null;
  }

  update({ newProps }: { newProps: TouchBarLabelProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.props = newProps;
    this.updateInstance();

    // No rerender needed when props change.
    return false;
  }

  getNativeArgs(): TouchBarLabelConstructorOptionsIndex {
    const { children, color, ...props } = this.props;

    return {
      ...props,
      textColor: color,
      label: (this.text && this.text.createInstance()) || '',
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

    this.instance = new NativeTouchBar.TouchBarLabel(args);
    return this.instance;
  }
}

export default TouchBarLabel;

export interface TouchBarLabelProps {
  children?: TouchBarText;
  color?: string;
};

interface TouchBarLabelConstructorOptionsIndex extends TouchBarLabelConstructorOptions, WithIndex {};
interface NativeTouchBarLabelIndex extends NativeTouchBarLabel, WithIndex {};
