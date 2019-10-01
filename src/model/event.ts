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
    iterationId: number,
    data: any,
    timestamp: number,
    status: string,
    version?: string
}

export interface PersonEvent extends Event {
    eventName: 'person_event',
    status: 'no_core_id' | 'core_id'
}

export interface SearchEvent extends Event {
    eventName: 'search_event',
    status: 'started' |
        'stuck' |
        'result' |
        'finished'
}

export type SomeEvent =
    PersonEvent |
    SearchEvent
