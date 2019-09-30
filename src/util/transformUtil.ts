import { tryCatch, identity } from 'ramda';

function parseJsonIfValid(candidate: any): any {
    if (candidate == null) {
        return candidate;
    }
    return tryCatch(JSON.parse, () => candidate)(candidate);
}

export { parseJsonIfValid };