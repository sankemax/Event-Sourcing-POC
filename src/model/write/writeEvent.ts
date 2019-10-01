import { ObjectID, } from 'mongodb';
import { EventName, Event } from '../event';
import { appendEvent } from '../../repository/write/writeRepo';

async function writeEvent<E extends Event>(event: E): Promise<ObjectID> {
    // TODO schema validation
    // TODO should i: find last id inserted -> business logic ->
    //                before insertion -> validate last ID is same

    return await appendEvent(event);
}

export { writeEvent, };
