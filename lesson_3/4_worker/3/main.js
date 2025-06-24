import { Worker } from 'worker_threads';

const numOfThreads = 3;

const arraySplitter = (arr, numOfParts) => {
    const breakPoint = Math.ceil(arr.length / numOfThreads);
    let result = [];
    for (let i = 0; i < arr.length; i += breakPoint) {
        const chunk = arr.slice(i, i+breakPoint)
        result.push(chunk)
    }
    return result
}

const runWorker = async (array) => {
    const splitted = arraySplitter(array, numOfThreads);
    const w1 = new Promise((resolve, reject) => {
        const worker = new Worker('./w1.js', { workerData: splitted[0] });
        worker.on('message',message=> {resolve(message)})
        worker.on('error', error=>{reject(error)})
        worker.on('exit', code => { if (code !== 0) reject(`Error code: ${code}`) })
    })
    const w2 = new Promise((resolve, reject) => {
        const worker = new Worker('./w2.js', { workerData: splitted[1] });
        worker.on('message',message=> {resolve(message)})
        worker.on('error', error=>{reject(error)})
        worker.on('exit', code => { if (code !== 0) reject(`Error code: ${code}`) })
    })
    const w3 = new Promise((resolve, reject) => {
        const worker = new Worker('./w3.js', { workerData: splitted[2] });
        worker.on('message',message=> {resolve(message)})
        worker.on('error', error=>{reject(error)})
        worker.on('exit', code => { if (code !== 0) reject(`Error code: ${code}`) })
    })
    const result = await Promise.all([w1, w2, w3])
    let total = 0;
    for (const num of result) {
        total +=num;
    }
    return total
}
const array = [8, 3, 398, 903, 667, 2, 545, 94, 62, 35, 2222, 6, 84, 1, 2, 545, 10, 1516, 51, 35, 64, 6, 4, 46]
const total = await runWorker(array)
console.log(total);
