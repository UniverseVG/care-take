/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentListByPatientId } from "@/lib/actions/appointment.action";
import { getPatient } from "@/lib/actions/patient.actions";
import { appwriteClient } from "@/lib/appwrite-client.config";
import { Appointment, Doctor } from "@/types/appwrite.types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PatientDetail = ({ params: { patientId } }: SearchParamProps) => {
  const [appointments, setAppointments] = useState<AdminParams>({
    totalCount: 0,
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    documents: [],
  });
  const [patient, setPatient] = useState<Doctor>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchAppointments = async () => {
    setIsLoading(true);
    const appointments = await getRecentAppointmentListByPatientId(patientId);
    const patientResult = await getPatient(patientId);
    setAppointments(appointments);
    setPatient(patientResult);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
    const unsubscribe = appwriteClient.subscribe(
      `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID}.documents`,
      (response: { events: string[]; payload: Appointment }) => {
        if (
          response.events.includes(
            `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID}.documents.*.create`
          )
        ) {
          toast.success(
            `An appointment has been created successfully for Dr. ${response.payload.doctorId.name} by ${response.payload.patient.name}`
          );
          setAppointments((prev: AdminParams) => ({
            ...prev,
            totalCount: prev.totalCount + 1,
            scheduledCount:
              response.payload.status === "scheduled"
                ? prev.scheduledCount + 1
                : prev.scheduledCount,
            pendingCount:
              response.payload.status === "pending"
                ? prev.pendingCount + 1
                : prev.pendingCount,
            cancelledCount:
              response.payload.status === "cancelled"
                ? prev.cancelledCount + 1
                : prev.cancelledCount,
            documents: [response.payload, ...prev.documents],
          }));
        }

        if (
          response.events.includes(
            `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID}.documents.*.update`
          )
        ) {
          toast.success(
            `An appointment has been updated successfully for Dr. ${response.payload.doctorId.name} and Patient ${response.payload.patient.name}`
          );
          setAppointments((prev: AdminParams) => ({
            ...prev,
            documents: prev.documents.map((doc: Appointment) =>
              doc.$id === response.payload.$id ? response.payload : doc
            ),
          }));
        }

        if (
          response.events.includes(
            `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID}.documents.*.delete`
          )
        ) {
          toast.success(
            `An appointment has been deleted successfully for Dr. ${response.payload.doctorId.name} and Patient ${response.payload.patient.name}`
          );
          setAppointments((prev: AdminParams) => ({
            ...prev,
            totalCount: prev.totalCount - 1,
            documents: prev.documents.filter(
              (doc: Appointment) => doc.$id !== response.payload.$id
            ),
          }));
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <div className="flex">
          <Link href="/admin/patient" className="cursor-pointer mr-3">
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
            Welcome <span className="text-green-500">Admin</span> 👋
          </h1>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <p className="text-dark-700">
              Start the day with managing appointments for patient{" "}
              {patient?.name}
            </p>
          )}
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
            loading={isLoading}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
            loading={isLoading}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
            loading={isLoading}
          />
        </section>

        <DataTable
          columns={columns}
          data={appointments.documents}
          loading={isLoading}
        />
      </main>
    </div>
  );
};

export default PatientDetail;
