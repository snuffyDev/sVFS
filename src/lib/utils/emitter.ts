import type { IEventEmitter, EventListeners, EventCallback } from "../types/core";

export class EventEmitter implements IEventEmitter {
    private $$event_context: object;
    private _eventQueue = new WeakMap<object, EventListeners<any>>();

    constructor(target: object) {
        this.$$event_context = target;
    }

    dispatch<Events extends Record<string, unknown> = any, Name extends keyof Events = keyof Events>(
        type: Name,
        ...args: any[]
    ): void {
        const queue = this._eventQueue.get(this.$$event_context);

        if (!queue) {
            return;
        }

        const listeners = queue.get(type);

        if (!listeners) return;

        const length = listeners.length;
        let idx = -1;

        for (; ++idx < length;) {
            listeners[idx](args);
        }
    }

    public off<Events extends Record<string, unknown> = any, Name extends keyof Events = keyof Events>(type?: Name, cb?: EventCallback): void {
        const listeners = this._eventQueue.get(this.$$event_context);
        if (!listeners) return;
        if (type === undefined) {
            listeners.clear();

            return;
        }
        if (cb === undefined) {
            listeners.delete(type);
            return;
        }
    }

    public on<T, Events extends Record<string, unknown>, Name extends keyof Events = keyof Events & string>(type: Name, cb: EventCallback<Events[Name]>): void {
        if (!this.$$event_context) return;
        const queue = this._eventQueue.get(this.$$event_context) ?? (new Map() as EventListeners<any>);

        const listeners = queue.get(type) ?? [];
        queue.set(type, listeners.concat(cb));
        // console.log(listeners instanceof Array, listeners);
        this._eventQueue.set(this.$$event_context, queue);
    }
}