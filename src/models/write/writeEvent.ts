import { ObjectID, } from 'mongodb';
import { EventName } from '../../config/events';
import { appendEvent } from '../../repository/eventRepo';

async function writeEvent(eventType: EventName, event: object): Promise<ObjectID> {
    // TODO schema validation
    // TODO should i: find last id inserted -> business logic ->
    //                before insertion -> validate last ID is same

    return await appendEvent(eventType, event);
}

export { writeEvent, };
