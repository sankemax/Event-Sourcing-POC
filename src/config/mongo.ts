import { MongoClient, Db } from 'mongodb';
import fs from 'fs';

export type CustomMongoClient = { db: Db, close: Function }

const mongoPass: string = fs.readFileSync('../mlabMongoPass', { encoding: 'utf-8' });
const uri = `mongodb+srv://maxim:${encodeURIComponent(mongoPass)}@cluster0-d5zyk.mongodb.net/test?retryWrites=true&w=majority`;
const client: Promise<CustomMongoClient> = new MongoClient(
    uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .connect()
    .then((mongo: MongoClient) => ({
        db: mongo.db('event_store'),
        close: () => mongo.isConnected ? mongo.close(true) : void 0
    }))
    .catch(reason => reason);

export { client };
