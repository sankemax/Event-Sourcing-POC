import { mergeDeepWith, mergeDeepRight, } from 'ramda';
import { Cursor } from 'mongodb';
import { parseJsonIfValid, mergeFn } from '../../util/transformUtil';
import { mongoRead } from '../../repository/read/readRepo';
import {
    EventName,
    FindEventOptions,
    Event
} from '../event';

async function readEvent<E extends Event>(
    iterationId: number,
    eventName: EventName,
    options: FindEventOptions = { aggregate: false }
): Promise<E[]> {
    // TODO: schema validation
    const cursor = await mongoRead.findEvents(eventName, iterationId, options) as Cursor<E>;
    const progression = await handleEventCursor(cursor, options);
    return progression as E[];
}

async function handleEventCursor<E extends Event>(
    eventCursor: Cursor<E>,
    options: FindEventOptions
): Promise<E[]> {
    const { aggregate } = options;
    let progression: E[] = [] as E[];
    try {
        while (await eventCursor.hasNext()) {
            const event: E = await eventCursor.next() as E;
            if (progression.length == 0) {
                progression = [event];
                continue;
            }
            progression = [...progression, aggregate ? handleAggregate(event, progression) : event];
        }
        return progression;
    } finally {
        eventCursor.close();
    }
}

function handleAggregate<T extends Event>(event: T, progression: T[]): T {
    const mergeStrategy = operationStrategy[event.operation || 'APPEND'];
    const pastEvent = progression[progression.length - 1];
    const pastEventData = pastEvent.data;
    const { data, ...info } = event;
    if (!data) {
        return { ...info, data: pastEventData } as T;
    }
    if (!pastEventData) {
        return event;
    }
    const parsedPastData = parseJsonIfValid(pastEvent.data);
    const parsedData = parseJsonIfValid(data);
    if (typeof parsedData != 'object' || typeof parsedPastData != 'object') {
        return { ...info, data: [ parsedPastData, parsedData ] } as T;
    }
    return { ...info, data: mergeStrategy(parsedPastData, parsedData) } as T;
}

const operationStrategy = {
    'APPEND': (pastEventData: object, data: object) => mergeDeepWith(mergeFn, pastEventData, data),
    'PATCH': (pastEventData: object, data: object) => mergeDeepRight(pastEventData, data),
    'REMOVE': () => { }, // TODO: remove
}

export { readEvent };
