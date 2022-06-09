import type { Maybe } from "$lib/types/util";
type CB<T = unknown> = () => T | Promise<T> | void | Promise<void>;
const callbacks: CB[] = [];
export const setImmediate = <T, C extends CB<T> = CB<T>>(callback: C) => {
    // let result;
    // Promise.resolve(callback).then((value) => result = value());

    // return result;

    return new Promise((resolve) => {
        setTimeout(() => resolve(callback()), 0);
    });
};
