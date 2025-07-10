export const Queues = {
  NurseAssessment: "NurseAssessment",
  Doctor: "Doctor",
  XRay: "XRay",
  MRI: "MRI",
  BloodTest: "BloodTest",
  LabAnalysis: "LabAnalysis",
  Cast: "Cast",
  ECG: "ECG",
  Pharmacy: "Pharmacy",
  ObservationRoom: "ObservationRoom",
  Admission: "Admission",
  Discharge: "Discharge",
  GeneralERQueue: "GeneralERQueue",
} as const;

export type QueueName = typeof Queues[keyof typeof Queues];

export const QueueNamesList: QueueName[] = Object.values(Queues);