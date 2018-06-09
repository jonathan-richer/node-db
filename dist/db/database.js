"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var Database = (function () {
    function Database(name, rows, dirname) {
        var autoIncrement = [];
        for (var i = 0; i < rows.length; i++) {
            if (rows[i]["default"] && typeof rows[i]["default"] !== rows[i].type)
                throw new TypeError("The default property must be the same type as the type property");
            if (typeof rows[i].options !== 'undefined') {
                if (rows[i].options.autoIncrement) {
                    if (rows[i].type !== "number")
                        throw new Error("You can only auto increment numbers");
                    autoIncrement.push(rows.splice(i, 1)[0]);
                }
            }
        }
        var db_path = path.join(dirname, "/databases/" + name + ".json");
        {
            var ex = fs.existsSync(db_path);
            if (!ex) {
                var database = path.join(dirname, "databases");
                var exd = fs.existsSync(database);
                if (!exd)
                    fs.mkdirSync(database);
                fs.writeFileSync(db_path, "[]", { encoding: 'utf-8' });
            }
        }
        this.rows = rows;
        this.autoIncrement = autoIncrement;
        this.dbPath = db_path;
    }
    Database.prototype.insert = function (data) {
        if (data.length != this.rows.length)
            throw new Error("The parameter must be the same length as the rows");
        for (var i = 0; i < this.rows.length; i++) {
            if (typeof data[i] !== this.rows[i].type) {
                if (!this.rows[i]["default"] && !data[i])
                    throw new TypeError("Invalid type at index " + i);
            }
        }
        var obj = {};
        for (var i = 0; i < this.rows.length; i++) {
            obj[this.rows[i].name] = data[i] || this.rows[i]["default"];
        }
        var json = JSON.parse(fs.readFileSync(this.dbPath).toString());
        for (var i = 0; i < this.autoIncrement.length; i++) {
            var prop = this.autoIncrement[i].name;
            var last = void 0;
            try {
                last = json[json.length - 1][prop];
            }
            catch (e) {
                last = null;
            }
            obj[prop] = (typeof last === "number") ? last + 1 : 0;
        }
        json.push(obj);
        fs.writeFileSync(this.dbPath, JSON.stringify(json), { encoding: 'utf-8' });
    };
    Database.prototype.select = function (rows, value, comparisonFlag) {
        if (rows !== "*" && (typeof comparisonFlag === 'undefined' || typeof value === "undefined"))
            throw new Error("If you don't select everything, you must add a value to search and a flag");
        var json = JSON.parse(fs.readFileSync(this.dbPath).toString());
        if (rows === "*")
            return json;
        else if (typeof value !== "undefined") {
            var rtn = [];
            switch (comparisonFlag) {
                case "eq":
                    for (var i = 0; i < json.length; i++) {
                        if (json[i][rows] === value)
                            rtn.push(json[i]);
                    }
                    return rtn;
                case "neq":
                    for (var i = 0; i < json.length; i++) {
                        if (json[i][rows] !== value)
                            rtn.push(json[i]);
                    }
                    return rtn;
                case "lt":
                    if (typeof value !== "number")
                        throw new TypeError("You can only perform \"less than\" operator on numbers datatypes");
                    for (var i = 0; i < json.length; i++) {
                        if (json[i][rows] < value)
                            rtn.push(json[i]);
                    }
                    return rtn;
                case "lte":
                    if (typeof value !== "number")
                        throw new TypeError("You can only perform \"less than or equal\" operator on numbers datatypes");
                    for (var i = 0; i < json.length; i++) {
                        if (json[i][rows] <= value)
                            rtn.push(json[i]);
                    }
                    return rtn;
                case "gt":
                    if (typeof value !== "number")
                        throw new TypeError("You can only perform \"greater than\" operator on numbers datatypes");
                    for (var i = 0; i < json.length; i++) {
                        if (json[i][rows] > value)
                            rtn.push(json[i]);
                    }
                    return rtn;
                case "gte":
                    if (typeof value !== "number")
                        throw new TypeError("You can only perform \"greater than or equal\" operator on numbers datatypes");
                    for (var i = 0; i < json.length; i++) {
                        if (json[i][rows] >= value)
                            rtn.push(json[i]);
                    }
                    return rtn;
            }
        }
    };
    return Database;
}());
exports["default"] = Database;
