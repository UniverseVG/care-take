import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";
import * as Sentry from "@sentry/nextjs";
import { getDoctors } from "@/lib/actions/doctor.action";
import Link from "next/link";

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);
  const doctors = await getDoctors();

  Sentry.metrics.set("user_view_new_appointment", patient.name);
  return (
    <div className=" flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <div className="flex mb-8">
            <Link
              href={`/patients/${userId}/dashboard`}
              className="cursor-pointer mr-3"
            >
              <Image
                src="/assets/icons/back.png"
                height={32}
                width={32}
                alt="logo"
                className="h-8 w-fit"
              />
            </Link>
            <Link
              href={`/patients/${userId}/dashboard`}
              className="cursor-pointer"
            >
              <Image
                src="/assets/icons/logo-full.svg"
                height={32}
                width={162}
                alt="logo"
                className="h-8 w-fit"
              />
            </Link>
          </div>

          <AppointmentForm
            name={patient.name}
            patientId={patient.$id}
            userId={userId}
            type="create"
            doctors={doctors}
          />

          <p className="copyright py-12">© 2024 CareTake.</p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.svg"
        alt="appointment"
        height={1000}
        width={1000}
        className="side-img max-w-[40%] bg-bottom"
      />
    </div>
  );
};

export default NewAppointment;
