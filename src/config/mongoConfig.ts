import fs from 'fs';

const mongoPass: string = fs.readFileSync('../mlabMongoPass', { encoding: 'utf-8' });
const config = {
    mongo: {
        uri: `mongodb+srv://maxim:${encodeURIComponent(mongoPass)}@cluster0-d5zyk.mongodb.net/test?retryWrites=true&w=majority`
    }
}

export { config }
