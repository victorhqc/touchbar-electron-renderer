import isFunction from 'lodash/isFunction';
import flatten from 'lodash/flatten';

export function insertBeforeChild({ children, newChild, beforeChild }) {
  const orderedChildren = children.reduce((prev, currentChild) => {
    if (beforeChild.id === currentChild.id) {
      return [newChild, currentChild, ...prev];
    }

    return [...prev, currentChild];
  }, []);

  return flatten(orderedChildren);
}

export function removeChild({ children, child }) {
  return children.filter(childElement => childElement.id !== child.id);
}

export function buildChild(child) {
  if (isFunction(child.createInstance)) {
    return child.createInstance();
  }

  return child;
}
