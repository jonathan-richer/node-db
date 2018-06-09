import * as fs from "fs";
import * as path from "path";
import { row } from "../types";

export default class Database {
	// Properties
	private dbPath: string;
	private rows: row[];
	private autoIncrement: row[];

	constructor(name: string, rows: row[], dirname: string) {
		const autoIncrement = [];
		for (let i = 0; i < rows.length; i++) {
			if (rows[i].default && typeof rows[i].default !== rows[i].type)
				throw new TypeError("The default property must be the same type as the type property");
			if (typeof rows[i].options !== 'undefined') {
				// @ts-ignore
				if (rows[i].options.autoIncrement) {
					if (rows[i].type !== "number")
						throw new Error("You can only auto increment numbers");
					autoIncrement.push(rows.splice(i, 1)[0]);
				}
			}
		}

		const db_path = path.join(dirname, `/databases/${name}.json`);
		{
			const ex = fs.existsSync(db_path);
			if (!ex) {
				const database = path.join(dirname, "databases");
				const exd = fs.existsSync(database);
				if (!exd)
					fs.mkdirSync(database);
				fs.writeFileSync(db_path, "[]", { encoding: 'utf-8' });
			}
		}

		this.rows = rows;
		this.autoIncrement = autoIncrement;
		this.dbPath = db_path;
	}

	insert(data: any[]) {
		if (data.length != this.rows.length)
			throw new Error("The parameter must be the same length as the rows")
		for (let i = 0; i < this.rows.length; i++) {
			if (typeof data[i] !== this.rows[i].type) {
				if (!this.rows[i].default && !data[i])
					throw new TypeError("Invalid type at index " + i);
			}
		}

		let obj = {};
		for (let i = 0; i < this.rows.length; i++) {
			// @ts-ignore
			obj[this.rows[i].name] = data[i] || this.rows[i].default;
		}

		fs.readFile(this.dbPath, (err, data) => {
			if (err)
				throw new Error(err.message);
			else {
				const json: Object[] = JSON.parse(data.toString());
				for (let i = 0; i < this.autoIncrement.length; i++) {
					const prop: string = this.autoIncrement[i].name;
					let last: number | null;
					try {
						// @ts-ignore
						last = json[json.length - 1][prop];
					} catch (e) {
						last = null;
					}
					// @ts-ignore
					obj[prop] = (last !== null ? ++last : 0);
				}
				json.push(obj);
				fs.writeFileSync(this.dbPath, JSON.stringify(json), { encoding: 'utf-8' });
			}
		});
	}

	select(rows: "*" | string, value?: string | number | boolean, comparisonFlag?: "eq" | "neq" | "gt" | "lt" | "gte" | "lte") {
		if (rows !== "*" && (typeof comparisonFlag === 'undefined' || typeof value === "undefined"))
			throw new Error("If you don't select everything, you must add a value to search and a flag");
		const json = JSON.parse(fs.readFileSync(this.dbPath).toString());
		if (rows === "*")
			return json;
		else if (typeof value !== "undefined") {
			const rtn = [];
			switch (comparisonFlag) {
				case "eq":
					for (let i = 0; i < json.length; i++) {
						if (json[i][rows] === value)
							rtn.push(json[i]);
					}
					return rtn;

				case "neq":
					for (let i = 0; i < json.length; i++) {
						if (json[i][rows] !== value)
							rtn.push(json[i]);
					}
					return rtn;

				case "lt":
					if (typeof value !== "number")
						throw new TypeError("You can only perform \"less than\" operator on numbers datatypes")
					for (let i = 0; i < json.length; i++) {
						if (json[i][rows] < value)
							rtn.push(json[i]);
					}
					return rtn;

				case "lte":
					if (typeof value !== "number")
						throw new TypeError("You can only perform \"less than or equal\" operator on numbers datatypes")
					for (let i = 0; i < json.length; i++) {
						if (json[i][rows] <= value)
							rtn.push(json[i]);
					}
					return rtn;

				case "gt":
					if (typeof value !== "number")
						throw new TypeError("You can only perform \"greater than\" operator on numbers datatypes")
					for (let i = 0; i < json.length; i++) {
						if (json[i][rows] > value)
							rtn.push(json[i]);
					}
					return rtn;

				case "gte":
					if (typeof value !== "number")
						throw new TypeError("You can only perform \"greater than or equal\" operator on numbers datatypes")
					for (let i = 0; i < json.length; i++) {
						if (json[i][rows] >= value)
							rtn.push(json[i]);
					}
					return rtn;
			}
		}
	}
}
