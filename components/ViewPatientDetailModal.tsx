"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Patient } from "@/types/appwrite.types";
import "react-datepicker/dist/react-datepicker.css";

import ViewPatientDetail from "./ViewPatientDetail";

export const ViewPatientDetailModal = ({ patient }: { patient: Patient }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={`capitalize text-green-500`}>
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-xl max-h-[90vh] overflow-auto">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">Patient Detail</DialogTitle>
          <DialogDescription>
            Hi 👋 Admin, this is the detail of {patient.name}
          </DialogDescription>
        </DialogHeader>

        <ViewPatientDetail patient={patient} />
      </DialogContent>
    </Dialog>
  );
};
