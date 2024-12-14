/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import "react-phone-number-input/style.css";
import SubmitButton from "../SubmitButton";
import { useEffect, useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient, updatePatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  DoctorType,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import FileUploader from "../FileUploader";
import { Doctor, Patient } from "@/types/appwrite.types";
import { toast } from "react-toastify";
import { getDoctors } from "@/lib/actions/doctor.action";
import { DoctorNameCell } from "../DoctorNameCell";

const RegisterForm = ({
  user,
  patient,
  isEdit = false,
}: {
  user: User;
  patient?: Patient;
  isEdit?: boolean;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    patient?.doctorProfession || null
  );

  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);

  const fetchDoctors = async () => {
    const response = await getDoctors();
    setDoctorsList(response);
  };
  useEffect(() => {
    fetchDoctors();
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: patient?.gender || ("male" as Gender),
      address: patient?.address || "",
      occupation: patient?.occupation || "",
      emergencyContactName: patient?.emergencyContactName || "",
      emergencyContactNumber: patient?.emergencyContactNumber || "",
      primaryDoctor: patient?.primaryDoctor || "",
      doctorProfession: patient ? patient?.doctorProfession : "",
      insuranceProvider: patient?.insuranceProvider || "",
      insurancePolicyNumber: patient?.insurancePolicyNumber || "",
      allergies: patient?.allergies || "",
      currentMedication: patient?.currentMedication || "",
      familyMedicalHistory: patient?.familyMedicalHistory || "",
      pastMedicalHistory: patient?.pastMedicalHistory || "",
      identificationType: patient?.identificationType || "",
      identificationNumber: patient?.identificationNumber || "",
      privacyConsent: patient?.privacyConsent || false,
      treatmentConsent: patient?.treatmentConsent || false,
      disclosureConsent: patient?.disclosureConsent || false,
      identificationDocument: [],
    },
  });

  // Helper function to create form data
  const createFormData = (file?: File) => {
    if (!file) return undefined;
    const blobFile = new Blob([file], { type: file.type });
    const formData = new FormData();
    formData.append("blobFile", blobFile);
    formData.append("fileName", file.name);
    return formData;
  };

  // Function to structure patient form values
  const formValues = (
    values: z.infer<typeof PatientFormValidation>,
    userId: string
  ) => {
    const idDocumentFormData =
      values.identificationDocument && values.identificationDocument.length > 0
        ? createFormData(values.identificationDocument[0])
        : undefined;

    return {
      userId,
      name: values.name,
      email: values.email,
      phone: values.phone,
      birthDate: new Date(values.birthDate),
      gender: values.gender,
      address: values.address,
      occupation: values.occupation,
      emergencyContactName: values.emergencyContactName,
      emergencyContactNumber: values.emergencyContactNumber,
      primaryDoctor: values.primaryDoctor,
      insuranceProvider: values.insuranceProvider,
      insurancePolicyNumber: values.insurancePolicyNumber,
      allergies: values.allergies,
      doctorProfession: values.doctorProfession,
      currentMedication: values.currentMedication,
      familyMedicalHistory: values.familyMedicalHistory,
      pastMedicalHistory: values.pastMedicalHistory,
      identificationType: values.identificationType,
      identificationNumber: values.identificationNumber,
      identificationDocument: values?.identificationDocument
        ? idDocumentFormData
        : isEdit
        ? patient?.identificationDocumentUrl
        : undefined,
      privacyConsent: values.privacyConsent,
      disclosureConsent: values.disclosureConsent,
      treatmentConsent: values.treatmentConsent,
      doctor: values.primaryDoctor,
    };
  };

  // Submit handler function
  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    try {
      const patientData = formValues(values, user.$id);

      if (!isEdit) {
        const newPatient = await registerPatient(patientData);

        if (newPatient) {
          router.push(`/patients/${user.$id}/new-appointment`);
          toast.success(
            `${user.name}, you have successfully registered with CareTake. Please book your first appointment!`
          );
        }
      } else if (patient?.$id) {
        const updatedPatientData = {
          patientId: patient.$id,
          patient: patientData,
        };
        const updatedPatient = await updatePatient(updatedPatientData);
        if (updatedPatient) {
          toast.success("Patient information updated successfully!");
          router.push(`/patients/${user.$id}/dashboard`);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong, please try again");
    }

    setIsLoading(false);
  };

  const filteredDoctors = doctorsList?.filter(
    (doctor) => doctor.profession === selectedSpecialty
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">
            Welcome{" "}
            {user.name.split("")[0].toUpperCase() +
              user.name.split("").slice(1).join("")}{" "}
            👋
          </h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information </h2>
          </div>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Full Name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            disabled={user.name !== ""}
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
              disabled={user.email !== ""}
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              label="Phone number"
              placeholder="(+91) 1234567890"
              disabled={user.phone !== ""}
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

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="address"
              label="Address"
              placeholder="123, ABC Street, XYZ City"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="occupation"
              label="Occupation"
              placeholder="Software Engineer"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Guardian's name"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="emergencyContactNumber"
              label="Emergency Contact Number"
              placeholder="(+91) 1234567890"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information </h2>
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="doctorProfession"
              label="Doctor Specialty"
              placeholder="Select a specialty"
              onValueChange={(value) => setSelectedSpecialty(value)}
            >
              {DoctorType.map((type) => (
                <SelectItem key={type} value={type}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{type}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryDoctor"
              label="Primary Doctor"
              placeholder="Select a doctor"
              disabled={!selectedSpecialty}
            >
              {filteredDoctors.map((doctor) => (
                <SelectItem key={doctor?.$id} value={doctor.$id}>
                  <DoctorNameCell doctor={doctor} />
                </SelectItem>
              ))}
            </CustomFormField>
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="ABC Insurance"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insurancePolicyNumber"
              label="Insurance Policy Number"
              placeholder="ABC1234567890"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen, etc."
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="currentMedication"
              label="Current Medication (if any)"
              placeholder="Ibuprofen 200mg, Paracetamol 500mg, etc."
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="familyMedicalHistory"
              label="Family Medical History"
              placeholder="Mother diabetes, father high blood pressure, etc."
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="pastMedicalHistory"
              label="Past Medical History"
              placeholder="
              Hypertension, high blood pressure, etc."
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification And Verification</h2>
          </div>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="identificationType"
            label="Identification Type"
            placeholder="Select a identification type"
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="identificationNumber"
            label="Identification Number"
            placeholder="ABC1234567890"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="identificationDocument"
            label="Scanned copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader
                  file={patient?.identificationDocumentUrl}
                  files={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
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
        </section>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
export default RegisterForm;
