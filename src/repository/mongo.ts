import { MongoClient, Db } from 'mongodb';
import { config } from '../config/mongoConfig';

export type CustomMongoClient = { db: Db, close: Function }

const client: Promise<CustomMongoClient> = new MongoClient(
    config.mongo.uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .connect()
    .then((mongo: MongoClient) => ({
        db: mongo.db('event_store'),
        close: () => mongo.isConnected() ? mongo.close(true) : void 0
    }))
    .catch(reason => reason);

export { client, };
