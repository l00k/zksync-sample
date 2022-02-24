export type StorageModelClass = {

    readonly STORAGE_MODEL : string;
    new : (...args : any[]) => Object;

}

export type ConstructorType<T> = new (...args : any[]) => T;

export type DatabaseUpdateEvent = {
    model : Object,
    object? : Object,
}
