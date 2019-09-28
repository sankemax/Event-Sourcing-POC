import { findEvents } from '../repository/mongoRepo';
import { EventsEnum } from '../config/events';

async function readEvent(eventType: EventsEnum, id: any, fromDate?: Date): Promise<any[]> {
    // TODO schema validation
    const eventSource = await findEvents(eventType, id, fromDate);
    return eventSource.reduceRight((final, cur) => ({ ...final, ...cur }), {});
}

export { readEvent };