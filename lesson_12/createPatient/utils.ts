import { v4 as uuidv4 } from "uuid";

// יוצר מזהה ייחודי לחולה
export function generatePatientId(): string {
  // דוגמה: P-UUID
  return "P-" + uuidv4();
}

// מחזיר זמן אקראי בין דקות ל־ms
export function randomMinutesToMs(min: number, max: number): number {
  const minutes = Math.floor(Math.random() * (max - min + 1)) + min;
  return minutes * 60 * 1000;
}

// מחזיר timestamp נוכחי ב־ms
export function now(): number {
  return Date.now();
}
