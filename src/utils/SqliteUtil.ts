import sqlite3 from "sqlite3";

export class SqliteUtil {
    private _db: sqlite3.Database;
    private _dbPath: string;
    constructor(dbPath: string) {
        this._dbPath = dbPath;
    }

    public ready(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._db = new sqlite3.Database(this._dbPath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public run(sql: string, params?: any): Promise<sqlite3.RunResult> {
        return new Promise((resolve, reject) => {

            this._db.serialize(() => {
                this._db.run(sql, params, (result: sqlite3.RunResult, err: Error) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            });

        });
    }

    public insert(table: string, rows: Array<any>): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(rows)) {
                throw new Error("rows 必须是数组");
            }
            const validRows = rows.filter(item => !!item);
            if (validRows.length === 0) {
                resolve();
                return;
            }

            const first = validRows[0];
            const fieldNames = Object.keys(first);
            const placeholders = fieldNames.map(name => `@${name}`).join(", ");


            const stmt = this._db.prepare(`INSERT INTO ${table} ( ${fieldNames.join(", ")}) VALUES (${placeholders})`)
            validRows.forEach(item => {
                const params = Object.create(null);
                fieldNames.forEach(name => params["@" + name] = item[name]);
                stmt.run(params, (err) => {
                    if (err) {
                        console.warn("stmt.run: ", err);
                    }
                });
            });
            stmt.finalize(err => {
                err ? reject(err) : resolve();
            });
        });
    }

    public query<T>(sql: string, params?: any): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            const list: Array<T> = [];
            const errors: Array<Error> = [];
            this._db.serialize(() => {
                this._db.each(sql, params, (err, row) => {
                    if (err) {
                        errors.push(err);
                        return;
                    }
                    list.push(row);
                }, (err, count) => {
                    if (err) {
                        errors.push(err);
                        reject(errors);
                        return;
                    }
                    resolve(list);
                })
            });
        });
    }
}