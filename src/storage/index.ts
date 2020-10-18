export interface DataStorage {
    findById<T>(category: string, id: string): Promise<T>;
    add(category: string, items: Array<{ id: string }>): Promise<void>;
    remove<T>(category: string, id: string): Promise<T>;
}