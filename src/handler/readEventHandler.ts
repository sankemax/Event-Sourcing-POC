import { Response, Request } from 'express';
import { readEvent } from '../model/read/findEvent';

const readEventHandler = async (req: Request, res: Response) => {
    const { iterationId, eventName, aggregate } = req.body;
    const sourced = await readEvent(
        Number(iterationId),
        eventName,
        { aggregate: Boolean(aggregate) }
    );
    res.status(200).json({ query: req.body, data: sourced })
}

export { readEventHandler };
