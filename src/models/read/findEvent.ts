import { Cursor } from 'mongodb';
import { mergeDeepWith, mergeDeepRight, concat } from 'ramda';
import { findEvents } from '../../repository/eventRepo';
import {
    EventName,
    FindEventOptions,
    Event
} from '../../config/events';

const operationStrategy = {
    'APPEND': (pastEventData: object, data: object) => mergeDeepWith(mergeFn, pastEventData, data),
    'PATCH': (pastEventData: object, data: object) => mergeDeepRight(pastEventData, data),
    'REMOVE': () => { }, // TODO remove
}

async function readEvent<E extends Event>(
    iterationId: number,
    eventName: EventName,
    options: FindEventOptions = { aggregate: false }
): Promise<E[]> {
    // TODO schema validation
    const cursor = await findEvents(eventName, iterationId, options);
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
            progression = [...progression, aggregate ? handleEvent(event, progression) : event];
        }
        return progression;
    } finally {
        eventCursor.close();
    }
}

function handleEvent<T extends Event>(event: T, progression: T[]): T {
    const mergeStrategy = operationStrategy[event.operation || 'PATCH'];
    const pastEvent = progression[progression.length - 1];
    const pastEventData = pastEvent.data;
    const { data, ...info } = event;
    if (!data) {
        return { ...info, ...{ data: pastEventData } } as T;
    }
    if (!pastEventData) {
        return event;
    }
    return { ...info, ...{ data: { ...mergeStrategy(pastEvent.data, data) } } } as T;
}

function mergeFn(left: any, right: any) {
    switch (true) {
        case Array.isArray(left) && Array.isArray(right):
            return concat(left, right);
        case Array.isArray(left):
            return [...left, right];
        case Array.isArray(right):
            return [left, ...right];
        default:
            return [left, right];
    }
}

export { readEvent };
