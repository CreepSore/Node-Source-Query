"use strict";
let EnumEnvironments = require("./EnumEnvironments.js");
let EnumServerTypes = require("./EnumServerTypes.js");
let ServerData = require("./ServerData.js");
let Player = require("./Player.js");

let dgram = require("dgram");
let fs = require("fs");

let config;
let SERVERDATA;
let PORT;
let ADDRMASK;

const SOCKET = dgram.createSocket("udp4");

let init = function() {
    let file = fs.readFileSync(__dirname + "/../config/config.json", "utf8");
    config = JSON.parse(file);
    SERVERDATA = config.Serverdata;
    PORT = config.Connection.port;
    ADDRMASK = config.Connection.mask;

    SOCKET.on("message", onPacket);
    SOCKET.bind(PORT, ADDRMASK);
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
    let sckt = SOCKET;
    if(pckt.startsWith("TSource Engine Query")) {
        let toSend = constructQueryPacketByServerData(SERVERDATA);
        sckt.send(toSend, remote.port, remote.address, (e, b) => {
            if(e) console.log(e);
        });
    } else if(pckt.startsWith("U")) {
        let toSend = constructPlayerPacketByServerData(SERVERDATA);
        sckt.send(toSend, remote.port, remote.address, (e, b) => {
            if(e) console.log(e);
        })
    }
}

let constructQueryPacketByServerData = function(serverData) {
    return constructQueryPacket(serverData.hostname, serverData.mapname, serverData.gamename, 
        serverData.foldername, serverData.appid, serverData.playercount, serverData.maxplayers,
        serverData.botcount, serverData.environment, serverData.servertype, serverData.isPrivate,
        serverData.isVAC);
}

let constructPlayerPacketByServerData = function(serverData) {
    return constructPlayerPacket(serverData.players);
}

let constructPlayerPacket = function(players) {
    let neededSize = 6;
    players.forEach(e => {
        neededSize += 10;
        neededSize += e.name.length;
    });
    
    let offs = 0;
    let pckt = Buffer.alloc(neededSize);
    pckt.writeUInt8(0xFF, offs);
    offs++;
    pckt.writeUInt8(0xFF, offs);
    offs++;
    pckt.writeUInt8(0xFF, offs);
    offs++;
    pckt.writeUInt8(0xFF, offs);
    offs++;
    pckt.writeUInt8(0x44, offs);
    offs++;
    pckt.writeUInt8(players.length, offs);
    offs++;
    players.forEach(e => {
        pckt.writeUInt8(e.index, offs);
        offs++;
        pckt.write(e.name, offs);
        offs += e.name.length;
        pckt.writeUInt8(0x0, offs);
        offs++;
        pckt.writeInt32LE(e.score, offs);
        offs += 4;
        pckt.writeFloatLE(e.time, offs);
        offs += 4;
    });

    return pckt;
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

init();