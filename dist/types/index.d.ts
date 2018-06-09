/// <reference path="db/database.d.ts" />
/// <reference path="types.d.ts" />
import Database from "./db/database";
import { row } from "./types";
export declare const connect: (name: string, rows: row[], dirname: string) => Database;
