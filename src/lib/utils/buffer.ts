import type { BufferEncoding } from "../types/core";
export class FSBuffer extends Uint8Array {
	private constructor(value: ArrayBufferLike) {
		super(value);
	}
	/*ts a
	 * Creates a new FSBuffer instance from an existing FSBuffer or Uint8Array.
	 *
	 * @param buffer FSBuffer to use as the source for a new FSBuffer
	 */
	static override from<T extends ArrayBuffer | FSBuffer | Uint8Array>(
		buffer: T,
		byteOffset?: number,
		length?: number,
	): FSBuffer;
	/**
	 * Creates a new FSBuffer from a given string using the character
	 * encoding designated with `encoding`. If `encoding` is not provided,
	 * `utf-8` will be used as default.
	 *
	 * @param data string to use as the source for the FSBuffer
	 * @param encoding
	 */
	static override from(str: string, encoding?: BufferEncoding): FSBuffer;
	static override from(value: unknown, encodingOrOffset?: unknown, length?: unknown): unknown {
		if (typeof value === "string") {
			if (!encodingOrOffset || typeof encodingOrOffset !== "string") encodingOrOffset = "utf-8";
			if (typeof encodingOrOffset === "string" && encodingOrOffset === "base64") value = btoa(value) as string;
			const stringBuf = new TextEncoder().encode(value as string);
			const buffer = new FSBuffer(stringBuf);
			return buffer;
		}
		if (value instanceof ArrayBuffer || value instanceof FSBuffer || value instanceof Uint8Array) {
			const buffer = new FSBuffer(value as Uint8Array);
			return buffer;
		}
	}

	static alloc(size: number, fill?: string | FSBuffer | number, encoding?: BufferEncoding): FSBuffer {
		const buffer = new Uint8Array(size);

		if (fill !== undefined) {
			if (typeof encoding === "string") {
				buffer.fill(size);

				return new FSBuffer(buffer);
			} else return new FSBuffer(buffer);
		} else return new FSBuffer(buffer);
	}
	///@ts-expect-error toString should accept a param
	public override toString(encoding: BufferEncoding): string {


		if (encoding === 'base64') {
			const res = new TextDecoder().decode(this);
			return atob(res)
		}
		if (encoding === 'binary') {

		}
		return new TextDecoder().decode(this, { stream: false });
	}

	*[Symbol.iterator](): IterableIterator<number> {
		const length = this.length;
		let idx = -1;
		while (++idx < length) {
			yield this[idx];
		}
	}

	static [Symbol.hasInstance](instance: unknown): boolean {
		return instance instanceof FSBuffer;
	}
}
