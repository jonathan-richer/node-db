import Database from "./db/database";
import { row } from "./types";

const rows: row[] = [
	{
		name: "id",
		type: "number",
		options: {
			notnull: true,
			autoIncrement: true
		}
	},
	{
		name: "name",
		type: "string",
		options: {
			notnull: true
		}
	},
	{
		name: "age",
		type: "number",
		default: 0,
		options: {
			notnull: true
		}
	}
];

const db = new Database("members", rows);
db.insert(["Jonathan", 20]);
