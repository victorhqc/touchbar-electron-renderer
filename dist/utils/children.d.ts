export declare function insertBeforeChild<T extends WithId>({ children, newChild, beforeChild, }: InsertBeforeChildArgs<T>): T[];
interface InsertBeforeChildArgs<T extends WithId> {
    children: T[];
    newChild: T;
    beforeChild: T;
}
export declare function removeChild<T extends WithId>({ children, child, }: RemoveChildArgs<T>): T[];
interface RemoveChildArgs<T extends WithId> {
    children: T[];
    child: T;
}
interface WithId {
    id: string;
}
export {};
