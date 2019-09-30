import { CustomMongoClient, client } from "../repository/mongo";

async function lazyInit(mongo: CustomMongoClient): Promise<CustomMongoClient> {
    if (!mongo) {
        return await client;
    }
    return client;
}

function closeConnection(mongo: CustomMongoClient): CustomMongoClient {
    if (mongo) {
        mongo.close();
    }
    return mongo;
}

function rejectOnError<T>(mongo: CustomMongoClient, error: Error): Promise<T> {
    console.error(error);
    closeConnection(mongo);
    return Promise.reject(error);
}

export {
    lazyInit,
    closeConnection,
    rejectOnError,
}
