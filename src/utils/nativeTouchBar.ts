import { TouchBar } from 'electron';

// This is a hacky workaround to solve a very simple problem.
// Atom packages doesn't get `electron` module. Only `remote`.
// But newer Electron applications doesn't get `remote`, just `electron`.
// To workaround this issue, I'm registering the instance here, and abstracting
// my hacky solution until I find a better idea.

let __NativeTouchBar__: Maybe<TouchBarType> = null;

export function setNativeTouchBar(NativeTouchBar: TouchBarType) {
  __NativeTouchBar__ = NativeTouchBar;
}

export function getNativeTouchBar() {
  return __NativeTouchBar__;
}

type TouchBarType = typeof TouchBar;
