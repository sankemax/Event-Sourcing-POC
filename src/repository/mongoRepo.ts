import { client, Client } from '../config/mongo';
import { EventsEnum } from '../config/events';
import { ObjectID } from 'bson';

let mongo: Client;

async function appendEvent(eventType: EventsEnum, event: object): Promise<ObjectID> {
    try {
        await initClient();
        return (await mongo.db
            .collection(eventType)
            .insertOne({
                ...event,
                timestamp: Date.now()
            })
        ).insertedId

    } catch (error) {
        return rejectOnError<ObjectID>(error);
    }
}

async function findEvents(eventType: EventsEnum, id: any, from?: Date): Promise<any[]> {
    try {
        await initClient();
        // TODO respond with cursor so I will be able to play with the results
        return await mongo.db
            .collection(eventType)
            .find({ id, ...(from ? { timestamp: { $gte: from } } : {} )})
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

function closeConnection(): Client {
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