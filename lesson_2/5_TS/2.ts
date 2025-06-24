import { promises as fs } from 'fs';

const readFile = async (fileName: string): Promise<void> => {
    const content: string = await fs.readFile(fileName, 'utf-8')
    const data: string | object = JSON.parse(content)
    console.log(data);
}

readFile('example.txt')