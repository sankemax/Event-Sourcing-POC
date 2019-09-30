import { Cursor } from 'mongodb';
import { Event, EventName, FindEventOptions } from '../../model/event';
import { CustomMongoClient } from '../mongo';
import { lazyInit, rejectOnError } from '../../util/repoUtil';

let mongo: CustomMongoClient;

async function findEvents<E extends Event>(
    eventType: EventName,
    iterationId: number,
    options: FindEventOptions
): Promise<Cursor<E>> {
    try {
        // TODO implement all search options
        const { fromDate, afterVersion, withConnections } = options;
        mongo = await lazyInit(mongo);
        const result: Cursor<E> = mongo.db
            .collection(eventType)
            .find({ iterationId, ...(fromDate ? { timestamp: { $gte: fromDate } } : {}) })
            .project({
                _id: 0,
            })
            .sort({ timestamp: 1 });
        return result;
    } catch (error) {
        return rejectOnError<Cursor<E>>(mongo, error);
    }
}

export { findEvents };
