"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment, Doctor } from "@/types/appwrite.types";
import "react-datepicker/dist/react-datepicker.css";
import AppointmentForm from "./forms/AppointmentForm";
import { getDoctors } from "@/lib/actions/doctor.action";

export const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
}: {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: "schedule" | "cancel";
  title: string;
  description: string;
}) => {
  const [open, setOpen] = useState(false);

  const [doctorsStore, setDoctorsStore] = useState<Doctor[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const doctorsData = await getDoctors();
      setDoctorsStore(doctorsData);
    };
    fetchData();
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          disabled={
            (appointment?.status === "scheduled" && type === "schedule") ||
            (appointment?.status === "cancelled" && type === "cancel")
          }
          className={`capitalize ${type === "schedule" && "text-green-500"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} appointment
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
          doctors={doctorsStore}
        />
      </DialogContent>
    </Dialog>
  );
};
