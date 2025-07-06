import { QueueName } from "./queues";

export type Status = "waiting" | "in-treatment" | "done";

export interface Patient {
  PatientId: string;
  Priority: number; // 1-10
  CurrentQueues: QueueName[];     // תורים שהחולה ממתין להם עכשיו
  CurrentTreatments: QueueName[]; // תורים שהחולה בטיפול בהם עכשיו
  NextQueues: QueueName[][];      // שאר המסלול (שלבים)
  Status: Status;

  WaitStartTimes: Record<QueueName, number>;      // timestamp כניסה לתור המתנה
  WaitDurations: Record<QueueName, number>;       // כמה זמן לחכות בתור (ms)
  TreatmentStartTimes: Record<QueueName, number>; // timestamp תחילת טיפול
  TreatmentDurations: Record<QueueName, number>;  // כמה זמן טיפול לוקח (ms)
}
