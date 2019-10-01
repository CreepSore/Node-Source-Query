const SmartBuffer = require('smart-buffer').SmartBuffer;

module.exports = class PacketFactory {
    static constructPlayerPacket(serverdata) {
        let players = serverdata.players;

        let neededSize = 6;
        players.forEach(e => {
            neededSize += 10;
            neededSize += e.name.length;
        });

        let packetBuffer = SmartBuffer.fromBuffer(Buffer.alloc(neededSize));
        packetBuffer.writeUInt8(0xFF);
        packetBuffer.writeUInt8(0xFF);
        packetBuffer.writeUInt8(0xFF);
        packetBuffer.writeUInt8(0xFF);
        packetBuffer.writeUInt8(0x44);
        packetBuffer.writeUInt8(players.length);
        players.forEach(e => {
            packetBuffer.writeUInt8(e.index);
            packetBuffer.writeString(e.name);
            packetBuffer.writeUInt8(0x0);
            packetBuffer.writeInt32LE(e.score);
            packetBuffer.writeFloatLE(e.time);
        });

        return packetBuffer.toBuffer();
    };

    static constructQueryPacket(serverdata) {
        let {
            hostname, mapname, gamename, foldername,
            appid, playercount, maxplayers, botcount,
            environment, servertype, isPrivate, isVAC
        } = serverdata;

        let packetBuffer = SmartBuffer.fromBuffer(Buffer.alloc(19 + hostname.length + mapname.length + foldername.length + gamename.length));
        packetBuffer.writeUInt8(0xff);
        packetBuffer.writeUInt8(0xff);
        packetBuffer.writeUInt8(0xff);
        packetBuffer.writeUInt8(0xff);
        packetBuffer.writeUInt8(0x49);
        packetBuffer.writeUInt8(0x11);
        packetBuffer.writeString(hostname);
        packetBuffer.writeUInt8(0x00);
        packetBuffer.writeString(mapname);
        packetBuffer.writeUInt8(0x00);
        packetBuffer.writeString(foldername);
        packetBuffer.writeUInt8(0x00);
        packetBuffer.writeString(gamename);
        packetBuffer.writeUInt8(0x00);
        packetBuffer.writeInt16BE(appid);
        packetBuffer.writeUInt8(playercount);
        packetBuffer.writeUInt8(maxplayers);
        packetBuffer.writeUInt8(botcount);
        packetBuffer.writeString(servertype);
        packetBuffer.writeString(environment);
        packetBuffer.writeString(isPrivate ? "1" : "0");
        packetBuffer.writeString(isVAC ? "1" : "0");

        return packetBuffer.toBuffer();
    };
};