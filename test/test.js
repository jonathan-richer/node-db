const dbjs = require("../dist/index.js");
const rows = [
	{
		name: "name",
		type: "string"
	}
]
const members = dbjs.connect("members", rows, __dirname);

members.insert(["John"]);
console.log(members.select("*"));
