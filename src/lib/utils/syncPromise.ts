// import type { Maybe } from "$lib/types/util";
// import { noop } from "svelte/internal";
// import { get, writable } from "svelte/store";
// import { forEach } from "./array";
// import { EventEmitter } from "./emitter";
// import { process } from "./process";
// import { defer } from "./promises";
// import { setImmediate } from "./setImmediate";
// let isResolving = false;
// const callbacks: { args: any | any[]; name: string }[] = [];

// const resolver = Promise.resolve();

// let queue: { resolve: (value: unknown) => void }[] = [];

// const thePromise = new Promise((resolve) => {
// 	queue.push({ resolve });
// 	resolve(queue);
// });

// let resolveTimeout: NodeJS.Timeout;

// export interface SnuPromise<T> extends Thenable<T> {
// 	catch(errorCb: ErrorCB<T>): SnuPromise<T>;

// 	finally(fn: (value: T | any) => void): SnuPromise<T>;
// 	done(successFn: (value: T) => void): SnuPromise<T>;
// 	thenAsync<U>(success: SuccessCB<T, U>, errorFn?: ErrorCB<U>): SnuPromise<U>;
// }
// export interface Deferred<T> {
// 	resolve(obj: T): Deferred<T>;

// 	reject(obj?: any): Deferred<T>;

// 	promise(): SnuPromise<T>;
// }
// export type SuccessCB<T, U> = (value: T) => U | Thenable<U>;
// export type ErrorCB<T> = (value: T) => T | Thenable<T>;
// export interface Thenable<T> {
// 	then<U>(successCb: SuccessCB<T, U>, errorCb: ErrorCB<U>): SnuPromise<U>;
// }
// interface CallbackSet<T, U> {
// 	successFn?: SuccessCB<T, U>;
// 	errorFn?: ErrorCB<U>;
// 	task?: Deferred<U>;
// 	isAsyncCallback?: boolean;
// }

// export class SyncPromise<T> implements Deferred<T>, SnuPromise<T> {
// 	private _storedCallbacks: CallbackSet<T, any>[] = [];
// 	private _handleErrors = true;
// 	private _resolving = false;
// 	private _completedSuccess = false;
// 	private _completedFail = false;
// 	private _queueTask<U>(set: CallbackSet<T, U>, chain: boolean): SnuPromise<U> {
// 		const task = new ;
// 		set.task = task;
// 		this._storedCallbacks.push(set);
// 		if (chain) {
// 			this._handleErrors = false;
// 		} else {
// 			this._handleErrors = false;
// 		}
// 		if (!this._resolving) {
// 			if (this._completedSuccess) {
// 			}
// 		}
// 	}
// 	resolve(obj: T): Deferred<T> {
// 		throw new Error("Method not implemented.");
// 	}
// 	reject(obj?: any): Deferred<T> {
// 		throw new Error("Method not implemented.");
// 	}
// 	promise(): SnuPromise<T> {
// 		throw new Error("Method not implemented.");
// 	}
// 	catch(errorCb: ErrorCB<T>): SnuPromise<T> {
// 		throw new Error("Method not implemented.");
// 	}
// 	finally(fn: (value: any) => void): SnuPromise<T> {
// 		throw new Error("Method not implemented.");
// 	}
// 	done(successFn: (value: T) => void): SnuPromise<T> {
// 		throw new Error("Method not implemented.");
// 	}
// 	thenAsync<U>(success: SuccessCB<T, U>, errorFn?: ErrorCB<U> | undefined): SnuPromise<U> {
// 		throw new Error("Method not implemented.");
// 	}
// 	then<U>(successCb: SuccessCB<T, U>, errorCb: ErrorCB<U>): SnuPromise<U> {
// 		throw new Error("Method not implemented.");
// 	}
// }
// const cbs = [];
// const ee = new EventEmitter({});

// function promised() {
// 	const { set, subscribe } = writable();
// 	return {
// 		subscribe,
// 		set,
// 		get value() {
// 			return get(this);
// 		},
// 	};
// }
// let res = () => {};
// function then(value) {
// 	return (res = value);
// }
// export function syncPromise<T>(promise: T | Promise<T>) {
// 	if (promise instanceof Promise) {
// 		// console.log("FIRST CALL!", "\nINITIAL DATA: ", promise);(
// 		const p = promised();
// 		let data;
// 		p.set((() => promise.then((value) => (data = value)))() && data);

// 		return p;
// 	}
// 	// console.log("SECOND CALL! RESOLVED?\nRETURNED DATA: ", promise);
// 	return promise?.value;
// }
// // export interface IDeferred<T> {
// //     promise: Promise<T>;
// //     resolve<T>(value: T | PromiseLike<T>): void;
// //     resolve(): void;
// //     reject(reason: unknown): void;
// // }

// // export function defer<T>(): IDeferred<T> {
// //     const deferred: Partial<IDeferred<T>> = {};
// //     deferred.promise = new Promise<T>((resolve, reject) => {
// //         deferred.resolve = resolve;
// //         deferred.reject = reject;
// //     });
// //     return deferred as IDeferred<T>;
// // }

// export { defer };
