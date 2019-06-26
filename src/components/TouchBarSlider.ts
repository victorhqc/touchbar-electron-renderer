import {
  TouchBarSlider as NativeTouchBarSlider,
  TouchBarSliderConstructorOptions,
} from 'electron';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import debounce from 'lodash/debounce';

import { getNativeTouchBar } from '../utils';
import TouchBarText from './TouchBarText';
import { ComponentProps, NativeTouchBarComponent } from './types';

class TouchBarSlider implements NativeTouchBarComponent {
  public id: string;
  private props: TouchBarSliderProps;
  private instance: Maybe<NativeTouchBarSliderIndex>;
  private children: TouchBarText | undefined;

  public constructor({ children, ...props }: TouchBarSliderProps) {
    this.id = uuidv4();
    this.props = props;
    this.children = children;

    this.instance = null;
  }

  public update({ newProps }: { newProps: TouchBarSliderProps }) {
    if (isEqual(newProps, this.props)) {
      return false;
    }

    this.props = newProps;
    return this.updateInstance();
  }

  public appendChild(child: TouchBarText) {
    this.children = child;
  }

  public insertBefore(child: TouchBarText) {
    this.appendChild(child);
  }

  public removeChild() {
    this.children = undefined;
  }

  private getNativeArgs(): TouchBarSliderConstructorOptions {
    const { onChange, ...props } = this.props;

    return {
      ...props,
      label: this.children && this.children.createInstance(),
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

export interface TouchBarSliderProps extends ComponentProps {
  children?: TouchBarText;
  debounceTime?: number;
  onChange?: (newValue: number) => void;
  value?: number;
  minValue?: number;
  maxValue?: number;
}

interface NativeTouchBarSliderIndex extends NativeTouchBarSlider, WithIndex {}
