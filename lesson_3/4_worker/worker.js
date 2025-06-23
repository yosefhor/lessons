import { parentPort, workerData } from "worker_threads";

let sum = 0;
for (let i = 0; i < workerData; i++) {
    sum ++;
}

parentPort?.postMessage(sum)