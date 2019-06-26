import { ScrubberItem, NativeImage } from 'electron';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import TouchBarText from './TouchBarText';
import { TouchbarElement } from './types';

class TouchBarScrubItem implements TouchbarElement<Maybe<ScrubberItem>> {
  id: string;
  props: TouchBarScrubItemProps;
  instance: Maybe<ScrubberItemIndex>;

  constructor(props: TouchBarScrubItemProps) {
    this.id = uuidv4();
    this.props = props;
    this.instance = null;
  }

  appendChild(child: TouchBarText): void {
    this.props.children = child;
  }

  insertBefore(child: TouchBarText): void {
    return this.appendChild(child);
  }

  removeChild() {
    this.props.children = undefined;
  }

  update({ newProps }: { newProps: TouchBarScrubItemProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.props = newProps;
    this.updateInstance();

    // No rerender needed when color-picker props change.
    return false;
  }

  getNativeArgs(): ScrubberItemIndex {
    const { children, ...props } = this.props;

    return {
      ...props,
      label: children && children.createInstance(),
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
    const { children, ...props } = this.props;

    this.instance = {
      ...props,
      label: (children && children.createInstance()) || '',
    };

    return this.instance;
  }
}

export default TouchBarScrubItem;

export interface TouchBarScrubItemProps {
  children?: TouchBarText;
  icon?: NativeImage;
};

interface ScrubberItemIndex extends ScrubberItem, WithIndex {};
