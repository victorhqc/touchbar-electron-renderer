// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import uuidv4 from 'uuid/v4';
import isEqual from 'lodash/isEqual';

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
    this.setProps(props);
    this.id = uuidv4();

    this.instance = null;
  }

  setProps(props) {
    this.props = props;
  }

  update({ newProps }) {
    if (isEqual(newProps, this.props)) {
      return;
    }

    this.setProps(newProps);
    return this.updateInstance();
  }

  appendChild() {}

  insertBefore() {}

  removeChild() {}

  getNativeArgs() {
    const { size, small, large, flexible, ...props } = this.props;

    const sizeByProps = getSize({ small, large, flexible });

    return {
      ...props,
      size: sizeByProps || size,
    };
  }

  updateInstance() {
    // Hard re-render needed.
    return true;
  }

  createInstance() {
    const args = this.getNativeArgs();
    console.log('ARGS', args)

    // TODO: Electron & remote are needed to support Atom. This is just a workaround.
    if (NativeTouchBar) {
      this.instance = new NativeTouchBar.TouchBarSpacer(args);
    } else {
      this.instance = new RemoteTouchBar.TouchBarSpacer(args);
    }

    return this.instance;
  }
}

export default TouchBarSpacer;
