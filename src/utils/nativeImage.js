import get from 'lodash/get';

export function isValidIcon(icon) {
  if (get(icon, 'constructor.name') === 'NativeImage') {
    return true;
  }

  return false;
}
