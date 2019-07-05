import { SegmentedControlSegment, NativeImage } from 'electron';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import TouchBarText from './TouchBarText';
import { ComponentProps, InternalTouchBarComponent } from './types';
import { Maybe, WithIndex } from '../utils';

export default class TouchBarSegment implements InternalTouchBarComponent {
  public id: string;
  private props: TouchBarSegmentProps;
  private instance: Maybe<SegmentedControlSegmentIndex>;
  private children: TouchBarText | undefined;

  public constructor({ children, ...props }: TouchBarSegmentProps) {
    this.id = uuidv4();
    this.props = props;
    this.children = children;

    this.instance = null;
  }

  public update({ newProps }: { newProps: TouchBarSegmentProps }) {
    if (isEqual(newProps, this.props)) {
      return false;
    }

    this.props = newProps;
    return this.updateInstance();
  }

  public appendChild(label: TouchBarText) {
    this.children = label;
  }

  public insertBefore(label: TouchBarText) {
    this.appendChild(label);
  }

  public replaceText(label: TouchBarText) {
    this.appendChild(label);
  }

  public removeChild() {
    this.children = undefined;
  }

  private getNativeArgs(): SegmentedControlSegmentIndex {
    const { disabled, ...props } = this.props;

    return {
      ...props,
      enabled: disabled ? false : true, // When disabled is truthy, then `enabled` is false.
      label: this.children && this.children.createInstance(),
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

    // When an update happens in a segment, a hard re-render is needed*
    return true;
  }

  public createInstance() {
    const args = this.getNativeArgs();

    this.instance = args;
    return this.instance;
  }
}

export interface TouchBarSegmentProps extends ComponentProps {
  children?: TouchBarText;
  disabled?: boolean;
  icon?: NativeImage;
}

interface SegmentedControlSegmentIndex
  extends SegmentedControlSegment,
    WithIndex {}
