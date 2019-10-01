import { Cursor } from 'mongodb';
import { Event, EventName, FindEventOptions } from '../../model/event';
import { CustomMongoClient } from '../mongo';
import { lazyInit, rejectOnError } from '../../util/repoUtil';
import { Read } from '../interfaces'
import { Readable } from 'stream';

let mongo: CustomMongoClient;

class MongoRead implements Read {
    async findEvents<T extends Event>(
        eventType: EventName,
        iterationId: number,
        options: FindEventOptions
    ): Promise<Readable> {
        try {
            // TODO: implement all search options
            const { fromDate, afterVersion, withConnections } = options;
            mongo = await lazyInit(mongo);
            const result: Cursor<T> = mongo.db
                .collection(eventType)
                .find({ iterationId, ...(fromDate ? { timestamp: { $gte: fromDate } } : {}) })
                .project({
                    _id: 0,
                })
                .sort({ timestamp: 1 });
            return result;
        } catch (error) {
            return rejectOnError<Cursor<T>>(mongo, error);
        }
    }
}

const mongoRead = new MongoRead();

export { mongoRead };
