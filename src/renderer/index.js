import Reconciler from 'react-reconciler';
import { TouchBar as NativeTouchBar, nativeImage } from 'electron';
import difference from 'lodash/difference';
import some from 'lodash/some';

import { TouchBarButton } from '../components';
import createTouchBarElement from '../createTouchBarElement';

const {
  TouchBarGroup,
  TouchBarPopover,
  TouchBarScrubber,
} = NativeTouchBar;

// function createTouchBarElement(type, newProps) {
//   switch (type) {
//     case 'group':
//       return new TouchBarGroup(newProps);
//     case 'touch-button':
//       return createTouchBarButton(type, newProps);
//     case 'popover':
//       return new TouchBarPopover(newProps);
//     case 'scrubber':
//       return new TouchBarScrubber(newProps);
//     default:
//       console.warn(`Component with type: ${type} is not supported`);
//       return null;
//   }
// }

const HostConfig = {
  now: Date.now,
  supportsMutation: true,
  getRootHostContext: function getRootHostContext() {
    return {};
  },
  getChildHostContext: function getChildHostContext() {
    return {};
  },
  shouldSetTextContent: function shouldSetTextContent() {
    return false;
  },
  createTextInstance: function createTextInstance() {
    // return newText;
  },
  createInstance: function createInstance(type, newProps) {
    return createTouchBarElement(type, newProps);
  },
  appendInitialChild: function appendInitialChild(parent, child) {
    parent.appendChild(child);
  },
  finalizeInitialChildren: function finalizeInitialChildren() {
    return {};
  },
  prepareForCommit: function prepareForCommit() {},
  resetAfterCommit: function resetAfterCommit(root) {
    root.createInstance();
  },
  commitMount: function commitMount() {},
  appendChildToContainer: function appendChildToContainer(parent, child) { // parentInstance, child
    parent.appendChild(child);
  },
  appendChild: function appendChild(...args) { // parentInstance, child
    // console.log('appendChild', ...args);
  },
  insertBefore: function insertBefore(...args) { // parentInstance, child, beforeChild
    // console.log('insertBefore', ...args);
  },
  removeChild: function removeChild(...args) { // parentInstance, child
    // console.log('removeChild', ...args);
  },
  removeChildFromContainer: function removeChildFromContainer(...args) { // container, child
    // console.log('removeChildFromContainer', ...args);
  },
  insertInContainerBefore: function insertInContainerBefore(...args) {
    // container, child, beforeChild
    // console.log('insertInContainerBefore', ...args);
  },
  prepareUpdate: function prepareUpdate() {
    return undefined;
  },
  commitUpdate: function commitUpdate() {
    return undefined;
  },
  commitTextUpdate: function commitTextUpdate(...args) { // textInstance, oldText, newText
    // console.log('commitTextUpdate', ...args);
  },
  resetTextContent: function resetTextContent() {

  },
  shouldDeprioritizeSubtree: function shouldDeprioritizeSubtree(type, nextProps) {
    return !!nextProps.hidden;
  },
};

const reconcilerInstance = Reconciler(HostConfig);

const TouchBarRenderer = {
  render(element, renderDom, callback) {
    // element: This is the react element for App component
    // renderDom: This is the host root element to which the rendered app will be attached.
    // callback: if specified will be called after render is done.

    // Disables async rendering, read more about it here:
    // https://github.com/facebook/react/issues/13206#issuecomment-407535077
    const isAsync = false;
    // Creates root fiber node.
    const container = reconcilerInstance.createContainer(renderDom, isAsync);

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
