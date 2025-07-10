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
    Priority: Math.ceil(Math.random() * 10),
    CurrentQueues: [...firstStep],
    CurrentTreatments: null,
    NextQueues: route.slice(1),

    WaitStartTimes: {},
    TreatmentStartTime: {},
    TreatmentDuration: {},

    Name: `חולה ${Math.floor(Math.random() * 1000)}`,
    Phone: `050-${Math.floor(Math.random() * 10000000)}`,
  };

  const currentTime = now();

  // מגדיר זמנים אקראיים לכל תור בשלב הראשון
  for (const queue of patient.CurrentQueues) {
    patient.WaitStartTimes[queue] = currentTime;
    patient.TreatmentStartTime[queue] = 0;
    patient.TreatmentDuration[queue] = randomMinutesToMs(2, 5);
  }

  return patient;
}
