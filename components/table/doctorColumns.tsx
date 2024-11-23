"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Doctor } from "@/types/appwrite.types";
// import { StatusBadge } from "../StatusBadge";
import { useEffect, useState } from "react";
import { EditDoctorModal } from "../EditDoctorModal";
import { DeleteDoctorModal } from "../DeleteDoctorModal";
import Link from "next/link";

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
    header: "Name",
    cell: ({ row }) => <DoctorNameCell doctor={row.original} />,
  },
  {
    accessorKey: "qualification",
    header: "Qualification",
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
    header: "Address",
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
          href={`/admin/doctor/${doctor.$id}`}
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
        <div className="flex gap-1">
          <EditDoctorModal doctor={doctor} />

          <DeleteDoctorModal doctor={doctor} />
        </div>
      );
    },
  },
];
