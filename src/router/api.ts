import express, { Response, Request, NextFunction } from 'express';
import { writeEvent } from '../models/write/writeEvent';
import { EventType } from '../config/events'
import { readEvent } from '../models/read/findEvent';

const get = async (req: Request, res: Response, next: NextFunction) => {
    // const idS = await writeEvent(EventsEnum.search, { id: 344, status: 'started' })
    // const idF = await writeEvent(EventsEnum.search, { id: 344, status: 'foundResult', result: 'im a hairy dude' })
    // const idFin = await writeEvent(EventsEnum.search, { id: 344, status: 'finished' })
    // console.log('start', idS, 'found', idF, 'closed', idFin);
    
    const { id, eventType } = req.params;
    const sourced = await readEvent(Number(id), EventType.parse(eventType));
    res.status(200).json({ query: { id }, data: sourced })
}

const base = async (req: Request, res: Response, next: NextFunction) => {
    
}

const apiRouter = express.Router()
    .get('/', base)
    .get('/id/:id', get)
    .post('/append')

export { apiRouter };
