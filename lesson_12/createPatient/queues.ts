export const Queues = {
  NurseAssessment: "NurseAssessment",
  Doctor: "Doctor",
  XRay: "XRay",
  MRI: "MRI",
  BloodTest: "BloodTest",
  LabAnalysis: "LabAnalysis",
  Gibush: "Gibush",
  ECG: "ECG",
  Pharmacy: "Pharmacy",
  ObservationRoom: "ObservationRoom",
  Admission: "Admission",
  Discharge: "Discharge",
  GeneralERQueue: "GeneralERQueue",
} as const;

export type QueueName = typeof Queues[keyof typeof Queues];

export const MedicalScenarios: Record<string, QueueName[][]> = {
  ArmFracture: [
    [Queues.NurseAssessment],
    [Queues.Doctor],
    [Queues.XRay],
    [Queues.Doctor],
    [Queues.Gibush],
    [Queues.Pharmacy],
    [Queues.Discharge],
  ],

  SevereAbdominalPain: [
    [Queues.NurseAssessment],
    [Queues.Doctor],
    [Queues.BloodTest, Queues.XRay], // שלב מקבילי
    [Queues.LabAnalysis],
    [Queues.Doctor],
    [Queues.Pharmacy],
    [Queues.ObservationRoom],
  ],

  StrokeSymptoms: [
    [Queues.NurseAssessment],
    [Queues.Doctor],
    [Queues.ECG],
    [Queues.MRI],
    [Queues.Doctor],
    [Queues.Admission],
  ],

  HighFeverChild: [
    [Queues.NurseAssessment],
    [Queues.Doctor],
    [Queues.BloodTest],
    [Queues.LabAnalysis],
    [Queues.Doctor],
    [Queues.Pharmacy],
    [Queues.Discharge],
  ],

  ChestPain: [
    [Queues.NurseAssessment],
    [Queues.Doctor],
    [Queues.ECG, Queues.BloodTest], // מקבילי
    [Queues.LabAnalysis],
    [Queues.Doctor],
    [Queues.ObservationRoom],
    [Queues.Admission],
  ],

  DeepLaceration: [
    [Queues.NurseAssessment],
    [Queues.Doctor],
    [Queues.Gibush],
    [Queues.Pharmacy],
    [Queues.Discharge],
  ],

  AcuteShortnessOfBreath: [
    [Queues.NurseAssessment],
    [Queues.Doctor],
    [Queues.XRay, Queues.BloodTest], // מקבילי
    [Queues.LabAnalysis],
    [Queues.Doctor],
    [Queues.ObservationRoom],
  ],

  SevereAllergyRash: [
    [Queues.NurseAssessment],
    [Queues.Doctor],
    [Queues.Pharmacy],
    [Queues.ObservationRoom],
    [Queues.Discharge],
  ],

  HeadTrauma: [
    [Queues.NurseAssessment],
    [Queues.Doctor],
    [Queues.XRay], // במציאות: יכול להיות XRay או MRI, כאן לדוגמה XRay
    [Queues.ObservationRoom],
    [Queues.Doctor],
    [Queues.Discharge],
  ],

  ChronicBackPain: [
    [Queues.NurseAssessment],
    [Queues.Doctor],
    [Queues.MRI],
    [Queues.Doctor],
    [Queues.Pharmacy],
    [Queues.Discharge],
  ],
};
