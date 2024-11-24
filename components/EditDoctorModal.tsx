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
import { Doctor } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import DoctorForm from "./forms/DoctorForm";

export const EditDoctorModal = ({ doctor }: { doctor: Doctor }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={`capitalize text-green-500`}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-xl max-h-[90vh] overflow-auto max-w-[860px] ">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize ">Edit Doctor Details</DialogTitle>
          <DialogDescription>Update your doctor details</DialogDescription>
        </DialogHeader>

        <DoctorForm type="edit" doctor={doctor} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
