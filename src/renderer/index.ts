import Reconciler, { HostConfig as HostConfigType } from 'react-reconciler';
import { ReactElement } from 'react';

import {
  TouchBarText,
  TouchBar,
  ComponentProps,
  AnyTouchBarComponent,
  TouchBarType,
} from '../components';
import createTouchBarElement from '../createTouchBarElement';
import { Maybe } from '../utils';

let isReRenderNeeded = false;
const HostConfig: HostConfigType<
  TouchBarType,
  ComponentProps,
  TouchBar,
  Maybe<AnyTouchBarComponent>,
  TouchBarText,
  {},
  {},
  {},
  {},
  [],
  ReturnType<typeof setTimeout>,
  boolean
> = {
  now: Date.now,
  supportsMutation: true,
  supportsPersistence: false,
  noTimeout: false,
  isPrimaryRenderer: true,
  supportsHydration: false,
  getPublicInstance: function getPublicInstance() {
    return {};
  },
  getRootHostContext: function getRootHostContext() {
    return {};
  },
  getChildHostContext: function getChildHostContext() {
    return {};
  },
  shouldSetTextContent: function shouldSetTextContent() {
    return false;
  },
  // scheduleTimeout: setTimeout,
  // cancelTimeout: clearTimeout,
  scheduleDeferredCallback: (callback, options) => {
    setTimeout(() => callback(), options ? options.timeout : 0);
  },
  // scheduleDeferredCallback: setTimeout,
  cancelDeferredCallback: clearTimeout,
  setTimeout,
  clearTimeout,
  createTextInstance: function createTextInstance(newText: string) {
    return new TouchBarText(newText);
  },
  createInstance: function createInstance(
    type: TouchBarType,
    newProps: ComponentProps,
  ) {
    return createTouchBarElement(type, newProps);
  },
  appendInitialChild: function appendInitialChild(
    parent: AnyTouchBarComponent,
    child: AnyTouchBarComponent,
  ) {
    parent.appendChild(child);
  },
  finalizeInitialChildren: function finalizeInitialChildren() {
    return true;
  },
  prepareForCommit: function prepareForCommit() {
    // do nothing.
  },
  resetAfterCommit: function resetAfterCommit(root: TouchBar) {
    root.refreshTree(isReRenderNeeded);
    isReRenderNeeded = false;
  },
  appendChildToContainer: function appendChildToContainer(
    parent: AnyTouchBarComponent,
    child: AnyTouchBarComponent,
  ) {
    parent.appendChild(child);
  },
  appendChild: function appendChild(
    parent: AnyTouchBarComponent,
    child: AnyTouchBarComponent,
  ) {
    parent.appendChild(child);
  },
  insertBefore: function insertBefore(
    parent: AnyTouchBarComponent,
    child: AnyTouchBarComponent,
    beforeChild: AnyTouchBarComponent,
  ) {
    // parentInstance, child, beforeChild
    parent.insertBefore(child, beforeChild);
  },
  removeChild: function removeChild(
    parent: AnyTouchBarComponent,
    child: AnyTouchBarComponent,
  ) {
    // parentInstance, child
    parent.removeChild(child);
  },
  removeChildFromContainer: function removeChildFromContainer(
    container: AnyTouchBarComponent,
    child: AnyTouchBarComponent,
  ) {
    // container, child
    container.removeChild(child);
  },
  insertInContainerBefore: function insertInContainerBefore(
    container: AnyTouchBarComponent,
    child: AnyTouchBarComponent,
    beforeChild: AnyTouchBarComponent,
  ) {
    container.insertBefore(child, beforeChild);
  },
  prepareUpdate: function prepareUpdate(
    _instance,
    _type,
    oldProps: ComponentProps,
    newProps: ComponentProps,
  ) {
    // A prop was deleted or deleted.
    if (
      Object.keys(oldProps).length > Object.keys(newProps).length ||
      Object.keys(oldProps).length < Object.keys(newProps).length
    ) {
      return newProps;
    }

    const diff = Object.keys(oldProps).reduce((prev, key) => {
      if (oldProps[key] !== newProps[key]) {
        return {
          ...prev,
          [key]: newProps[key],
        };
      }

      return prev;
    }, {});

    if (Object.keys(diff).length > 0) {
      return diff;
    }

    return {};
  },
  commitUpdate: function commitUpdate(
    instance: AnyTouchBarComponent,
    _updatePayload: {},
    type: TouchBarType,
    oldProps: ComponentProps,
    newProps: ComponentProps,
  ) {
    const forceRerender = instance.update({ type, newProps, oldProps });

    if (forceRerender) {
      isReRenderNeeded = true;
    }
  },
  // TODO: Figure out how passive effects work. This dummy callbacks somehow work but no idea why
  // or how.
  // schedulePassiveEffects: function schedulePassiveEffects(wrapped: Function) {
  //   return wrapped();
  // },
  // cancelPassiveEffects: function cancelPassiveEffects() {
  //   // do nothing.
  // },
  commitTextUpdate: function commitTextUpdate(
    textInstance: TouchBarText,
    _oldText: string,
    newText: string,
  ) {
    textInstance.replaceText(newText);
  },
  commitMount: function commitMount() {
    // do nothing.
  },
  resetTextContent: function resetTextContent() {
    // do nothing.
  },
  shouldDeprioritizeSubtree: function shouldDeprioritizeSubtree(
    _type: TouchBarType,
    nextProps: ComponentProps,
  ) {
    return !!nextProps.hidden;
  },
};

const reconcilerInstance = Reconciler(HostConfig);

const TouchBarRenderer = {
  render(element: ReactElement, renderDom: any, callback: () => void) {
    // element: This is the react element for App component
    // renderDom: This is the host root element to which the rendered app will be attached.
    // callback: if specified will be called after render is done.

    // Disables async rendering, read more about it here:
    // https://github.com/facebook/react/issues/13206#issuecomment-407535077
    const isAsync = false;
    const hydrate = false;

    // Creates root fiber node.
    const container = reconcilerInstance.createContainer(
      renderDom,
      isAsync,
      hydrate,
    );

    // Since there is no parent (since this is the root fiber). We set parentComponent to null.
    const parentComponent = null;

    // Start reconcilation and render the result
    reconcilerInstance.updateContainer(
      element,
      container,
      parentComponent,
      callback,
    );
  },
};

export default TouchBarRenderer;
