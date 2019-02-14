// TODO: Electron & remote are needed to support Atom. This is just a workaround.
import electron from 'electron';
import remote from 'remote';
import get from 'lodash/get';

// TODO: Electron & remote are needed to support Atom. This is just a workaround.
const { NativeImage } = electron || {};
const { NativeImage: RemoteNativeImage } = remote || {};

export function isValidIcon(icon) {
  if (get(icon, 'constructor.name') === 'NativeImage') {
    return true;
  }

  return false;
}
