import { QueueName } from "./queues";

export type Status = "waiting" | "in-treatment" | "done";

export interface Patient {
  PatientId: string;
  Priority: number;
  CurrentQueues: QueueName[];
  CurrentTreatments: QueueName[];
  NextQueues: QueueName[][];
  Status: Status;

  WaitStartTimes: { [key: string]: number };      // timestamp כניסה לתור המתנה
  WaitDurations: { [key: string]: number };       // כמה זמן לחכות בתור (ms)
  TreatmentStartTimes: { [key: string]: number }; // timestamp תחילת טיפול
  TreatmentDurations: { [key: string]: number };  // כמה זמן טיפול לוקח (ms)

  Name?: string;
  Phone?: string;
}
