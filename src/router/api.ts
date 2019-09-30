import express, { Response, Request, NextFunction } from 'express';
import { writeEvent } from '../models/write/writeEvent';
import { EventName } from '../config/events'
import { readEvent } from '../models/read/findEvent';

const eventHandler = async (req: Request, res: Response, next: NextFunction) => {
    // const idS = await writeEvent(EventsEnum.search, { id: 344, status: 'started' })
    // const idF = await writeEvent(EventsEnum.search, { id: 344, status: 'foundResult', result: 'im a hairy dude' })
    // const idFin = await writeEvent(EventsEnum.search, { id: 344, status: 'finished' })
    // console.log('start', idS, 'found', idF, 'closed', idFin);

    const { iterationId, eventName, aggregate } = req.body;
    const [escapedId, escapedName, booleanAggregate] =
        [Number(escape(iterationId)), escape(eventName), Boolean(aggregate)] as [number, EventName, boolean]
    if (!escapedId || !escapedName || booleanAggregate == null) {
        throw new Error('not enough params');
    }
    const sourced = await readEvent(escapedId, escapedName, { aggregate });
    res.status(200).json({ query: { iterationId }, data: sourced })
}

const apiRouter = express.Router()
    .post('/event', eventHandler)
    .post('/append')

export { apiRouter };
