import Reconciler from 'react-reconciler';
import difference from 'lodash/difference';

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
    parent.appendChild(child);
  },
  finalizeInitialChildren: function finalizeInitialChildren() {
    return {};
  },
  prepareForCommit: function prepareForCommit(root) {

  },
  resetAfterCommit: function resetAfterCommit(root) {
    console.time('reset-after-commit');
    root.createInstance();
    console.timeEnd('reset-after-commit');
  },
  appendChildToContainer: function appendChildToContainer(parent, child) {
    parent.appendChild(child);
  },
  appendChild: function appendChild(parent, child) {
    parent.appendChild(child);
  },
  insertBefore: function insertBefore(parent, child, beforeChild) { // parentInstance, child, beforeChild
    parent.insertBefore(child, beforeChild);
  },
  removeChild: function removeChild(parent, child) { // parentInstance, child
    parent.removeChild(child);
  },
  removeChildFromContainer: function removeChildFromContainer(container, child) { // container, child
    container.removeChild(child);
  },
  insertInContainerBefore: function insertInContainerBefore(container, child, beforeChild) {
    container.insertBefore(child, beforeChild);
  },
  prepareUpdate: function prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance) {
    // A prop was deleted or deleted.
    if (
      Object.keys(oldProps).length > Object.keys(newProps).length
      || Object.keys(oldProps).length < Object.keys(newProps).length
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

    return undefined;
  },
  commitUpdate: function commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork) {
    // console.log('COMMITING UPDATE', {instance, updatePayload, type, oldProps, newProps, finishedWork});
    instance.updateProps(newProps);
  },
  commitTextUpdate: function commitTextUpdate(textInstance, oldText, newText) {
    textInstance.replaceText(newText);
  },
  commitMount: function commitMount(element, type, newProps, fiberNode) {
    // console.log('COMMITING MOUNT', {
    //   element,
    //   type,
    //   newProps,
    //   fiberNode,
    // });

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
