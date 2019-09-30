import { tryCatch, concat } from 'ramda';

function parseJsonIfValid(candidate: any): any {
    if (candidate == null) {
        return candidate;
    }
    return tryCatch(JSON.parse, () => candidate)(candidate);
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

export { parseJsonIfValid, mergeFn, };