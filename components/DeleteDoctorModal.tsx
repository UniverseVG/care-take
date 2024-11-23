/* eslint-disable @typescript-eslint/no-unused-expressions */
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
import SubmitButton from "./SubmitButton";
import { deleteDoctor } from "@/lib/actions/doctor.action";
import useDoctorStore from "@/store/useDoctor";

export const DeleteDoctorModal = ({ doctor }: { doctor: Doctor }) => {
  const { deleteDoctorInStore } = useDoctorStore();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const submit = async () => {
    setIsLoading(true);
    try {
      const result = await deleteDoctor(doctor.$id);
      if (result) {
        deleteDoctorInStore(doctor.$id);
        setOpen && setOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={`capitalize text-red-500`}>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog max-h-screen overflow-auto max-w-sm ">
        <DialogHeader className="mb-2 space-y-3">
          <DialogTitle className="capitalize ">Delete Doctor</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between">
          <SubmitButton
            onClick={() => setOpen(false)}
            className="shad-gray-btn w-1/2 mr-2"
          >
            Cancel
          </SubmitButton>
          <SubmitButton
            isLoading={isLoading}
            onClick={submit}
            className="shad-danger-btn w-1/2 ml-2"
          >
            Confirm
          </SubmitButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
