import { Worker } from 'worker_threads';

const runWorker = (num) => {
    const worker = new Worker('./worker.js', { workerData: num });
    worker.on('message', message => { console.log(message) })
    worker.on('error', error => { console.log(error) })
    worker.on('exit', code => { console.log(`code: ${code}`) })
}

runWorker(29e8)