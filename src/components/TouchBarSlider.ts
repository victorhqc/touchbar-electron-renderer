import {
  TouchBarSlider as NativeTouchBarSlider,
  TouchBarSliderConstructorOptions,
} from 'electron';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import debounce from 'lodash/debounce';

import { getNativeTouchBar } from '../utils';
import TouchBarText from './TouchBarText';
import { TouchbarElement } from './types';

class TouchBarSlider implements TouchbarElement<Maybe<NativeTouchBarSlider>> {
  public id: string;
  private props: TouchBarSliderProps;
  private instance: Maybe<NativeTouchBarSliderIndex>;

  private constructor(props: TouchBarSliderProps) {
    this.id = uuidv4();
    this.props = props;

    this.instance = null;
  }

  public update({ newProps }: { newProps: TouchBarSliderProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.props = newProps;
    return this.updateInstance();
  }

  public appendChild(child: TouchBarText) {
    this.props.children = child;
  }

  public insertBefore(child: TouchBarText) {
    this.appendChild(child);
  }

  public removeChild() {
    this.props.children = undefined;
  }

  private getNativeArgs(): TouchBarSliderConstructorOptions {
    const { children, onChange, ...props } = this.props;

    return {
      ...props,
      label: children && children.createInstance(),
      // If not debounced, it causes serious performance issues
      change: onChange && debounce(onChange, props.debounceTime || 0),
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

    return false;
  }

  public createInstance() {
    const args = this.getNativeArgs();

    const NativeTouchBar = getNativeTouchBar();
    if (!NativeTouchBar) return null;

    this.instance = new NativeTouchBar.TouchBarSlider(args);
    return this.instance;
  }
}

export default TouchBarSlider;

export interface TouchBarSliderProps {
  children?: TouchBarText;
  debounceTime?: number;
  onChange?: (newValue: number) => void;
  value?: number;
  minValue?: number;
  maxValue?: number;
}

interface NativeTouchBarSliderIndex extends NativeTouchBarSlider, WithIndex {}
