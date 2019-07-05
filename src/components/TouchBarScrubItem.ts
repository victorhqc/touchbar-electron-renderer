import { ScrubberItem, NativeImage } from 'electron';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

import TouchBarText from './TouchBarText';
import { ComponentProps, InternalTouchBarComponent } from './types';
import { Maybe, WithIndex } from '../utils';

class TouchBarScrubItem implements InternalTouchBarComponent {
  public id: string;
  private props: TouchBarScrubItemProps;
  private instance: Maybe<ScrubberItemIndex>;
  private children: TouchBarText | undefined;

  public constructor({ children, ...props }: TouchBarScrubItemProps) {
    this.id = uuidv4();
    this.props = props;
    this.children = children;
    this.instance = null;
  }

  public appendChild(child: TouchBarText): void {
    this.children = child;
  }

  public insertBefore(child: TouchBarText): void {
    return this.appendChild(child);
  }

  public removeChild() {
    this.children = undefined;
  }

  public update({ newProps }: { newProps: TouchBarScrubItemProps }) {
    if (isEqual(newProps, this.props)) {
      return false;
    }

    this.props = newProps;
    this.updateInstance();

    // No rerender needed when color-picker props change.
    return false;
  }

  private getNativeArgs(): ScrubberItemIndex {
    return {
      ...this.props,
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

    return this.instance;
  }

  public createInstance() {
    this.instance = {
      ...this.props,
      label: this.children && this.children.createInstance(),
    };

    return this.instance;
  }
}

export default TouchBarScrubItem;

export interface TouchBarScrubItemProps extends ComponentProps {
  children?: TouchBarText;
  icon?: NativeImage;
}

interface ScrubberItemIndex extends ScrubberItem, WithIndex {}
