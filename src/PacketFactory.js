let ExtendedBuffer = require("./ExtendedBuffer.js");

module.exports = class PacketFactory {
    static constructPlayerPacket(serverdata) {
        let players = serverdata.players;

        let neededSize = 6;
        players.forEach(e => {
            neededSize += 10;
            neededSize += e.name.length;
        });

        let packetBuffer = ExtendedBuffer.alloc(neededSize);
        packetBuffer.appendUInt8(0xFF);
        packetBuffer.appendUInt8(0xFF);
        packetBuffer.appendUInt8(0xFF);
        packetBuffer.appendUInt8(0xFF);
        packetBuffer.appendUInt8(0x44);
        packetBuffer.appendUInt8(players.length);
        players.forEach(e => {
            packetBuffer.appendUInt8(e.index);
            packetBuffer.appendString(e.name);
            packetBuffer.appendUInt8(0x0);
            packetBuffer.appendInt32LE(e.score);
            packetBuffer.appendFloatLE(e.time);
        });

        return packetBuffer;
    };

    static constructQueryPacket(serverdata) {
        let {
            hostname, mapname, gamename, foldername,
            appid, playercount, maxplayers, botcount,
            environment, servertype, isPrivate, isVAC
        } = serverdata;

        let packetBuffer = ExtendedBuffer.alloc(19 + hostname.length + mapname.length + foldername.length + gamename.length);
        packetBuffer.appendUInt8(0xff);
        packetBuffer.appendUInt8(0xff);
        packetBuffer.appendUInt8(0xff);
        packetBuffer.appendUInt8(0xff);
        packetBuffer.appendUInt8(0x49);
        packetBuffer.appendUInt8(0x11);
        packetBuffer.appendString(hostname);
        packetBuffer.appendUInt8(0x00);
        packetBuffer.appendString(mapname);
        packetBuffer.appendUInt8(0x00);
        packetBuffer.appendString(foldername);
        packetBuffer.appendUInt8(0x00);
        packetBuffer.appendString(gamename);
        packetBuffer.appendUInt8(0x00);
        packetBuffer.appendInt16BE(appid);
        packetBuffer.appendUInt8(playercount);
        packetBuffer.appendUInt8(maxplayers);
        packetBuffer.appendUInt8(botcount);
        packetBuffer.appendString(servertype);
        packetBuffer.appendString(environment);
        packetBuffer.appendString(isPrivate ? "1" : "0");
        packetBuffer.appendString(isVAC ? "1" : "0");

        return packetBuffer;
    };
};