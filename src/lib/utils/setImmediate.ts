export const setImmediate = async<T>(callback: () => T | Promise<T>) => {

    // const result = callback();
    return new Promise<T>((resolve) => {
        setTimeout(() => resolve(callback()), 0);
    });
};
