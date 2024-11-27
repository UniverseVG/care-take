/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import "react-phone-number-input/style.css";
import SubmitButton from "../SubmitButton";
import { Dispatch, SetStateAction, useState } from "react";
import {
  DoctorFormValidation,
  DoctorUpdateFormValidation,
} from "@/lib/validation";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { GenderOptions } from "@/constants";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "../ui/label";
import FileUploader from "../FileUploader";
import { registerDoctor, updateDoctor } from "@/lib/actions/doctor.action";
import { useRouter } from "next/navigation";
import { Doctor } from "@/types/appwrite.types";
import useDoctorStore from "@/store/useDoctor";
import { toast } from "react-toastify";

interface DoctorFormProps {
  type: "add" | "edit";
  doctor?: Doctor;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const DoctorForm = ({ type, doctor, setOpen }: DoctorFormProps) => {
  const { updateDoctorInStore, addDoctorToStore } = useDoctorStore();
  const validationType =
    type === "add" ? DoctorFormValidation : DoctorUpdateFormValidation;
  const isEdit = type === "edit";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof validationType>>({
    resolver: zodResolver(validationType),
    defaultValues: {
      photo: [],
      birthDate: doctor?.birthDate || new Date(Date.now()),
      gender: doctor?.gender || ("male" as Gender),
      address: doctor?.address || "",
      qualification: doctor?.qualification || "",
      profession: doctor?.profession || "",
      license: [],
      name: doctor?.name || "",
      email: doctor?.email || "",
      phone: doctor?.phone || "",
    },
  });

  const createFormData = (file?: File) => {
    if (!file) return undefined;
    const blobFile = new Blob([file], { type: file.type });
    const formData = new FormData();
    formData.append("blobFile", blobFile);
    formData.append("fileName", file.name);
    return formData;
  };

  const formValues = (values: z.infer<typeof validationType>) => {
    const picFormData =
      values.photo && values.photo.length > 0
        ? createFormData(values.photo[0])
        : undefined;
    const licenseFormData =
      values.license && values.license.length > 0
        ? createFormData(values.license[0])
        : undefined;
    return {
      photo: values.photo ? picFormData : isEdit ? doctor?.photoUrl : undefined,
      name: values.name,
      email: values.email,
      phone: values.phone,
      birthDate: new Date(values.birthDate),
      gender: values.gender,
      address: values.address,
      qualification: values.qualification,
      profession: values.profession,
      license: values.license
        ? licenseFormData
        : isEdit
        ? doctor?.licenseUrl
        : undefined,
    };
  };

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof validationType>) => {
    setIsLoading(true);
    if (!isEdit) {
      try {
        const doctor = formValues(values);

        const newDoctor = await registerDoctor(doctor);

        if (newDoctor) {
          addDoctorToStore(newDoctor);
          router.push("/admin/doctor");
          toast.success(`Dr. ${newDoctor.name} added successfully!`);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Something went wrong, please try again");
      }
    } else if (doctor?.$id) {
      try {
        const doctorToUpdate = {
          doctorId: doctor.$id!,
          doctor: formValues(values),
        };
        const result = await updateDoctor(doctorToUpdate);
        if (result) {
          updateDoctorInStore(result);
          setOpen && setOpen(false);
          toast.success(`Dr. ${result.name} updated successfully!`);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Something went wrong, please try again");
      }
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`${isEdit ? "space-y-6" : "space-y-12"}`}
      >
        {!isEdit && (
          <section className="space-y-4">
            <h1 className="header">Add Doctor 👨‍⚕️</h1>
            <p className="text-dark-700">Add information about the doctor</p>
          </section>
        )}

        <section className="space-y-6">
          {!isEdit && (
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Personal Information </h2>
            </div>
          )}
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="photo"
            label="Profile Picture"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader
                  file={doctor?.photoUrl}
                  files={field.value}
                  onChange={field.onChange}
                  isPicUploader={true}
                />
              </FormControl>
            )}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Name"
            placeholder="John Doe (exclude the title e.g Dr., Mr., Mrs., etc.)"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              placeholder="john.doe@me.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              label="Phone number"
              placeholder="(+91) 1234567890"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="birthDate"
              label="Date of Birth"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="address"
            label="Address"
            placeholder="123, ABC Street, XYZ City"
          />
        </section>

        <section className="space-y-6">
          {!isEdit && (
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Professional Information </h2>
            </div>
          )}

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="qualification"
              label="Qualification"
              placeholder="MBBS, PhD"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="profession"
              label="Profession"
              placeholder="Physician, Surgeon, etc."
            />
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="license"
            label="Scanned copy of license"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader
                  file={doctor?.licenseUrl}
                  files={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            )}
          />
        </section>

        {/* <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section> */}

        <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
      </form>
    </Form>
  );
};
export default DoctorForm;
