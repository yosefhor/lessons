import { parentPort, workerData } from "worker_threads";

let total = 0;
for (const num of workerData) {
    total +=num;
}

parentPort?.postMessage(total)