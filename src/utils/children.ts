import flatten from 'lodash/flatten';

export function insertBeforeChild<T extends WithId>({
  children,
  newChild,
  beforeChild,
}: InsertBeforeChildArgs<T>) {
  const orderedChildren = children.reduce<T[]>((prev, currentChild) => {
    if (beforeChild.id === currentChild.id) {
      return [newChild, currentChild, ...prev];
    }

    return [...prev, currentChild];
  }, []);

  return flatten(orderedChildren);
}

interface InsertBeforeChildArgs<T extends WithId> {
  children: T[];
  newChild: T;
  beforeChild: T;
}

export function removeChild<T extends WithId>({
  children,
  child,
}: RemoveChildArgs<T>) {
  return children.filter(childElement => childElement.id !== child.id);
}

interface RemoveChildArgs<T extends WithId> {
  children: T[];
  child: T;
}

interface WithId {
  id: string;
}
