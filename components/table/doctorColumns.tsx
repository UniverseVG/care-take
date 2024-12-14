"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doctor } from "@/types/appwrite.types";
import { DeleteDoctorModal } from "../DeleteDoctorModal";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { DoctorNameCell } from "../DoctorNameCell";

export const doctorColumns: ColumnDef<Doctor>[] = [
  {
    header: "ID",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <DoctorNameCell doctor={row.original} />,

    filterFn: (row, _, value) => {
      const doctor = row.getValue("name") as Doctor;
      return doctor.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "qualification",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0"
      >
        Qualification
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const doctor = row.original;
      return <p className="text-14-medium ">{doctor.qualification}</p>;
    },
  },
  {
    accessorKey: "specialty",
    header: "Specialty",
    cell: ({ row }) => {
      const doctor = row.original;
      return <p className="text-14-medium ">{doctor.profession}</p>;
    },

    filterFn: (row, _, value) => {
      const doctor = row.original;
      return doctor.profession.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const doctor = row.original;
      return <p className="text-14-medium ">{doctor.phone}</p>;
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0"
      >
        Address
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const doctor = row.original;
      return <p className="text-14-medium ">{doctor.address}</p>;
    },
  },
  {
    id: "appointment",
    header: () => <div className="pl-4">Appointment</div>,
    cell: ({ row }) => {
      const doctor = row.original;

      return (
        <Link
          href={`/admin/doctor/${doctor.$id}/appointments`}
          className={`capitalize text-green-500 ml-6`}
        >
          Manage
        </Link>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const doctor = row.original;

      return (
        <div className="flex gap-1 items-center">
          <Link
            href={`/admin/doctor/${doctor.$id}/edit-doctor`}
            className={`capitalize text-green-500`}
          >
            Edit
          </Link>

          <DeleteDoctorModal doctor={doctor} />
        </div>
      );
    },
  },
];
