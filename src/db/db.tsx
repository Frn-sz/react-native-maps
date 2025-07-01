import * as SQLite from 'expo-sqlite';
import { MarkerInfo } from '../interfaces/Marker';

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


    static async getAll(): Promise<MarkerInfo[]> {
        const db = this.getConnection()
        const result = (await db).getAllAsync<any>(`SELECT * FROM  ${table};`);

        const places: MarkerInfo[] = (await result).map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            isFavorite: !!row.isFavorite,
            coordinate: {
                latitude: row.latitude,
                longitude: row.longitude
            }
        }));
        return places;
    }

    static async deletePlace(id: number) {
        const db = this.getConnection();
        const sql = `DELETE FROM ${table} WHERE id = ?;`;
        const args = [id];
        await (await db).runAsync(sql, args);
    }


    static async addPlace(newPlace: Omit<MarkerInfo, 'id'>) {
        const sql = `INSERT INTO place (title, description, latitude, longitude, isFavorite) VALUES (?, ?, ?, ?, ?);`;
        const args: (string | number)[] = [
            newPlace.title ?? '',
            newPlace.description ?? '',
            newPlace.coordinate.latitude ?? 0,
            newPlace.coordinate.longitude ?? 0,
            newPlace.isFavorite ? 1 : 0
        ];

        await Database.runQuery(sql, args);
    };

    static async updatePlace(place: MarkerInfo) {
        if (!place.id) {
            throw new Error("Não é possível atualizar um local sem ID.");
        }

        const sql = `UPDATE place SET title = ?, description = ?, longitude = ?, latitude = ? WHERE id = ?;`;
        const args: (string | number)[] = [
            place.title ?? '',
            place.description ?? '',
            place.coordinate.longitude ?? 0,
            place.coordinate.latitude ?? 0,
            place.id ?? 0
        ];

        await Database.runQuery(sql, args);
    }

    static async toggleFavorite(placeToToggle: MarkerInfo) {
        if (placeToToggle.id === undefined) return;
        const newIsFavoriteState = !placeToToggle.isFavorite;
        const sql = `UPDATE place SET isFavorite = ? WHERE id = ?;`;
        const args = [
            newIsFavoriteState ? 1 : 0,
            placeToToggle.id
        ];

        await Database.runQuery(sql, args);
    };
}
