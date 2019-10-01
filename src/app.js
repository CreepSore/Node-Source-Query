"use strict";
const PacketFactory = require("./PacketFactory.js");

const dgram = require("dgram");
const fs = require("fs");

const QUERY_HEADER = [0xFF, 0xFF, 0xFF, 0xFF];

const socket = dgram.createSocket("udp4");
let config;

const init = function() {
    let file = fs.readFileSync(__dirname + "/../config/config.json", "utf8");
    config = JSON.parse(file);

    socket.on("message", onPacket);
    socket.bind(config.connection.port, config.connection.mask);
};

const onPacket = function(msg, remote) {
    if(matchArrayPattern(msg, QUERY_HEADER)) {
        let pckt = String(msg).substring(4);
        console.log("[VALID]" + remote.address + ":" + remote.port + " -> " + pckt);
        handlePacket(pckt, remote);
    } else {
        console.log("[INVALID]" + remote.address + ":" + remote.port + " -> " + msg);
    }
};

const handlePacket = function(pckt, remote) {
    if(pckt.startsWith("TSource Engine Query")) {
        let toSend = PacketFactory.constructQueryPacket(config.serverdata);
        socket.send(toSend, remote.port, remote.address, (err) => {
            if(err) console.log(err);
        });
    } else if(pckt.startsWith("U")) {
        let toSend = PacketFactory.constructPlayerPacket(config.serverdata);
        socket.send(toSend, remote.port, remote.address, (err) => {
            if(err) console.log(err);
        })
    }
};

const matchArrayPattern = function(src, toMatch) {
    if(toMatch.length > src.length) {
        return false;
    }

    for(let i = 0; i < toMatch.length; i++) {
        if(src[i] !== toMatch[i]) {
            return false;
        }
    }

    return true;
};

init();