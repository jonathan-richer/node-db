import Database from "./db/database";
import { row } from "./types";

export const connect = (name: string, rows: row[], dirname: string): Database => {
	return new Database(name, rows, dirname);
};
