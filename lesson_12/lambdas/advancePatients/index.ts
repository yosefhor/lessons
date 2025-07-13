import { processQueues } from "./processQueues";

export async function handler(event: any): Promise<any> {
  await processQueues();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Queues processed" }),
  };
}
