import fs from 'fs';

function readFile(fileName) {
    return new Promise((resolve, reject) => {

        const fileExist = fs.existsSync(fileName)
        if (!fileExist) reject('File not found')

        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) reject('Content not supported!');
            else resolve(data);
        });
    })
}

readFile('data.txt')
    .then((content) => { console.log(content) })
    .catch((errMessage) => { console.log(errMessage) })