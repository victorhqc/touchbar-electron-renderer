import { SegmentedControlSegment } from 'electron';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import TouchBarText from './TouchBarText';
import { TouchbarElement } from './types';

export default class TouchBarSegment
  implements TouchbarElement<Maybe<SegmentedControlSegment>> {
  public id: string;
  private props: TouchBarSegmentProps;
  private instance: Maybe<SegmentedControlSegmentIndex>;

  private constructor(props: TouchBarSegmentProps) {
    this.id = uuidv4();
    this.props = props;

    this.instance = null;
  }

  public update({ newProps }: { newProps: TouchBarSegmentProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.props = newProps;
    return this.updateInstance();
  }

  public appendChild(label: TouchBarText) {
    this.props.children = label;
  }

  public insertBefore(label: TouchBarText) {
    this.appendChild(label);
  }

  public replaceText(label: TouchBarText) {
    this.appendChild(label);
  }

  public removeChild() {
    this.props.children = undefined;
  }

  private getNativeArgs(): SegmentedControlSegmentIndex {
    const { children, disabled, ...props } = this.props;

    return {
      ...props,
      enabled: disabled ? false : true, // When disabled is truthy, then `enabled` is false.
      label: children && children.createInstance(),
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

export interface TouchBarSegmentProps {
  children?: TouchBarText;
  disabled?: boolean;
}

interface SegmentedControlSegmentIndex
  extends SegmentedControlSegment,
    WithIndex {}
