import { v4 as uuid } from 'uuid';
import { ObjectID } from 'bson';
import { client, CustomMongoClient } from '../config/mongo';
import { EventType, FindEventOptions } from '../config/events';

let mongo: CustomMongoClient;

async function appendEvent(eventType: EventType, event: object): Promise<ObjectID> {
    try {
        await initClient();
        return (await mongo.db
            .collection(EventType.asString(eventType))
            .insertOne({
                ...event,
                timestamp: Date.now(),
                version: uuid()
            })
        ).insertedId

    } catch (error) {
        return rejectOnError<ObjectID>(error);
    }
}

async function findEvents(eventType: EventType, id: any, options: FindEventOptions = {}): Promise<any[]> {
    try {
        // TODO implement all searches
        const { fromDate, afterVersion, withConnections } = options;

        await initClient();
        // TODO respond with cursor so I will be able to play with the results
        return await mongo.db
            .collection(EventType.asString(eventType))
            .find({ id, ...(fromDate ? { timestamp: { $gte: fromDate } } : {} )})
            .sort({ timestamp: -1 })
            .toArray();
    } catch (error) {
        return rejectOnError<any[]>(error);
    }
}

async function initClient() {
    if (!mongo) {
        mongo = await client;
    }
}

function closeConnection(): CustomMongoClient {
    if (mongo) {
        mongo.close();
    }
    return mongo;
}

function rejectOnError<T>(error: Error): Promise<T> {
    console.error(error);
    closeConnection();
    return Promise.reject(error);
}

export {
    initClient,
    closeConnection,
    appendEvent,
    findEvents,
};
