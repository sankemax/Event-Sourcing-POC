import { findEvents } from '../../repository/mongoRepo';
import { Event, EventType, FindEventOptions } from '../../config/events';

async function readEvent(
    id: number,
    eventType: EventType,
    options?: FindEventOptions
): Promise<any[]> {
    // TODO schema validation
    const eventSource = await findEvents(eventType, id, options);
    return eventSource.reduceRight((final, cur) => ({ ...final, ...cur }), {});
}

export { readEvent };
