import { Request, Response, NextFunction } from 'express';
import { writeEvent } from '../model/write/writeEvent';

const writeEventHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {} = req.body;
}

export { writeEventHandler };
