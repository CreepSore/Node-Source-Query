"use strict";
let fs = require("fs");
let path = require("path");
const ServerQueryHandler = require("./ServerQueryHandler");

const init = function() {
    const file = fs.readFileSync(path.resolve(__dirname, "..", "config", "config.json"), "utf8");
    const config = JSON.parse(file);

    const queryHandler = new ServerQueryHandler(config);
	queryHandler.start();
};

init();