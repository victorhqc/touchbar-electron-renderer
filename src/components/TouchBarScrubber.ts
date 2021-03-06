import {
  TouchBarScrubber as NativeTouchBarScrubber,
  ScrubberItem,
  TouchBarScrubberConstructorOptions,
} from 'electron';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import uuidv4 from 'uuid/v4';

import {
  insertBeforeChild,
  removeChild,
  getNativeTouchBar,
  cleanReactProps,
  Maybe,
  WithIndex,
} from '../utils';
import TouchBarScrubItem from './TouchBarScrubItem';
import { ComponentProps, NativeTouchBarComponent } from './types';

const nop = () => {};

class TouchBarScrubber implements NativeTouchBarComponent {
  public id: string;
  private props: TouchBarScrubberProps;
  private didChildrenChange: boolean;
  private instance: Maybe<NativeTouchBarScrubberIndex>;
  private builtChildrenInstances: ScrubberItem[];
  private children: TouchBarScrubItem[];

  public constructor(props: TouchBarScrubberProps) {
    this.id = uuidv4();
    this.props = props;
    this.children = [];
    this.didChildrenChange = false;
    this.instance = null;
    this.builtChildrenInstances = [];
  }

  public update({ newProps }: { newProps: TouchBarScrubberProps }) {
    if (isEqual(newProps, this.props)) {
      return false;
    }

    this.props = newProps;
    return this.updateInstance();
  }

  public appendChild(child: TouchBarScrubItem) {
    this.didChildrenChange = true;
    this.children.push(child);
  }

  public insertBefore(
    newChild: TouchBarScrubItem,
    beforeChild: TouchBarScrubItem,
  ) {
    this.didChildrenChange = true;
    this.children = insertBeforeChild({
      children: this.children,
      newChild,
      beforeChild,
    });
  }

  public removeChild(child: TouchBarScrubItem) {
    this.didChildrenChange = true;
    this.children = removeChild({
      children: this.children,
      child,
    });
  }

  private getNativeArgs(buildItems = true): TouchBarScrubberConstructorOptions {
    const {
      onSelect,
      onHighlight,
      debounceTime,
      selectedStyle,
      overlayStyle,
      continuous,
      showArrowButtons,
      mode,
      ...props
    } = this.props;

    this.builtChildrenInstances = !buildItems
      ? this.builtChildrenInstances
      : this.children.map(child => child.createInstance());

    return {
      ...props,
      ...cleanReactProps(),
      // If not debounced, it causes serious performance issues
      select: (onSelect && debounce(onSelect, debounceTime || 250)) || nop,
      highlight:
        (onHighlight && debounce(onHighlight, debounceTime || 250)) || nop,
      items: this.builtChildrenInstances,
      selectedStyle: selectedStyle || '',
      overlayStyle: overlayStyle || '',
      mode: mode || '',
      continuous: continuous || false,
      showArrowButtons: showArrowButtons || false,
    };
  }

  private updateInstance() {
    // this.didChildrenChange = true;
    let isRerenderNeeded = false;
    const args = this.getNativeArgs(false) as WithIndex;

    // Update new/deleted items
    if (this.didChildrenChange) {
      isRerenderNeeded = true;
    }

    // Update instance.
    Object.keys(args).forEach(key => {
      // Avoid updating functions as there's not a really easy way to know if they changed.
      if (key === 'select' || key === 'highlight' || key === 'items') {
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

    this.instance = new NativeTouchBar.TouchBarScrubber(args);
    return this.instance;
  }
}

export default TouchBarScrubber;

export interface TouchBarScrubberProps extends ComponentProps {
  children?: TouchBarScrubItem[];
  onSelect?: (index: number) => void;
  onHighlight?: (index: number) => void;
  debounceTime?: number;
  selectedStyle?: Style;
  overlayStyle?: Style;
  showArrowButtons?: boolean;
  mode?: Mode;
  continuous?: boolean;
}

export enum Style {
  Background = 'background',
  Outline = 'outline',
}

export enum Mode {
  Fixed = 'fixed',
  Free = 'free',
}

interface NativeTouchBarScrubberIndex
  extends NativeTouchBarScrubber,
    WithIndex {}
