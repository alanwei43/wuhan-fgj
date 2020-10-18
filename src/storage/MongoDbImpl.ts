import { DataStorage, } from "./";
import { MongoClient, Db } from "mongodb";

export interface CtorOpts {
    uri: string
    db: string
}
export class MongoDbImpl implements DataStorage {
    private _opts: CtorOpts
    constructor(opts: CtorOpts) {
        this._opts = opts;
    }
    private getClient(): Promise<{ client: MongoClient, db: Db }> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this._opts.uri, {
            }, (err, client) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    client: client,
                    db: client.db(this._opts.db)
                });
            });
        });
    }
    async findById<T>(category: string, id: string): Promise<T> {
        const { db } = await this.getClient();
        const col = db.collection(category);
        const result = await col.findOne({ id: id });
        return result;
    }
    async add(category: string, items: Array<{ id: string }>): Promise<void> {
        const { db } = await this.getClient();
        const collection = db.collection(category);
        for (let item of items) {
            if (!item.id) {
                console.warn(`item.id is null`);
                continue;
            }
            await collection.updateOne({ id: item.id }, {
                $set: item
            }, {
                upsert: true
            });
        }
    }
    remove<T>(category: string, id: string): Promise<T> {
        throw new Error("Method not implemented.");
    }
}