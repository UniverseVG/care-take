"use client";
import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.action";
import { getDoctors } from "@/lib/actions/doctor.action";
import { doctorColumns } from "@/components/table/doctorColumns";
import { greetings } from "@/lib/utils";
import { DoctorDataTable } from "@/components/table/DoctorDataTable";
import { useEffect, useState } from "react";
import { Doctor } from "@/types/appwrite.types";
import { appwriteClient } from "@/lib/appwrite-client.config";
import { toast } from "react-toastify";

const DoctorAdmissionPage = () => {
  const [appointments, setAppointments] = useState<AdminParams>({
    totalCount: 0,
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    documents: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  useEffect(() => {
    fetchAppointments();
    const unsubscribe = appwriteClient.subscribe(
      `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_DOCTOR_COLLECTION_ID}.documents`,
      (response: { events: string[]; payload: Doctor }) => {
        if (
          response.events.includes(
            `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_DOCTOR_COLLECTION_ID}.documents.*.create`
          )
        ) {
          toast.success(
            `A new doctor ${response.payload.name} with profession ${response.payload.profession} has been added successfully`
          );
          setDoctors((prev: Doctor[]) => [...prev, response.payload]);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    const response = await getRecentAppointmentList();
    const doctors = await getDoctors();
    setDoctors(doctors);
    setAppointments(response);
    setIsLoading(false);
  };
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

        <div className="flex space-x-4">
          <Link
            href={"/admin/doctor/add-doctor"}
            className="text-16-semibold text-green-500 mr-1 cursor-pointer hover:text-dark-700"
          >
            Add Doctor
          </Link>
        </div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">
            {greetings()} <span className="text-green-500">Admin</span> 👋
          </h1>
          <p className="text-dark-700">Welcome to your doctors dashboard.</p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={doctors.length}
            label="Total doctors"
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

        <DoctorDataTable
          columns={doctorColumns}
          data={doctors}
          doctors={doctors}
          loading={isLoading}
        />
      </main>
    </div>
  );
};

export default DoctorAdmissionPage;
