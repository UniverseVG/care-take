"use client";

import { Patient } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ViewPatientDetailModal } from "../ViewPatientDetailModal";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export const patientAdminColumns: ColumnDef<Patient>[] = [
  {
    header: "ID",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <p className="text-14-medium text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
          {patient.name}
        </p>
      );
    },
    filterFn: (row, _, value) => {
      const patient = row.original;
      return patient.name.toLowerCase().startsWith(value.toLowerCase());
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <p className="text-14-medium text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
          {patient.email}
        </p>
      );
    },
    filterFn: (row, _, value) => {
      const patient = row.original;
      return patient.email.toLowerCase().startsWith(value.toLowerCase());
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const patient = row.original;
      return <p className="text-14-medium">{patient.phone}</p>;
    },
    filterFn: (row, _, value) => {
      const patient = row.original;
      return patient.email.toLowerCase().startsWith(value.toLowerCase());
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const patient = row.original;
      return <p className="text-14-medium">{patient.gender}</p>;
    },
    filterFn: (row, _, value) => {
      const patient = row.original;
      return patient.gender.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <p className="text-14-medium text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
          {patient.address}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryDoctor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Primary Doctor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <div className="flex items-center gap-3">
          <Image
            src={patient.doctor?.photoUrl || "/assets/images/dr-green.png"}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {patient.doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const patient = row.original;

      return (
        <div className="flex gap-1 items-center">
          <ViewPatientDetailModal patient={patient} />
          <Link
            className="capitalize text-green-500 text-14-medium"
            href={`/admin/patient/${patient.userId}`}
          >
            Appointments
          </Link>
        </div>
      );
    },
  },
];
