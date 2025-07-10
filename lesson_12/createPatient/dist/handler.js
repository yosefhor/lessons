import { injectRandomPatient } from "./injector";
import { insertPatient } from "./insertPatient";
export async function handler(event) {
    const patient = injectRandomPatient();
    try {
        await insertPatient(patient);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "✅ פציינט הוזן בהצלחה",
                patientId: patient.PatientId
            })
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "❌ שגיאה בהכנסת הפציינט",
                error: error.message
            })
        };
    }
}
