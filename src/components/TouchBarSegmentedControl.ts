import {
  TouchBarSegmentedControl as NativeTouchBarSegmentedControl,
  SegmentedControlSegment,
  TouchBarSegmentedControlConstructorOptions,
} from 'electron';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import { insertBeforeChild, removeChild, getNativeTouchBar } from '../utils';
import TouchBarSegment from './TouchBarSegment';
import { TouchbarElement } from './types';

const nop = () => {};

export default class TouchBarSegmentedControl
  implements TouchbarElement<Maybe<NativeTouchBarSegmentedControl>> {
  public id: string;
  private props: TouchBarSegmentedControlProps;
  private instance: Maybe<NativeTouchBarSegmentedControlIndex>;
  private didChildrenChange: boolean;
  private builtChildrenInstances: SegmentedControlSegment[];

  private constructor(props: TouchBarSegmentedControlProps) {
    this.id = uuidv4();
    this.props = props;

    this.instance = null;
    this.didChildrenChange = false;
    this.builtChildrenInstances = [];
  }

  public update({ newProps }: { newProps: TouchBarSegmentedControlProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.props = newProps;
    return this.updateInstance();
  }

  public appendChild(child: TouchBarSegment) {
    if (!this.props.children) {
      this.props.children = [];
    }

    this.props.children.push(child);
    this.didChildrenChange = true;
  }

  public insertBefore(newChild: TouchBarSegment, beforeChild: TouchBarSegment) {
    if (!this.props.children) {
      this.props.children = [];
    }

    this.props.children = insertBeforeChild({
      children: this.props.children,
      newChild,
      beforeChild,
    });
    this.didChildrenChange = true;
  }

  public removeChild(child: TouchBarSegment) {
    if (!this.props.children) {
      this.props.children = [];
    }

    this.props.children = removeChild({
      children: this.props.children,
      child,
    });
    this.didChildrenChange = true;
  }

  private getSegments(buildItems: boolean) {
    if (!buildItems) {
      return this.builtChildrenInstances;
    }

    return (this.props.children || []).map(child => child.createInstance());
  }

  private getNativeArgs(
    buildItems = true,
  ): TouchBarSegmentedControlConstructorOptions {
    const { onChange, selected, ...props } = this.props;

    return {
      ...props,
      change: onChange || nop,
      selectedIndex: selected,
      segments: this.getSegments(buildItems),
    };
  }

  private updateInstance() {
    let isRerenderNeeded = false;
    if (this.didChildrenChange) {
      isRerenderNeeded = true;
    }

    const args = this.getNativeArgs(false) as WithIndex;

    // Update instance.
    Object.keys(args).forEach(key => {
      if (key === 'items' || key === 'segments') {
        return;
      }

      if (this.instance && this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    this.didChildrenChange = false;
    return isRerenderNeeded;
  }

  public createInstance() {
    const args = this.getNativeArgs();

    const NativeTouchBar = getNativeTouchBar();
    if (!NativeTouchBar) return null;
    this.instance = new NativeTouchBar.TouchBarSegmentedControl(args);

    this.didChildrenChange = false;
    return this.instance;
  }
}

export interface TouchBarSegmentedControlProps {
  children?: TouchBarSegment[];
  onChange?: (selectedIndex: number, isSelected: boolean) => void;
  selected?: number;
  segmentStyle?:
    | 'automatic'
    | 'rounded'
    | 'textured-rounded'
    | 'round-rect'
    | 'textured-square'
    | 'capsule'
    | 'small-square'
    | 'separated';
  mode?: 'single' | 'multiple' | 'buttons';
}

interface NativeTouchBarSegmentedControlIndex
  extends NativeTouchBarSegmentedControl,
    WithIndex {}
