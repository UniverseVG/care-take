import { Models } from "node-appwrite";

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryDoctor: string;
  doctorProfession?: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
  doctor: Doctor;
}

export interface Doctor extends Models.Document {
  id: string;
  photo: FormData | undefined;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  qualification: string;
  profession: string;
  license: FormData | undefined;
}

export interface Appointment extends Models.Document {
  patient: Patient;
  doctorId: Doctor;
  schedule: Date;
  status: Status;
  doctor: string;
  doctorProfession?: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}
