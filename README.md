# Node Javascript database

A simple database library for server-side nodejs

### Features
- [x] Databases
- [ ] Tables
- [x] Typed rows
- [x] Autoincrement
- [x] insert (INSERT)
- [x] select (SELECT)
- [ ] delete (DELETE) -- coming soon...

### Usage

Terminal:

<code style="font-weight: bold; background: #222; padding: 10px 10px; border-radius: 10px">
<span style="user-select: none; color: #fff">$ </span><span style="color: #00ffaa;">npm</span> <span style="color: #aaa;">install</span> <span style="color: white;">node-dbjs --save-dev</span>
</code>

\<file\>.js

``` javascript
const { connect } = require("node-dbjs");

const rows = [
	{
		name: "<row's name>",
		type: "<row's type (string | number | boolean)>",
		options: {
			autoIncrement: true, // Boolean
			notnull: true // Boolean
		}
	}
];

const db = connect("<name>", , __dirname);


```
