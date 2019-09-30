import { v4 as uuid } from 'uuid';
import { ObjectID } from 'bson';
import { client, CustomMongoClient } from '../config/mongo';
import { EventName, FindEventOptions, Event } from '../config/events';
import { Cursor } from 'mongodb';

let mongo: CustomMongoClient;

async function appendEvent(eventType: EventName, event: object): Promise<ObjectID> {
    try {
        await initClient();
        return (await mongo.db
            .collection(eventType)
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

async function findEvents<E extends Event>(
    eventType: EventName,
    iterationId: number,
    options: FindEventOptions
): Promise<Cursor<E>> {
    try {
        // TODO implement all search options
        const { fromDate, afterVersion, withConnections } = options;
        await initClient();
        const result: Cursor<E> = mongo.db
            .collection(eventType)
            .find({ iterationId, ...(fromDate ? { timestamp: { $gte: fromDate } } : {}) })
            .project({
                _id: 0,
            })
            .sort({ timestamp: 1 });
        return result;
    } catch (error) {
        return rejectOnError<Cursor<E>>(error);
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
