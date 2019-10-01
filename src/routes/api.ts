import express from 'express';
import { readEventHandler } from '../handler/readEventHandler';
import { writeEventHandler } from '../handler/writeEventHandler';

const apiRouter = express.Router()
    .post('/read', readEventHandler)
    .post('/write', writeEventHandler)

export { apiRouter };
