// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import uuidv4 from 'uuid/v4';

// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { TouchBar: NativeTouchBar } = electron || {};
const { TouchBar: RemoteTouchBar } = remote || {};

const getSize = ({ small, large, flexible }) => {
  if (small) {
    return 'small';
  }

  if (large) {
    return 'large';
  }

  if (flexible) {
    return 'flexible';
  }

  return false;
}

class TouchBarSpacer {
  constructor(props) {
    this.props = props;
    this.id = uuidv4();

    this.instance = null;
  }

  appendChild() {}

  insertBefore() {}

  removeChild() {}

  updateProps(newProps) {
    this.props = newProps;
  }

  getNativeArgs() {
    const { size, small, large, flexible, ...props } = this.props;

    const sizeByProps = getSize({ small, large, flexible });

    return {
      ...props,
      size: sizeByProps || size,
    };
  }

  createInitialInstance() {
    const args = this.getNativeArgs();

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    if (NativeTouchBar) {
      this.instance = new NativeTouchBar.TouchBarSpacer(args);
    } else {
      this.instance = new RemoteTouchBar.TouchBarSpacer(args);
    }

    return this.instance;
  }

  updateInstance() {
    const args = this.getNativeArgs();

    // Update instance.
    Object.keys(args).forEach((key) => {
      if (this.instance[key] !== args[key]) {
        this.instance[key] = args[key];
      }
    });

    return this.instance;
  }

  createInstance() {
    if (!this.instance) {
      return this.createInitialInstance();
    }

    return this.updateInstance();
  }
}

export default TouchBarSpacer;
