import {
  TouchBarSpacer as NativeTouchBarSpacer,
  TouchBarSpacerConstructorOptions,
} from 'electron';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import { getNativeTouchBar } from '../utils';
import { ComponentProps, TouchbarElement } from './types';

const getSize = ({ small, large, flexible }: TouchBarSpacerProps) => {
  if (small) {
    return 'small';
  }

  if (large) {
    return 'large';
  }

  if (flexible) {
    return 'flexible';
  }

  return undefined;
};

class TouchBarSpacer implements TouchbarElement<TouchBarSpacerProps> {
  public id: string;
  private props: TouchBarSpacerProps;
  private instance: Maybe<NativeTouchBarSpacerIndex>;

  public constructor(props: TouchBarSpacerProps) {
    this.id = uuidv4();
    this.props = props;

    this.instance = null;
  }

  public update({ newProps }: { newProps: TouchBarSpacerProps }) {
    if (isEqual(newProps, this.props)) {
      return false;
    }

    this.props = newProps;
    return this.updateInstance();
  }

  public appendChild() {}

  public insertBefore() {}

  public removeChild() {}

  private getNativeArgs(): TouchBarSpacerConstructorOptions {
    const { small, large, flexible, ...props } = this.props;

    const sizeByProps = getSize({ small, large, flexible });

    return {
      ...props,
      size: sizeByProps,
    };
  }

  public updateInstance() {
    // Hard re-render needed.
    return true;
  }

  public createInstance() {
    const args = this.getNativeArgs();

    const NativeTouchBar = getNativeTouchBar();
    if (!NativeTouchBar) return null;

    this.instance = new NativeTouchBar.TouchBarSpacer(args);
    return this.instance;
  }
}

export default TouchBarSpacer;

export interface TouchBarSpacerProps extends ComponentProps {
  small?: boolean;
  large?: boolean;
  flexible?: boolean;
}

interface NativeTouchBarSpacerIndex extends NativeTouchBarSpacer, WithIndex {}
