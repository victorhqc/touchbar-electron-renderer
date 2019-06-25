export interface TouchbarElement<T> {
  id: string;
  createInstance: () => T;
}
