import { Readable } from "stream";
import { ObjectID } from "bson";
import { Event, EventName, FindEventOptions } from "../model/event";

export interface Read {
    findEvents(
        eventType: EventName,
        iterationId: number,
        options: FindEventOptions
    ): Promise<Readable>
}

export interface Write {
    appendEvent<E extends Event>(event: E): Promise<ObjectID>
}
