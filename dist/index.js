"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var database_1 = __importDefault(require("./db/database"));
exports.connect = function (name, rows, dirname) {
    return new database_1["default"](name, rows, dirname);
};
