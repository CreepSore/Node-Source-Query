let ExtendedBuffer = require("./ExtendedBuffer.js");
let ServerData = require("./ServerData.js");

module.exports = class PacketFactory {
	/**
	 * @static
	 * @param {ServerData} serverdata
	 * @return {Buffer}
	 */
	static constructPlayerPacket(serverdata) {
        const players = serverdata.players;
        const neededSize = 6 + players.map(p => p.name.length + 10).reduce((a, b) => a + b, 0);

        const packetBuffer = ExtendedBuffer.alloc(neededSize);
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

	/**
	 * @static
	 * @param {ServerData} serverdata
	 * @return {Buffer}
	 */
    static constructQueryPacket(serverdata) {
        const {
            hostname, mapname, gamename, foldername,
            appid, playercount, maxplayers, botcount,
            environment, servertype, isPrivate, isVAC
        } = serverdata;

        const packetBuffer = ExtendedBuffer.alloc(19 + hostname.length + mapname.length + foldername.length + gamename.length);
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