export enum EventType {
    PERSON,
    SEARCH
}

export namespace EventType {
    export function asString(eventType: EventType): string {
        return EventType[eventType];
    }

    export function parse(eventType: string): EventType {
        return Object
            .keys(EventType)
            .map(key => ({ key, num: Number(key) }))
            .filter(tup => Number.isNaN(tup.num))
            .reduceRight<number>((ans, cur, idx) => cur.key == eventType ? idx : ans, -1);
    }
}

export interface FindEventOptions {
    fromDate?: Date,
    withConnections?: boolean,
    afterVersion?: string
}

export interface Event {
    eventName: EventType,
    id?: number,
    status?: string,
    connections?: [Event],
    timestamp?: number,
    version?: string,
}

export interface PersonEvent extends Event {
    eventName: EventType.PERSON,
    status: 'unidentified' | 'fuzzy' | 'found'
    connections: [SearchEvent],
}

export interface SearchEvent extends Event {
    eventName: EventType.SEARCH,
    status: 'started' | 'stuck' | 'finished:results' | 'finished:no-results'
    connections: [PersonEvent]
}
