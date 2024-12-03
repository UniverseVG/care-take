/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "male" | "female" | "other";
declare type Status = "pending" | "scheduled" | "cancelled";

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface LoginUserParams {
  email?: string;
  phone?: string;
}

declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryDoctor: string;
  doctorProfession: string;
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
  isRegistrationComplete?: boolean;
  doctor: string;
}

declare interface UpdateUserParams {
  patientId: string;
  patient: RegisterUserParams;
}

declare interface RegisterDoctorParams extends CreateUserParams {
  photo: FormData | undefined;
  birthDate: Date;
  gender: Gender;
  address: string;
  qualification: string;
  profession: string;
  license: FormData | undefined;
}

declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  doctorId?: string;
  doctor: string;
  doctorProfession?: string;
  reason: string;
  schedule: Date;
  status: Status;
  note: string | undefined;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  appointment: Appointment;
  type: string;
};

declare type UpdateDoctorParams = {
  doctorId: string;
  doctor: Doctor;
};

declare interface AdminParams {
  totalCount: number;
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  documents: Appointment[];
}
