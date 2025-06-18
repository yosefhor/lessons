import fs from 'fs';
import readline from 'readline';

const fileNameRl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

fileNameRl.question('please enter the full file name(for example: numbers.txt):', (fileName) => {
    handleReading(fileName)
    fileNameRl.close();
})

const handleReading = (fileName) => {
    let sum = 0;
    let hasError = false;

    if (!fs.existsSync(fileName)) return handleError('please check the fileName and try again!');

    const fileStream = fs.createReadStream(fileName, 'utf8');

    const fileContentRl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    fileContentRl.on('line', (line) => {
        if (hasError) return
        const lineValue = Number(line);
        if (Number.isNaN(lineValue)) {
            hasError = true;
            handleError('please make sure the file contains numbers only!');
            fileStream.destroy();
            return
        }
        sum += lineValue
    })
    
    fileContentRl.on('close', () => {
        if (hasError) return    
        console.log(sum);
    })
}

const handleError = (errMessage) => {
    console.log(`Error: ${errMessage}`);
}

