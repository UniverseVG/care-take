"use client";
import { Doctor } from "@/types/appwrite.types";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DoctorNameCellProps {
  doctor: Doctor;
}

export const DoctorNameCell: React.FC<DoctorNameCellProps> = ({ doctor }) => {
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
