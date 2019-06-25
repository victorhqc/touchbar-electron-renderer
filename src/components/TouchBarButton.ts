import { NativeImage } from 'electron'
import uuidv4 from 'uuid/v4';

import { buildChild, getNativeTouchBar } from '../utils';

class TouchBarButton {
  id: string;
  props: TouchBarButtonProps;
  child: Maybe<string>;
  instance: Maybe<TouchBarButton>;

  constructor(props: TouchBarButtonProps) {
    this.props = props;
    this.id = uuidv4();

    // TouchBarButton can have only one child.
    this.child = null;
    this.instance = null;
  }

  /**
   * TouchBarButton can only have text children.
   * @param  {stting} child
   * @return {void}
   */
  appendChild(child: string): void {
    this.child = child;
  }

  insertBefore(child: string) {
    return this.appendChild(child);
  }

  removeChild() {
    this.child = null;
  }

  update({ newProps }: { newProps: TouchBarButtonProps }) {
    this.props = newProps;
    this.updateInstance();

    // No Rerender needed when button props update.
    return false;
  }

  getNativeArgs() {
    const {
      // TODO: check if this is needed.
      // children,
      onClick,
      icon,
      ...props
    } = this.props;

    return {
      ...props,
      label: this.child && buildChild(this.child),
      icon,
      click: onClick,
    };
  }

  updateInstance() {
    const args = this.getNativeArgs();

    // Update instance.
    Object.keys(args).forEach((key) => {
      if (!this.instance) return;

      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });
  }

  createInstance() {
    const args = this.getNativeArgs();

    const NativeTouchBar = getNativeTouchBar();
    this.instance = new NativeTouchBar.TouchBarButton(args);
    return this.instance;
  }
}

export default TouchBarButton;

export interface TouchBarButtonProps {
  onClick: MaybeUndefined<() => void>,
  icon: Maybe<NativeImage>,
  // children: MaybeUndefined<string[]>
}
