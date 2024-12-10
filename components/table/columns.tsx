"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils";
import { Appointment, Patient } from "@/types/appwrite.types";
import { StatusBadge } from "../StatusBadge";
import { AppointmentModal } from "../AppointmentModal";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Patient
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium ">{appointment.patient.name}</p>;
    },
    filterFn: (row, id, value) => {
      const patient = row.getValue(id) as Patient;
      return patient.name.toLowerCase().startsWith(value.toLowerCase());
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
      return appointment.doctor.toLowerCase().startsWith(value.toLowerCase());
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />

          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "latest",
    header: "",
    cell: ({ row, table }) => {
      const appointment = row.original;
      const now = new Date();
      const appointmentDate = new Date(appointment.schedule);
      const scheduled = appointment.status === "scheduled";
      const isUpcoming = appointmentDate > now;

      const allAppointments = table
        .getCoreRowModel()
        .rows.map((r) => r.original);
      const futureAppointments = allAppointments.filter(
        (appt) =>
          appt.patient.$id === appointment.patient.$id &&
          new Date(appt.schedule) > now
      );
      const latestAppointment = futureAppointments.sort(
        (a, b) =>
          new Date(b.schedule).getTime() - new Date(a.schedule).getTime()
      )[0];

      const isLatest =
        latestAppointment && latestAppointment.$id === appointment.$id;

      const statusValue = isLatest
        ? "Latest Appt."
        : isUpcoming
        ? scheduled
          ? "Scheduled Appt."
          : "New Appt."
        : "Past Appt.";

      row.original.latest = statusValue;

      return (
        <div className="min-w-[180px]">
          {isLatest ? (
            <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
              Latest Appt.
            </span>
          ) : isUpcoming ? (
            scheduled ? (
              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                Scheduled Appt.
              </span>
            ) : (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                New Appt.
              </span>
            )
          ) : (
            <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
              Past Appt.
            </span>
          )}
        </div>
      );
    },
    filterFn: (row, _, value) => {
      const appointment = row.original.latest;
      return appointment === value;
    },
  },
];
