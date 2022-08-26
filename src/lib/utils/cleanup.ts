import { forEach } from "$lib/utils/array";

let hasBeenInitialized = false;
type CallbackID = string;
type Callback<T extends any> = (payload?: T) => void;
type CallbacksToUnload<T extends Callback<T>> = Map<string, Callback<T>[]>;
const tasksToDo: CallbacksToUnload<any> = new Map<CallbackID, Callback<any>[]>();
if (!import.meta.env.SSR) {
    window.addEventListener(
        "beforeunload",
        (event) => {
            event.preventDefault();
            for (const [id, task] of tasksToDo.entries()) {
                // alert("testing");
                /** console.log(id); */
                forEach(task, (cb) => cb());
            }
            tasksToDo.clear();
        },
        { capture: true }
    );
}
export function doOnUnload<T>(id: string, task: Callback<T>): void;
export function doOnUnload<T>(id: string, ...task: Callback<T>[]): void {
    hasBeenInitialized = true;
    const taskQueue = tasksToDo.get(id) ?? [];
    if (task instanceof Array) {
        taskQueue.push(...task);
        // return;
    } else {
        taskQueue.push(task);
    }
    tasksToDo.set(id, taskQueue);
    if (hasBeenInitialized) {
        /** console.log("already initialized!"); */
        return;
    }
}