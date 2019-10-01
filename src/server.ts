import express, { Request, Response, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import { apiRouter } from './routes/api'
import { closeConnection } from './util/repoUtil';
import { mapObject, escapeEntry } from './util/transformUtil';

const server = express();
const port = process.env.PORT || 3001;

server
    .use(json())
    .use(urlencoded({ extended: true }))
    .use('/', express.static(`${__dirname}/public`))
    .use('/api', [escapeStringsInBody, apiRouter])
    .use(errorHandler)

server
    .listen(port, () => console.log(`listening on port ${port}`))
    .on('close', closeConnection)

function escapeStringsInBody(req: Request, res: Response, next: NextFunction) {
    req.body = mapObject(escapeEntry)(req.body)
    next();
}

async function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
}
