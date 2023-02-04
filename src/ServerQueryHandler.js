"use strict";
let fs = require("fs");
let path = require("path");
let dgram = require("dgram");
let PacketFactory = require("./PacketFactory.js");

const QUERY_HEADER = [0xFF, 0xFF, 0xFF, 0xFF];

module.exports = class ServerQueryHandler {
	/** @type {dgram.Socket} */
	socket;
	config;

	constructor(config) {
		this.config = config;
	}

	start() {
		let file = fs.readFileSync(path.resolve(__dirname, "..", "config", "config.json"), "utf8");
		this.config = JSON.parse(file);

		this.socket = dgram.createSocket("udp4");
		this.socket.on("message", (msg, remote) => this.onPacketReceived(msg, remote));
		this.socket.bind(this.config.connection.port, this.config.connection.mask);
	}

	stop() {
		this.socket.close();
	}

	onPacketReceived(msg, remote) {
		if(ServerQueryHandler.matchArrayPattern(msg, QUERY_HEADER)) {
			let pckt = String(msg).substring(4);
			console.log("[VALID]" + remote.address + ":" + remote.port + " -> " + pckt);
			this.handlePacket(pckt, remote);
		} else {
			console.log("[INVALID]" + remote.address + ":" + remote.port + " -> " + msg);
		}
	}

	handlePacket(pckt, remote) {
		if(pckt.startsWith("TSource Engine Query")) {
			let toSend = PacketFactory.constructQueryPacket(this.config.serverdata);
			this.socket.send(toSend, remote.port, remote.address, (err) => {
				if(err) console.log(err);
			});
		} else if(pckt.startsWith("U")) {
			let toSend = PacketFactory.constructPlayerPacket(this.config.serverdata);
			this.socket.send(toSend, remote.port, remote.address, (err) => {
				if(err) console.log(err);
			})
		}
	}

	static matchArrayPattern(src, toMatch) {
		if(toMatch.length > src.length) {
			return false;
		}

		for(let i = 0; i < toMatch.length; i++) {
			if(src[i] !== toMatch[i]) {
				return false;
			}
		}

		return true;
	}
}
