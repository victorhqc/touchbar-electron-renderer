export declare type Maybe<T> = T | null;
export interface WithIndex {
    [key: string]: any;
}
export declare function isTruthy<Type>(x: Type | '' | null | false | undefined): x is Type;
