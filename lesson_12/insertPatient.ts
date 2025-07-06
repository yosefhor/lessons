let patientId = 1

export async function insertPatient(
    patient: {
        name: string
        age: number
        phone: string
        Scenario: string
        priority: number
        currentQueue: string
    },
) {
    const { name, age, Phone, Scenario, priority, currentQueue } = patient

    const params = {
        TableName: "PatientsQueue",
        Item: {
            PatientId: patientId,
            Name: name,
            Age: age,
            Phone: Phone,
            Scenario: Scenario,
            PriorityAndTime: `${priority}#${Date.now()}`,
            CurrentQueue: currentQueue,
            RegistrationDate: new Date().toISOString(),
        },
    }

    // Insert the patient into the DynamoDB table
    await client.send(new PutCommand(params))
}