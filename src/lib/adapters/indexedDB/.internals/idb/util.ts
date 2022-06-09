export function promisify<T>(value: IDBRequest<T>): Promise<T> {
	const promise = new Promise<T>((resolve, reject) => {
		const cleanup = () => {
			value.removeEventListener('success', onSuccess);
			value.removeEventListener('error', onError);
		};
		const onSuccess = () => {
			resolve(value.result);
			cleanup();
		};
		const onError = () => {
			reject(value.error);
			cleanup();
		};
		value.addEventListener('success', onSuccess);
		value.addEventListener('error', onError);
	});
	promise.then((e) => {
		console.log(e);
	}).catch(() => {/* */ });
	return promise;
}
