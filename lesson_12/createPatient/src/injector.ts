import { Patient } from "./types";
import { Queues, MedicalScenarios } from "./queues";
import { generatePatientId, randomMinutesToMs, now } from "./utils";

export function injectRandomPatient(): Patient {
  const scenarios = Object.keys(MedicalScenarios);
  const scenarioName = scenarios[Math.floor(Math.random() * scenarios.length)];
  const route = MedicalScenarios[scenarioName];

  const firstStep = route[0];

  const patient: Patient = {
    PatientId: generatePatientId(),
    Priority: Math.floor(Math.random() * 10) + 1,
    CurrentQueues: [...firstStep],
    CurrentTreatments: [],
    NextQueues: route.slice(1),
    Status: "waiting",

    WaitStartTimes: {},
    WaitDurations: {},
    TreatmentStartTimes: {},
    TreatmentDurations: {},

    Name: `חולה ${Math.floor(Math.random() * 1000)}`,
    Phone: `050-${Math.floor(Math.random() * 10000000)}`,
  };

  const currentTime = now();

  // מגדיר זמנים אקראיים לכל תור בשלב הראשון
  for (const queue of patient.CurrentQueues) {
    patient.WaitStartTimes[queue] = currentTime;
    patient.WaitDurations[queue] = randomMinutesToMs(1, 5);
    patient.TreatmentStartTimes[queue] = 0;
    patient.TreatmentDurations[queue] = randomMinutesToMs(2, 5);
  }

  return patient;
}
