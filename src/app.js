"use strict";
let dgram = require("dgram");

let DEFAULT_SERVERDATA;
let PORT = 27016;

let init = function() {
    DEFAULT_SERVERDATA = new ServerData();
    DEFAULT_SERVERDATA.hostname = "[Lambda-Soft] Mari0 Kart 64";
    DEFAULT_SERVERDATA.gamename = "Mario Kart 64";
    DEFAULT_SERVERDATA.mapname = "Rainbow Road";
    DEFAULT_SERVERDATA.playercount = 7;
    DEFAULT_SERVERDATA.maxplayers = 8;
    DEFAULT_SERVERDATA.isVAC = false;
    DEFAULT_SERVERDATA.isPrivate = true;

    let sckt = dgram.createSocket("udp4");
    sckt.bind(PORT);
    sckt.addListener("message", onPacket);
}

let onPacket = function(msg, remote) {
    if(msg[0] == 0xFF && msg[1] == 0xFF && msg[2] == 0xFF && msg[3] == 0xFF) {
        let pckt = String(msg).substring(4);
        console.log("[VALID]" + remote.address + ":" + remote.port + " -> " + pckt);
        handlePacket(pckt, remote);
    } else {
        console.log("[INVALID]" + remote.address + ":" + remote.port + " -> " + msg);
    }
}

let handlePacket = function(pckt, remote) {
    let sckt = dgram.createSocket("udp4");
    if(pckt.startsWith("TSource Engine Query")) {
        let toSend = constructQueryPacketByServerData(DEFAULT_SERVERDATA);
        sckt.send(toSend, remote.port, remote.address, (e, b) => {
            if(e) console.log(e);
        });
    }
}

let constructQueryPacketByServerData = function(serverData) {
    return constructQueryPacket(serverData.hostname, serverData.mapname, serverData.gamename, 
        serverData.foldername, serverData.appid, serverData.playercount, serverData.maxplayers,
        serverData.botcount, serverData.environment, serverData.servertype, serverData.isPrivate,
        serverData.isVAC);
}

let constructQueryPacket = function(hostname, mapname, gamename, 
    foldername, appid, playercount, maxplayers, botcount, environment, servertype, 
    isPrivate, isVAC) {
    
    let pckt = Buffer.alloc(19 + hostname.length + mapname.length + foldername.length + gamename.length);

    let offs = 0;
    pckt.writeUInt8(0xff, offs);
    offs++;
    pckt.writeUInt8(0xff, offs);
    offs++;
    pckt.writeUInt8(0xff, offs);
    offs++;
    pckt.writeUInt8(0xff, offs);
    offs++;
    pckt.writeUInt8(0x49, offs);
    offs++;
    pckt.writeUInt8(0x11, offs);
    offs++;
    pckt.write(hostname, offs);
    offs += hostname.length;
    pckt.writeUInt8(0x00, offs);
    offs++;
    pckt.write(mapname, offs);
    offs += mapname.length;
    pckt.writeUInt8(0x00, offs);
    offs++;
    pckt.write(foldername, offs);
    offs += foldername.length;
    pckt.writeUInt8(0x00, offs);
    offs++;
    pckt.write(gamename, offs);
    offs += gamename.length;
    pckt.writeUInt8(0x00, offs);
    offs++;
    pckt.writeInt16BE(appid, offs);
    offs+=2;
    pckt.writeUInt8(playercount, offs);
    offs++;
    pckt.writeUInt8(maxplayers, offs);
    offs++;
    pckt.writeUInt8(botcount, offs);
    offs++;
    pckt.write(servertype, offs);
    offs++;
    pckt.write(environment, offs);
    offs++;
    pckt.write(isPrivate ? "1" : "0", offs);
    offs++;
    pckt.write(isVAC ? "1" : "0", offs);

    return Buffer.from(pckt);
}


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
    }
}

let EnumServerTypes = {
    DEDICATED: "d",
    NONDEDICATED: "l",
    SOURCETVRELAY: "p"
}

let EnumEnvironments = {
    WINDOWS: "w",
    LINUX: "l",
    MAC: "m"
}

init();