/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentListByDoctorId } from "@/lib/actions/appointment.action";
import { columns } from "@/components/table/columns";
import { greetings } from "@/lib/utils";
import { getDoctor } from "@/lib/actions/doctor.action";
import { useEffect, useState } from "react";
import { appwriteClient } from "@/lib/appwrite-client.config";
import { Appointment, Doctor } from "@/types/appwrite.types";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";

const DoctorAdminPage = ({ params: { doctorId } }: SearchParamProps) => {
  const [appointments, setAppointments] = useState<AdminParams>({
    totalCount: 0,
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    documents: [],
  });
  const [doctor, setDoctor] = useState<Doctor>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = async () => {
    setIsLoading(true);
    const appointments = await getRecentAppointmentListByDoctorId(doctorId);
    const doctorResult = await getDoctor(doctorId);
    setAppointments(appointments);
    setDoctor(doctorResult);
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
          <Link href="/admin/doctor" className="cursor-pointer mr-3">
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

        <div className="flex space-x-4"></div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">
            {greetings()} <span className="text-green-500">Admin</span> 👋
          </h1>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <p className="text-dark-700">
              Start the day with managing appointments for Dr.
              {doctor?.name}
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

export default DoctorAdminPage;
