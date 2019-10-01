import { tryCatch, concat } from 'ramda';

function parseJsonIfValid(candidate: any): any {
    if (candidate == null) {
        return candidate;
    }
    return tryCatch(JSON.parse, () => candidate)(candidate);
}

function mapObject(
    obj: object,
    mapFn: (x: [string, unknown]) => [string, unknown]
): object {
    return Object
        .entries(obj)
        .map(mapFn)
        .reduce(
            (obj: any, ent: [string, unknown]) => ({ ...obj, ...{ [ent[0]]: ent[1] } }),
            Object.create(null)
        );
}

function escapeEntry(obj: any) {
    return (entry: [string, unknown]): [string, unknown] =>
        Object.prototype.hasOwnProperty.call(obj, entry[0])
            && typeof entry[1] == 'string'
            ? [entry[0], escape(entry[1])]
            : entry;
}

function mergeFn(left: any, right: any) {
    switch (true) {
        case Array.isArray(left) && Array.isArray(right):
            return concat(left, right);
        case Array.isArray(left):
            return [...left, right];
        case Array.isArray(right):
            return [left, ...right];
        default:
            return [left, right];
    }
}

export { parseJsonIfValid, mergeFn, mapObject, escapeEntry };