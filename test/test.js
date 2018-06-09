const dbjs = require("../dist/index.js");
const rows = [
	{
		name: "name",
		type: "string"
	},
	{
		name: "id",
		type: "number",
		options: {
			autoIncrement: true
		}
	}
];
const members = dbjs.connect("members", rows, __dirname);

members.insert([(Math.floor(Math.random() * 100)).toString()]);
// console.log(members.select("*"));
