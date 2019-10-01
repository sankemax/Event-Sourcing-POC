import { v4 as uuid } from 'uuid';
import { ObjectID } from 'bson';
import { lazyInit , rejectOnError, } from '../../util/repoUtil';
import { CustomMongoClient } from '../mongo';
import { Event } from '../../model/event';

let mongo: CustomMongoClient;

async function appendEvent<E extends Event>(event: E): Promise<ObjectID> {
    try {
        mongo = await lazyInit(mongo);
        return (await mongo.db
            .collection(event.eventName)
            .insertOne({
                ...event,
                version: event.version ? event.version : uuid()
            })
        ).insertedId
    } catch (error) {
        return rejectOnError<ObjectID>(mongo, error);
    }
}

export { appendEvent };
