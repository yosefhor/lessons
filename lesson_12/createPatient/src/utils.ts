//For simulating only!!!
let id = 0;
export function generatePatientId(): string {
  return `P-${id++}`;
}

// return random in ms
export function randomMinutesToMs(min: number, max: number): number {
  const minutes = Math.floor(Math.random() * (max - min + 1)) + min;
  return minutes * 60 * 1000;
}

export function now(): number {
  return Date.now();
}

/**
 * מחזיר מחרוזת לצורך מיון לפי עדיפות גבוהה → נמוכה ואז לפי זמן מוקדם → מאוחר
 * משתמש בפורמט: "00#1699999999999" כשה-00 מייצג את 10 - priority
 */
export function formatPriorityAndTime(priority: number, time: number): string {
  const reversedPriority = (10 - priority).toString().padStart(2, "0"); // 00=הכי דחוף
  const paddedTime = time.toString().padStart(13, "0"); // למיון לפי זמן
  return `${reversedPriority}#${paddedTime}`;
}