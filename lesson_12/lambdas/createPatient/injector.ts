import { Patient } from "../../shared/types";
import { Queues, MedicalScenarios } from "../../shared/queues";
import { generatePatientId, randomTreatmentDuration, now } from "../../shared/utils";

export function injectRandomPatient(): Patient {
  const scenarios = Object.keys(MedicalScenarios);
  const scenarioName = scenarios[Math.floor(Math.random() * scenarios.length)];
  const route = MedicalScenarios[scenarioName];

  const patient: Patient = {
    PatientId: generatePatientId(),
    Priority: Math.ceil(Math.random() * 10),
    WaitingQueues: [...route],
    CurrentTreatment: null,

    WaitStartTimes: {},
    TreatmentStartTime: null,
    TreatmentDuration: null,

    Name: `חולה ${Math.floor(Math.random() * 1000)}`,
    Phone: `050-${Math.floor(Math.random() * 10000000)}`,
  };

  // מגדיר זמנים אקראיים לכל תור בשלב הראשון
  for (const queue of patient.CurrentQueues) {
    patient.WaitStartTimes[queue] = now();
    patient.TreatmentStartTime = 0;
    patient.TreatmentDuration = randomTreatmentDuration(2, 5);
  }

  return patient;
}
