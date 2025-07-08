import { injectRandomPatient } from "./injector";
import { insertPatient } from "./db";

export async function handler(event: any) {
  const patient = injectRandomPatient();
  await insertPatient(patient);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Patient injected", patientId: patient.PatientId }),
  };
}
