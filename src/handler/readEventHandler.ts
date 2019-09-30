import { Response, Request, NextFunction } from 'express';
import { EventName } from '../model/event'
import { readEvent } from '../model/read/findEvent';

const readEventHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { iterationId, eventName, aggregate } = req.body;
    const [escapedId, escapedName, booleanAggregate] =
        [Number(escape(iterationId)), escape(eventName), Boolean(aggregate)] as [number, EventName, boolean]
    if (!escapedId || !escapedName || booleanAggregate == null) {
        throw new Error('not enough params');
    }
    const sourced = await readEvent(escapedId, escapedName, { aggregate });
    res.status(200).json({ query: { iterationId }, data: sourced })
}

export { readEventHandler };
