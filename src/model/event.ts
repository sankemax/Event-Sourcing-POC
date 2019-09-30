export type EventName =
    'person_event' |
    'search_event'

export type Operation =
    'APPEND' |
    'REMOVE' |
    'PATCH'

export interface FindEventOptions {
    aggregate: boolean,
    fromDate?: Date,
    withConnections?: boolean,
    afterVersion?: string
}

export interface Event {
    eventName: EventName,
    operation: Operation,
    data: any,
    iterationId?: number,
    status?: string,
    connections?: SomeEvent[],
    timestamp?: number,
    version?: string
}

export interface PersonEvent extends Event {
    eventName: 'person_event',
    status: 'unidentified' | 'fuzzy' | 'found'
    connections: [SearchEvent],
}

export interface SearchEvent extends Event {
    eventName: 'search_event',
    status: 'started' | 'stuck' | 'finished:results' | 'finished:no-results'
    connections: [PersonEvent]
}

export type SomeEvent =
    PersonEvent |
    SearchEvent
