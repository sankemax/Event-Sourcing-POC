import { tryCatch, concat } from 'ramda';

function parseJsonIfValid(candidate: any): any {
    if (candidate == null) {
        return candidate;
    }
    return tryCatch(JSON.parse, () => candidate)(candidate);
}

function mapObject(mapFn: any) {
    return (obj: object) => Object
        .entries(obj)
        .map(mapFn)
        .reduce(
            (obj: any, ent: any) => ({ ...obj, ...{ [ent[0]]: ent[1] } }),
            Object.create(null)
        );
}

function escapeEntry(entry: [string, any]): [string, any] {
    return entry[1] == 'string'
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