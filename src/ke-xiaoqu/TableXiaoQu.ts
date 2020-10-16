import { XiaoQuInfo } from ".";
import { SqliteUtil } from "../utils/SqliteUtil";

const db = new SqliteUtil("data/bei-ke.db");
db.ready();

const TABLE_NAME = "XiaoQu";

export function dropTable() {
    return db.run(`DROP TABLE ${TABLE_NAME}`);
}
export function createTable() {
    return db.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link TEXT,
        name TEXT,
        totalPrice INTEGER,
        priceDesc TEXT,
        totalOnSaleCount INTEGER,
        district TEXT,
        bizCircle TEXT,
        rentCount INTEGER,
        buildYear INTEGER
    )`);
}

export function query() {
    return db.query(`SELECT * FROM ${TABLE_NAME}`);
}

export function insert(rows: Array<XiaoQuInfo>) {
    return db.insert(TABLE_NAME, rows)
}