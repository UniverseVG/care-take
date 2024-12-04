/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatDateTime } from "@/lib/utils";
import { Patient } from "@/types/appwrite.types";
import Image from "next/image";

const ViewPatientDetail = ({ patient }: { patient: Patient }) => {
  return (
    <div>
      <section className="space-y-4">
        <div className="mb-4 space-y-1">
          <h2 className="sub-header">Personal Information</h2>
        </div>

        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Name :</p>
          <p className="first-letter:capitalize text-12">{patient.name}</p>
        </div>
        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Email :</p>
          <p className="text-12">{patient.email}</p>
        </div>

        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Phone :</p>
          <p className="text-12">{patient.phone}</p>
        </div>
        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Gender :</p>
          <p className="text-12">{patient.gender}</p>
        </div>
        <div className="flex items-start gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Date of Birth :</p>
          <p className="text-12">
            {formatDateTime(patient.birthDate).dateOnly}
          </p>
        </div>
        <div className="flex items-start gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Address :</p>
          <p className="text-12">{patient.address}</p>
        </div>
        <div className="flex items-start gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Occupation:</p>
          <p className="text-12">{patient.occupation}</p>
        </div>
        <div className="flex items-start gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">
            Emergency Contact Name :
          </p>
          <p className="text-12">{patient.emergencyContactName}</p>
        </div>
        <div className="flex items-start gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">
            Emergency Contact Number :
          </p>
          <p className="text-12">{patient.emergencyContactNumber}</p>
        </div>
      </section>

      <section className="my-12 space-y-4">
        <div className="mb-4">
          <h2 className="sub-header">Medical Information</h2>
        </div>
        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Primary Doctor :</p>
          <div className="flex items-center gap-2">
            <Image
              src={patient?.doctor?.photoUrl || "/assets/images/dr-green.png"}
              alt="doctor"
              width={100}
              height={100}
              className="size-8"
            />
            <p className="whitespace-nowrap">Dr. {patient.doctor?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Doctor Specialty :</p>
          <p className="text-12">{patient.doctorProfession}</p>
        </div>
        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Past Medical History :</p>
          <p className="text-12">{patient.pastMedicalHistory}</p>
        </div>
        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Allergies :</p>
          <p className="text-12">{patient.allergies}</p>
        </div>
        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">
            Current Medication (If any) :
          </p>
          <p className="text-12">{patient.currentMedication}</p>
        </div>
        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">
            Family Medical History (If any) :
          </p>
          <p className="text-12">{patient.familyMedicalHistory}</p>
        </div>
        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Insurance Provider :</p>
          <p className="text-12">{patient.insuranceProvider}</p>
        </div>
        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">
            Insurance Policy Number :
          </p>
          <p className="text-12">{patient.insurancePolicyNumber}</p>
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <div className="mb-4">
          <h2 className="sub-header">Identification And Verification</h2>
        </div>

        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Identification Type :</p>
          <p className="text-12">{patient.identificationType}</p>
        </div>
        <div className="flex items-center gap-2 w-full mb-2">
          <p className="font-bold whitespace-nowrap">Identification Number :</p>
          <p className="text-12">{patient.identificationNumber}</p>
        </div>
        <div className="flex-col items-center w-full mb-2">
          <p className="font-bold whitespace-nowrap">
            Scanned copy of Identification Document:
          </p>
          <div className="w-full">
            <Image
              src={patient.identificationDocumentUrl}
              alt="doctor"
              layout="responsive"
              width={100}
              height={400}
              className="mt-2"
              quality={100}
            />
          </div>
        </div>
      </section>
      {/* <SubmitButton>Get Started</SubmitButton> */}
    </div>
  );
};
export default ViewPatientDetail;
