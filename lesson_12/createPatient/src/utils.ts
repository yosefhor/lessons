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
