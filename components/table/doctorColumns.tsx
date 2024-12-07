"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Doctor } from "@/types/appwrite.types";
import { useEffect, useState } from "react";
import { DeleteDoctorModal } from "../DeleteDoctorModal";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

interface DoctorNameCellProps {
  doctor: Doctor;
}

const DoctorNameCell: React.FC<DoctorNameCellProps> = ({ doctor }) => {
  const [imageSrc, setImageSrc] = useState(
    doctor.gender === "male"
      ? "/assets/images/male_doctor.png"
      : "/assets/images/female_doctor.png"
  );

  useEffect(() => {
    if (doctor.photoUrl) {
      setImageSrc(doctor.photoUrl);
    }
  }, [doctor.photoUrl]);

  return (
    <div className="flex items-center gap-3">
      <Image
        src={imageSrc}
        alt="doctor"
        width={100}
        height={100}
        className="size-8"
      />
      <p className="whitespace-nowrap">Dr. {doctor.name}</p>
    </div>
  );
};

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
