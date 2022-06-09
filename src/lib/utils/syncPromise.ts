import type { Maybe } from "$lib/types/util";
import { forEach } from "./array";
import { setImmediate } from "./setImmediate";
let isResolving = false;
const callbacks: ({ args: any | any[], name: string; })[] = [];

const resolver = Promise.resolve();

let queue: { resolve: (value: unknown) => void; }[] = [];

const thePromise = new Promise((resolve) => {
    queue.push({ resolve });
    resolve(queue);
});

let resolveTimeout: NodeJS.Timeout;

export function syncPromise<T>(callback: (...args) => T,) {
    // setTimeout();


    async function deactivate() {
        if (thePromise) await thePromise;


        return Promise.resolve();
    }
    return async function (...args) {
        let cb = {
            args,
            name: callback.name
        };
        callbacks.push(cb);
        try {

            await thePromise;
            return await callback.apply(this, args);
        } finally {
            callbacks.shift();

            if (callbacks.length === 0) {
                if (!resolveTimeout) clearTimeout(resolveTimeout);
                resolveTimeout = setTimeout(deactivate.bind(this), 500);
            }
        }
    };
};