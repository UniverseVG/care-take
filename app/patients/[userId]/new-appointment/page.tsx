import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";
import * as Sentry from "@sentry/nextjs";

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  Sentry.metrics.set("user_view_new_appointment", patient.name);
  return (
    <div className=" flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="care-take"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm
            name={patient.name}
            patientId={patient.$id}
            userId={userId}
            type="create"
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
