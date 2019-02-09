import isFunction from 'lodash/isFunction';

export function insertBeforeChild({ children, newChild, beforeChild }) {
  const orderedChildren = children.reduce((prev, currentChild) => {
    if (beforeChild === currentChild) {
      return [newChild, beforeChild];
    }

    return prev;
  }, []);

  return flatten(orderedChildren);
}

export function removeChild({ children, child }) {
  return children.filter(childElement => childElement !== child);
}

export function buildChild(child) {
  if (isFunction(child.createInstance)) {
    return child.createInstance();
  }

  return child;
}
