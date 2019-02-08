import Reconciler from 'react-reconciler';

import { TouchBarText } from '../components';
import createTouchBarElement from '../createTouchBarElement';

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
  createTextInstance: function createTextInstance(newText) {
    return new TouchBarText(newText);
  },
  createInstance: function createInstance(type, newProps) {
    return createTouchBarElement(type, newProps);
  },
  appendInitialChild: function appendInitialChild(parent, child) {
    parent.appendChild(child.createInstance());
  },
  finalizeInitialChildren: function finalizeInitialChildren() {
    return {};
  },
  prepareForCommit: function prepareForCommit() {},
  resetAfterCommit: function resetAfterCommit(root) {
    root.createInstance();
  },
  commitMount: function commitMount() {},
  appendChildToContainer: function appendChildToContainer(parent, child) {
    parent.appendChild(child.createInstance());
  },
  appendChild: function appendChild(parent, child) {
    parent.appendChild(child.createInstance());
  },
  insertBefore: function insertBefore(parent, child, beforeChild) { // parentInstance, child, beforeChild
    parent.insertBefore(child, beforeChild);
  },
  removeChild: function removeChild(parent, child) { // parentInstance, child
    parent.removeChild(child);
  },
  removeChildFromContainer: function removeChildFromContainer(container, child) { // container, child
    parent.removeChild(child);
  },
  insertInContainerBefore: function insertInContainerBefore(container, child, beforeChild) {
    parent.insertBefore(child, beforeChild);
  },
  prepareUpdate: function prepareUpdate() {
    return undefined;
  },
  commitUpdate: function commitUpdate() {
    return undefined;
  },
  commitTextUpdate: function commitTextUpdate(textInstance, oldText, newText) {
    textInstance.replaceText(newText);
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
