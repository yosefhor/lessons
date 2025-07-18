import { Patient } from "../../shared/types";
import { MedicalScenarios } from "../../shared/queues";
import { generatePatientId } from "../../shared/utils";

export function injectRandomPatient(): Patient {
  const scenarios = Object.keys(MedicalScenarios);
  const scenarioName = scenarios[Math.floor(Math.random() * scenarios.length)];
  const route = MedicalScenarios[scenarioName];

  const patient: Patient = {
    PatientId: generatePatientId(),
    Priority: Math.ceil(Math.random() * 10),
    WaitingQueues: [...route],
    
    Name: `person ${Math.floor(Math.random() * 1000)}`,
    Phone: `050-${(Math.floor(Math.random() * 10000000)).toString().padStart(7, '0')}`,
  };

  return patient;
}
