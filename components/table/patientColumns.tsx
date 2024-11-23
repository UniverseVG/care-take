"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { StatusBadge } from "../StatusBadge";

export const patientColumns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium ">{appointment.patient?.name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryDoctor",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex items-center gap-3">
          <Image
            src={appointment.doctorId.photoUrl || "/assets/images/dr-green.png"}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {appointment.doctorId?.name}</p>
        </div>
      );
    },
  },
];
