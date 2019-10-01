import { ObjectID, } from 'mongodb';
import { Event } from '../event';
import { mongoWrite } from '../../repository/write/writeRepo';

async function writeEvent<E extends Event>(event: E): Promise<ObjectID> {
    // TODO: schema validation
    // TODO: should i: find last id inserted -> business logic ->
    //                before insertion -> validate last ID is same

    return await mongoWrite.appendEvent(event);
}

export { writeEvent, };
