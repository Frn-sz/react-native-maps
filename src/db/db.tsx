import * as SQLite from 'expo-sqlite';

interface Query {
    sql: string
    args?: (string | number)[]
}

const table = "place"

export class Database {
    static getConnection() {
        return SQLite.openDatabaseAsync(`${table}.db`)
    }

    static async init(syncDb?: boolean) {
        const db = this.getConnection()

        if (syncDb || !(await this.isDbCreated())) {
            await this.dropDb()
            await this.createDb()
        }
    }

    static async restart(syncDb?: boolean) {
        const db = this.getConnection()

        await this.dropDb()
        await this.createDb()
    }

    private static async isDbCreated() {
        try {
            await this.runQuery(`SELECT 1 FROM  ${table};`)
            return true
        } catch (e) {
            return false
        }
    }

    private static async dropDb() {
        const db = this.getConnection();
        const queries = `DROP TABLE IF EXISTS ${table};`;
        (await db).runAsync(queries);
    }

    private static async createDb() {
        const db = this.getConnection();
        const queries =
            `create table if not exists ${table} (
                id integer primary key autoincrement,
                latitude float,
                longitude float,
                description text,
                title text,
                isFavorite boolean
            );`;
        (await db).runAsync(queries);
    }

    static async runQuery(sql: Query['sql'], args?: Query['args']) {
        const db = this.getConnection()
        const result = (await db).runAsync(sql, args ?? []);
        return ((await result).lastInsertRowId);
    }

}
