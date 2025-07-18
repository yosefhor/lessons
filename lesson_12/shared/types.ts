import { QueueName } from "./queues";

export type Status = "waiting" | "in-treatment" | "done";

export interface Patient {
  PatientId: string;
  Priority: number;
  WaitingQueues: QueueName[][];
  CurrentTreatment?: QueueName;
  TreatmentStartTime?: number;
  TreatmentDuration?: number;
  TreatmentEndTime?: number;

  Name?: string;
  Phone?: string;
}
