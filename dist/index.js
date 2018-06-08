"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var database_1 = __importDefault(require("./db/database"));
var rows = [
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
        "default": 0,
        options: {
            notnull: true
        }
    }
];
var db = new database_1["default"]("members", rows);
db.insert(["Jonathan", 20]);
