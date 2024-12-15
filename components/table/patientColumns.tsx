/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { StatusBadge } from "../StatusBadge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

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
    filterFn: (row, _, value) => {
      const appointment = row.original;
      return appointment.patient?.name
        .toLowerCase()
        .includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
    filterFn: (row, _, value) => {
      const appointment = row.original;
      return appointment.status.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "schedule",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Appointment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
    filterFn: (row, id, value) => {
      const schedule = row.getValue(id) as Date;
      return formatDateTime(schedule).dateOnly.includes(
        formatDateTime(value).dateOnly
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
    filterFn: (row, _, value) => {
      const appointment = row.original;
      return appointment.doctor.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "latest",
    header: "",
    cell: ({ row }) => {
      const appointment = row.original;
      const now = new Date();
      const appointmentDate = new Date(appointment.schedule);
      const scheduled = appointment.status === "scheduled";
      const isUpcoming = appointmentDate > now;

      const statusValue = isUpcoming
        ? scheduled
          ? "Upcoming Appt."
          : "New Appt."
        : "Past Appt.";

      row.original.latest = statusValue;

      return (
        <div className="min-w-[180px]">
          {isUpcoming ? (
            scheduled ? (
              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded ml-12 lg:ml-0">
                Upcoming Appt.
              </span>
            ) : (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded ml-12 lg:ml-0">
                New Appt.
              </span>
            )
          ) : (
            <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded ml-12 lg:ml-0">
              Past Appt.
            </span>
          )}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const order = ["Upcoming Appt.", "New Appt.", "Past Appt."];

      const statusA = rowA.original.latest;
      const statusB = rowB.original.latest;

      return order.indexOf(statusA) - order.indexOf(statusB);
    },
    filterFn: (row, _, value) => {
      const appointment = row.original.latest;

      return appointment === value;
    },
  },
];
