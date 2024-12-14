"use client";
import Image from "next/image";
import Link from "next/link";

import { greetings } from "@/lib/utils";
import { patientAdminColumns } from "@/components/table/patientAdminCloumns";
import { getPatients } from "@/lib/actions/patient.actions";
import { StatCard } from "@/components/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.action";
import { PatientDataTable } from "@/components/table/PatientDataTable";
import { getDoctors } from "@/lib/actions/doctor.action";
import { useEffect, useState } from "react";
import { Doctor, Patient } from "@/types/appwrite.types";
import { appwriteClient } from "@/lib/appwrite-client.config";
import { toast } from "react-toastify";

const PatientAdmissionPage = () => {
  const [patient, setPatient] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<AdminParams>({
    totalCount: 0,
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    documents: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const fetchAppointments = async () => {
    setIsLoading(true);
    const appointments = await getRecentAppointmentList();
    const patientResult = await getPatients();
    const doctors = await getDoctors();
    setAppointments(appointments);
    setPatient(patientResult);
    setDoctors(doctors);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
    const unsubscribe = appwriteClient.subscribe(
      `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID}.documents`,
      (response: { events: string[]; payload: Patient }) => {
        if (
          response.events.includes(
            `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID}.documents.*.create`
          )
        ) {
          toast.success(
            `A patient has been named ${response.payload.name} with email ${response.payload.email} has been created successfully`
          );
          setPatient((prev: Patient[]) => [response.payload, ...prev]);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <div className="flex">
          <Link href="/admin" className="cursor-pointer mr-3">
            <Image
              src="/assets/icons/back.png"
              height={32}
              width={32}
              alt="logo"
              className="h-8 w-fit"
            />
          </Link>
          <Link href="/admin" className="cursor-pointer">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            />
          </Link>
        </div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">
            {greetings()} <span className="text-green-500">Admin</span> 👋
          </h1>
          <p className="text-dark-700">Welcome to your patients dashboard.</p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={patient?.length}
            label="Total patients"
            icon={"/assets/icons/patients.png"}
          />
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <PatientDataTable
          columns={patientAdminColumns}
          data={patient}
          doctors={doctors}
          loading={isLoading}
        />
      </main>
    </div>
  );
};

export default PatientAdmissionPage;
