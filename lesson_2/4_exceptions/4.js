import { promises as fs } from 'fs';

async function checkAndReadFile(fileName) {
    try {
        const data = await fs.readFile(fileName, 'utf-8')
        console.log(data);
    } catch (err) {
        console.error(err.message);
    }
}

checkAndReadFile('example.txt')
checkAndReadFile('exmple.txt')