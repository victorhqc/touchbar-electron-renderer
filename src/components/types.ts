export interface TouchbarElement<T> {
  id: string;
  instance?: T;
  createInstance: () => T;
}
