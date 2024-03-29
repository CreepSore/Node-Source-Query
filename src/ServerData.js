let Player = require("./Player.js");
let EnumEnvironments = require("./EnumEnvironments.js");
let EnumServerTypes = require("./EnumServerTypes.js");

class ServerData {
    constructor() {
        this.hostname = "Default Hostname";
        this.mapname = "Default Mapname";
        this.gamename = "Default Gamename";
        this.foldername = "";
        this.appid = 730;
        this.playercount = 0;
        this.maxplayers = 255;
        this.botcount = 0;
        this.environment = EnumEnvironments.WINDOWS;
        this.servertype = EnumServerTypes.DEDICATED;
        this.isPrivate = false;
        this.isVAC = true;
		/** @type {Player[]} */
        this.players = [];
    }
}

module.exports = ServerData;