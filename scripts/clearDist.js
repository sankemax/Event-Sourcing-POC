const fs = require('fs');

function deleteFolderRecursive(path = `${__dirname}/../dist`) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path)
            .forEach(file => {
                const curPath = `${path}/${file}`;
                if (fs.lstatSync(curPath).isDirectory()) {
                    deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
        fs.rmdirSync(path);
    } else {
        console.log(`no dist`);
    }
}

deleteFolderRecursive();
