import { QueueName } from "./queues";

export interface Patient {
  PatientId: string;
  Priority: number;
  CurrentQueues: QueueName[];
  CurrentTreatments: QueueName[];
  NextQueues: QueueName[][];

  WaitStartTimes: { [key: string]: number };      // timestamp כניסה לתור המתנה
  TreatmentStartTime: { [key: string]: number }; // timestamp תחילת טיפול
  TreatmentDuration: { [key: string]: number };  // כמה זמן טיפול לוקח (ms)

  Name?: string;
  Phone?: string;
}
