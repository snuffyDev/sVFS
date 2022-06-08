/**
 * @description Type T is possibly undefined
 *
 * @export
 * @typedef {Maybe}
 * @template T
 */
export type Maybe<T> = T | undefined;
/**
 * @export
 * @typedef {VoidCallback}
 * @template T
 */
export type VoidCallback<T> = (item: T, index: number, array: Array<T>) => void;
/**
 * @export
 * @typedef {ItemCallback}
 * @template T
 * @template U
 */
export type ItemCallback<T, U> = (item: T, index: number, array: Array<T>) => U;

/**
 * @export
 * @typedef {MaybeItemCallback}
 * @template T
 */
export type MaybeItemCallback<T> = (item: T, index: number, array: Array<T>) => Maybe<T>;

/**
 * Returns the first matching element in the array.
 *
 * @export
 * @template T
 * @param {Array<T>} array
 * @param {(item: T) => T} predicate
 * @returns {(T | undefined)}
 */
export function findFirst<T>(array: Array<T>, predicate: (item: T) => T): T | undefined {
    const length = array.length;
    let idx = -1;
    for (; ++idx < length;) {
        if (predicate(array[idx])) {
            return array[idx];
        }
    }
    return undefined;
}

/**
 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 *
 * @export
 * @template T
 * @param {Array<T>} array
 * @param {(previousValue: T, currentValue: T, index: number, array: Array<T>) => T} callback
 * @param {T} thisArg
 * @returns {T, thisArg: T) => T}
 */
export function reduce<T>(
    array: Array<T>,
    callback: (previousValue: T, currentValue: T, index: number, array: Array<T>) => T,
    thisArg: T,
): T {
    let result = thisArg,
        length = array.length,
        idx = -1;
    for (; ++idx < length;) {
        result = callback(result, array[idx], idx, array);
    }
    (length = null), (idx = null);
    return result;
}

/**
 * Returns the last matching item in the array.
 *
 * @export
 * @template T
 * @param {Array<T>} array
 * @param {(item: T) => T} predicate
 * @returns {Maybe<T>}
 */
export function findLast<T>(array: Array<T>, predicate: (item: T) => T): Maybe<T> {
    let len = array.length;
    for (; len--;) {
        if (predicate(array[len])) {
            return array[len];
        }
    }
    return undefined;
}
/**
 * @description finds all elements that match the specified predicate
 * @template T
 * @param {Array<T>} array
 * @param {(item: T) => T} predicate
 * @returns {T[]} All matching elements in the array
 *
 * @example
 * const berries = findAll(["apple", "blueberry", "strawberry"],
 * (item) => item.includes('berry'));
 *
 * /// result: ["blueberry", "strawberry"]
 */
export function findAll<T>(array: Array<T>, predicate: (item: T) => T): T[] {
    let idx = -1;
    let curIdx = 0;
    const length = array.length;
    const result: T[] = [];

    for (; ++idx < length;) {
        if (predicate(array[idx])) {
            result[curIdx++] = array[idx];
        }
    }
    return result;
}

/**
 * Runs the specified callback for each item in the array
 *
 * @export
 * @template T
 * @param {Array<T>} array
 * @param {VoidCallback<T>} cb
 */
export function forEach<T>(array: Array<T>, cb: VoidCallback<T>): void {
    const len = array.length;
    let idx = -1;
    for (; ++idx < len;) {
        cb(array[idx], idx, array);
    }
    idx = null;
}

/**
 * Runs the specified callback for each item in the array,
 * and returns the results in a new array.
 * @export
 * @template T
 * @template U
 * @param {Array<T>} array
 * @param {ItemCallback<T, U>} cb
 * @returns {U[]}
 */
export function map<T, U>(array: Array<T>, cb: ItemCallback<T, U>): U[] {
    let idx = -1;
    const length = array.length;
    const newArray: U[] = Array(length);
    for (; ++idx < length;) {
        newArray[idx] = cb(array[idx], idx, array);
    }
    idx = null;
    return newArray;
}

/**
 * Runs the first specified callback for each item in the array,
 * and uses the second predicate callback to filter the results.
 * Returns the results in a new array.
 *
 * @export
 * @template T
 * @template U
 * @param {Array<T>} array
 * @param {ItemCallback<T, U>} cb
 * @param {(item: Partial<T>) => boolean} predicate
 * @returns {T[]}
 */
export function filterMap<T, U>(
    array: Array<T>,
    cb: ItemCallback<T, T>,
    predicate: (item: T) => item is T,
): T[] {
    let idx = -1;
    const length = array.length;
    const result: T[] = [];
    for (; ++idx < length;) {
        const res = cb(array[idx], idx, array);
        if (predicate(res)) {
            result[idx] = array[idx];
        }
    }
    idx = null;
    return result as T[];
}
/**
 * Returns a new array that's filtered using the specified predicate function
 *
 * @export
 * @template T
 * @param {Array<T>} array
 * @param {(item: Partial<T>) => boolean} predicate
 * @returns {T[]}
 */
export function filter<T, S>(array: Array<T>, predicate: (item: Maybe<T>) => S): S[] {
    let idx = -1,
        curPos = 0;
    const result: S[] = [],
        length = array.length;
    for (; ++idx < length;) {
        if (predicate(array[idx])) {
            result[curPos] = (array[idx] as unknown) as S;
            curPos++;
        }
    }
    return result;
}

/**
 * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
 *
 * @export
 * @template T
 * @param {Array<T>} array
 * @param {number} spliceIndex
 * @param {number} itemsToRemove
 * @param {...unknown[]} items
 * @returns {Maybe<T[]>}
 */
export function splice<T>(
    array: Array<T>,
    spliceIndex: number,
    itemsToRemove: number,
    ...items: unknown[]
): Maybe<T[]> {
    const deleted = array.slice(spliceIndex, spliceIndex + itemsToRemove);
    let inserted: Array<unknown> = [];
    if (!items) {
        inserted = [...array.slice(0, spliceIndex), ...array.slice(spliceIndex + itemsToRemove)];
    } else {
        inserted = [...array.slice(0, spliceIndex), ...items, ...array.slice(spliceIndex + itemsToRemove)];
    }
    array.length = 0;
    array.push.apply(array, inserted);
    return deleted;
}
