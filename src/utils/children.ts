import isFunction from 'lodash/isFunction';
import flatten from 'lodash/flatten';
import { TouchbarElement } from '../components/types'

export function insertBeforeChild<T extends WithId>({ children, newChild, beforeChild }: InsertBeforeChildArgs<T>) {
  const orderedChildren = children.reduce<T[]>((prev, currentChild) => {
    if (beforeChild.id === currentChild.id) {
      return [newChild, currentChild, ...prev];
    }

    return [...prev, currentChild];
  }, []);

  return flatten(orderedChildren);
}

interface InsertBeforeChildArgs<T extends WithId> {
  children: T[],
  newChild: T,
  beforeChild: T,
}

export function removeChild<T extends WithId>({ children, child }: RemoveChildArgs<T>) {
  return children.filter(childElement => childElement.id !== child.id);
}

interface RemoveChildArgs<T extends WithId> {
  children: T[],
  child: T,
}

export function buildChild<T>(child: TouchbarElement<T>) {
  if (child && isFunction(child.createInstance)) {
    return child.createInstance();
  }

  return child;
}

interface WithId {
  id: string
}
