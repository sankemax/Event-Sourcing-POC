import { writeEvent } from './models/write/writeEvent';
import { EventsEnum } from './config/events'
import { closeConnection } from './repository/mongoRepo';
import { readEvent } from './models/read/findEvent';

async function check() {
    try {
        // const idS = await writeEvent(EventsEnum.search, { id: 344, status: 'started' })
        // const idF = await writeEvent(EventsEnum.search, { id: 344, status: 'foundResult', result: 'im a hairy dude' })
        // const idFin = await writeEvent(EventsEnum.search, { id: 344, status: 'finished' })
        // console.log('start', idS, 'found', idF, 'closed', idFin);

        const sourced = await readEvent(EventsEnum.search, 344);
        console.log(sourced);
        closeConnection();

    } catch (error) {
        console.error(error);
    }
}

check()
