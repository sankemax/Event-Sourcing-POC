import { v4 as uuid } from 'uuid';
import { ObjectID } from 'bson';
import { lazyInit , rejectOnError, } from '../../util/repoUtil';
import { CustomMongoClient } from '../mongo';
import { EventName } from '../../model/event';

let mongo: CustomMongoClient;

async function appendEvent(eventType: EventName, event: object): Promise<ObjectID> {
    try {
        mongo = await lazyInit(mongo);
        return (await mongo.db
            .collection(eventType)
            .insertOne({
                ...event,
                timestamp: Date.now(),
                version: uuid()
            })
        ).insertedId
    } catch (error) {
        return rejectOnError<ObjectID>(mongo, error);
    }
}

export { appendEvent };
