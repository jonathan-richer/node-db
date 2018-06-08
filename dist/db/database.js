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
    function Database(name, rows) {
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
        var db_path = path.join(__dirname, "../databases/" + name + ".json");
        fs.exists(db_path, function (res) {
            if (!res) {
                if (!fs.existsSync(path.dirname(db_path)))
                    fs.mkdirSync(path.dirname(db_path));
                fs.writeFileSync(db_path, "[]", { encoding: "utf-8" });
            }
        });
        this.rows = rows;
        this.autoIncrement = autoIncrement;
        this.dbPath = db_path;
    }
    Database.prototype.insert = function (data) {
        var _this = this;
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
        fs.readFile(this.dbPath, function (err, data) {
            if (err)
                throw new Error(err.message);
            else {
                var json = JSON.parse(data.toString());
                for (var i = 0; i < _this.autoIncrement.length; i++) {
                    var prop = _this.autoIncrement[i].name;
                    var last = void 0;
                    try {
                        last = json[json.length - 1][prop];
                    }
                    catch (e) {
                        last = null;
                    }
                    obj[prop] = (last !== null ? ++last : 0);
                }
                json.push(obj);
                fs.writeFileSync(_this.dbPath, JSON.stringify(json), { encoding: 'utf-8' });
            }
        });
    };
    return Database;
}());
exports["default"] = Database;
