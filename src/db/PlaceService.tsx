import { MarkerInfo } from "../interfaces/Marker";
import { Database } from "./db";

const TABLE = "place";
export class PlaceService {


    static async getAll(): Promise<MarkerInfo[]> {
        const db = Database.getConnection()
        const result = (await db).getAllAsync<any>(`SELECT * FROM  ${TABLE};`);

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
        const db = Database.getConnection()

        const sql = `DELETE FROM ${TABLE} WHERE id = ?;`;
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

