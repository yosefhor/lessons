import { injectRandomPatient } from "./injector.js";
import { insertPatient } from "./db.js";
export async function handler(event) {
    const patient = injectRandomPatient();
    await insertPatient(patient);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Patient injected", patientId: patient.PatientId }),
    };
}
