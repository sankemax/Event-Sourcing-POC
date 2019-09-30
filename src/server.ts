import express, { Request, Response, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import { apiRouter } from './router/api'
import { closeConnection } from './repository/eventRepo';

const server = express();
const port = process.env.PORT || 3001;

const errorHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
}

server
    .use(json())
    .use(urlencoded({ extended: true }))
    .use('/', express.static(`${__dirname}/public`))
    .use('/api', apiRouter)
    .use(errorHandler)

server
    .listen(port, () => console.log(`listening on port ${port}`))
    .on('close', closeConnection)
