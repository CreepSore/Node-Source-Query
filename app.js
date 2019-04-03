let dgram = require("dgram");

let PORT = 27016;

let init = function() {
    let sckt = dgram.createSocket("udp4");
    sckt.bind(PORT, ()=>{});
    sckt.addListener("message", onPacket)
}

let onPacket = function(msg, remote) {
    if(msg[0] == 0xFF && msg[1] == 0xFF && msg[2] == 0xFF && msg[3] == 0xFF) {
        let pckt = String(msg).substring(4);
        console.log(remote.address + ":" + remote.port + " -> " + pckt);
        handlePacket(pckt, remote);
    }
}

let handlePacket = function(pckt, remote) {
    let sckt = dgram.createSocket("udp4", () => {});
    if(pckt.startsWith("TSource Engine Query")) {
        let toSend = constructQueryPacket("test", "test", "test", "", 1337, 69, 88, 0, "w", "d", false, false);
        console.log(toSend);
        sckt.send(toSend, remote.port, remote.address, (e, b) => {
            if(e) console.log(e);
        });
    }
}

let constructQueryPacket = function(hostname, mapname, gamename, 
    foldername, appid, playercount, maxplayers, botcount, environment, servertype, 
    isPrivate, isVAC) {
    
    let pckt = Buffer.alloc(6 + hostname.length + 1 + mapname.length + 1 + foldername.length + 1 + gamename.length + 1 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1);

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