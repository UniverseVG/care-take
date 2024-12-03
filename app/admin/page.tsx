"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import Dropdown, { MenuItem } from "@/components/Dropdown";
import { FaUserDoctor } from "react-icons/fa6";
import { PiUsersThreeFill } from "react-icons/pi";

import { getRecentAppointmentList } from "@/lib/actions/appointment.action";
import { appwriteClient } from "@/lib/appwrite-client.config";
import { toast } from "react-toastify";
import { Appointment } from "@/types/appwrite.types";

const AdminPage = () => {
  const [appointments, setAppointments] = useState<AdminParams>({
    totalCount: 0,
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    documents: [],
  });
  const [isLoading, setIsLoading] = useState(false);
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

  const menuItems: MenuItem[] = [
    {
      title: "Manage",
      children: [
        {
          title: "Manage Doctors",
          route: `/admin/doctor`,
          icon: <FaUserDoctor />,
        },
        {
          title: "Manage Patients",
          route: `/admin/patient`,
          icon: <PiUsersThreeFill />,
        },
      ],
    },
  ];

  const fetchAppointments = async () => {
    setIsLoading(true);
    const response = await getRecentAppointmentList();
    setAppointments(response);
    setIsLoading(false);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/admin" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <div className="flex space-x-4">
          <div className="flex gap-8 items-center text-white">
            {menuItems.map((item, index) => {
              return item.hasOwnProperty("children") ? (
                <Dropdown item={item} key={index} />
              ) : (
                <Link
                  className="hover:text-green-500 text-16-semibold"
                  href={item?.route || ""}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">
            Welcome <span className="text-green-500">Admin</span> 👋
          </h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
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

export default AdminPage;
