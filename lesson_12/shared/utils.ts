//For simulating only!!!
let id = 0;
export function generatePatientId(): string {
  return `P-${id++}`;
}

// פונקציה שמחזירה משך טיפול רנדומלי בין 2 ל־5 דקות
export function randomTreatmentDuration(): number {
    const min = 2 * 60 * 1000; // 2 דקות במילישניות
    const max = 5 * 60 * 1000; // 5 דקות
    return Math.floor(Math.random() * (max - min + 1)) + min;
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