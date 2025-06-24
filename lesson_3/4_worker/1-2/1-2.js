import { Worker } from 'worker_threads';

const runWorker = (data) => {
    const worker = new Worker('./worker.js', { workerData: data });
    worker.on('message', message => { console.log(message) })
    worker.on('error', error => { console.log(error) })
    worker.on('exit', code => { if (code !== 0) console.log(`Error code: ${code}`) })
}

runWorker([8, 3, 398, 903, 667, 2])