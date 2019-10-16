export interface IEmployee{
    id: number;
    managerId?: number;
    name: string;
}

export interface IHierarchyItem<T>{
    current?: T;
    // parent: T;
    children?: IHierarchyItem<T>[]
}
