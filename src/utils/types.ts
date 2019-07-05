export type Maybe<T> = T | null;

export interface WithIndex {
  [key: string]: any;
}

export function isTruthy<Type>(
  x: Type | '' | null | false | undefined,
): x is Type {
  return Boolean(x);
}
