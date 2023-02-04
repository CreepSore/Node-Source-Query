
module.exports = class ExtendedBuffer extends Buffer {
	currentIndex;

	/**
	 * @param {number} size
	 * @param {string | number | Buffer | undefined} [fill]
	 * @param {BufferEncoding | undefined} [encoding]
	 * @returns {ExtendedBuffer}
	 */
	static alloc(size, fill, encoding) {
		/** @type {ExtendedBuffer} */
		// @ts-ignore
		const buffer = Buffer.alloc(size, fill, encoding);
		Object.setPrototypeOf(buffer, ExtendedBuffer.prototype);
		buffer.currentIndex = 0;
		return buffer;
	}


	/**
	 * @param {number} size
	 * @returns {ExtendedBuffer}
	 */
	static allocUnsafe(size) {
		/** @type {ExtendedBuffer} */
		// @ts-ignore
		const buffer = Buffer.allocUnsafe(size);
		Object.setPrototypeOf(buffer, ExtendedBuffer.prototype);
		buffer.currentIndex = 0;
		return buffer;
	}

	/**
	 * @param {number} size
	 * @returns {ExtendedBuffer}
	 */
	static allocUnsafeSlow(size) {
		/** @type {ExtendedBuffer} */
		// @ts-ignore
		const buffer = Buffer.allocUnsafeSlow(size);
		Object.setPrototypeOf(buffer, ExtendedBuffer.prototype);
		buffer.currentIndex = 0;
		return buffer;
	}

	appendUInt8(value) {
		super.writeUInt8(value, this.currentIndex);
		this.currentIndex += 1;
	}

    appendUInt16LE(value) {
		super.writeUInt16LE(value, this.currentIndex);
		this.currentIndex += 2;
	}

    appendUInt16BE(value) {
		super.writeUInt16BE(value, this.currentIndex);
		this.currentIndex += 2;
	}

    appendUInt32LE(value) {
		super.writeUInt32LE(value, this.currentIndex);
		this.currentIndex += 4;
	}

    appendUInt32BE(value) {
		super.writeUInt32BE(value, this.currentIndex);
		this.currentIndex += 4;
	}

    appendInt8(value) {
		super.writeInt8(value, this.currentIndex);
		this.currentIndex += 1;
	}

    appendInt16LE(value) {
		super.writeInt16LE(value, this.currentIndex);
		this.currentIndex += 2;
	}

    appendInt16BE(value) {
		super.writeInt16BE(value, this.currentIndex);
		this.currentIndex += 2;
	}

    appendInt32LE(value) {
		super.writeInt32LE(value, this.currentIndex);
		this.currentIndex += 4;
	}

    appendInt32BE(value) {
		super.writeInt32BE(value, this.currentIndex);
		this.currentIndex += 4;
	}

    appendFloatLE(value) {
		super.writeFloatLE(value, this.currentIndex);
		this.currentIndex += 4;
	}

    appendFloatBE(value) {
		super.writeFloatBE(value, this.currentIndex);
		this.currentIndex += 4;
	}

    appendDoubleLE(value) {
		super.writeDoubleLE(value, this.currentIndex);
		this.currentIndex += 8;
	}

    appendDoubleBE(value) {
		super.writeDoubleBE(value, this.currentIndex);
		this.currentIndex += 8;
	}

	appendString(value) {
		super.write(value, this.currentIndex);
		this.currentIndex += value.length;
	}
};
