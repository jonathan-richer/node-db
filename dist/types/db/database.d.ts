import { row } from "../types";
export default class Database {
    private dbPath;
    private rows;
    private autoIncrement;
    constructor(name: string, rows: row[], dirname: string);
    insert(data: any[]): void;
    select(rows: "*" | string, value?: string | number | boolean, comparisonFlag?: "eq" | "neq" | "gt" | "lt" | "gte" | "lte"): any;
}
