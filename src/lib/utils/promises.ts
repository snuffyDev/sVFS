export interface IDeferred<T> {
    promise: Promise<T>;
    result?: T | undefined;
    resolve(value: T | PromiseLike<T>): void;
    resolve(value: unknown): void;
    reject(reason: unknown): void;
}

export function defer<T>() {
    const deferred: Partial<IDeferred<T>> = { result: undefined };

    deferred.promise = new Promise<T>((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred as IDeferred<T>;
}