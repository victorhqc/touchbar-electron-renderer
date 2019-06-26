import {
  TouchBarLabel as NativeTouchBarLabel,
  TouchBarLabelConstructorOptions,
} from 'electron';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import { getNativeTouchBar } from '../utils';
import { TouchbarElement } from './types';
import TouchBarText from './TouchBarText';

class TouchBarLabel implements TouchbarElement<Maybe<NativeTouchBarLabel>> {
  public id: string;
  private props: TouchBarLabelProps;
  private instance: Maybe<NativeTouchBarLabelIndex>;

  private constructor(props: TouchBarLabelProps) {
    this.props = props;
    this.id = uuidv4();

    this.instance = null;
  }

  public appendChild(text: TouchBarText): void {
    this.props.children = text;
  }

  public insertBefore(text: TouchBarText): void {
    this.props.children = text;
  }

  public removeChild() {
    this.props.children = undefined;
  }

  public update({ newProps }: { newProps: TouchBarLabelProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.props = newProps;
    this.updateInstance();

    // No rerender needed when props change.
    return false;
  }

  private getNativeArgs(): TouchBarLabelConstructorOptionsIndex {
    const { children, color, ...props } = this.props;

    return {
      ...props,
      textColor: color,
      label: (children && children.createInstance()) || '',
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

    this.instance = new NativeTouchBar.TouchBarLabel(args);
    return this.instance;
  }
}

export default TouchBarLabel;

export interface TouchBarLabelProps {
  children?: TouchBarText;
  color?: string;
}

interface TouchBarLabelConstructorOptionsIndex
  extends TouchBarLabelConstructorOptions,
    WithIndex {}
interface NativeTouchBarLabelIndex extends NativeTouchBarLabel, WithIndex {}
