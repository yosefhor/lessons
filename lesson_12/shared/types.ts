import { QueueName } from "./queues";

export type Status = "waiting" | "in-treatment" | "done";

export interface Patient {
  PatientId: string;
  Priority: number;
  WaitingQueues: QueueName[][];
  CurrentTreatment?: QueueName | null;

  WaitStartTimes: { [key: string]: number };      // timestamp כניסה לתור המתנה
  TreatmentStartTime?: number | null; // timestamp תחילת טיפול
  TreatmentDuration?: number | null;  // כמה זמן טיפול לוקח (ms)

  Name?: string;
  Phone?: string;
}
