import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getAppointment } from "@/lib/actions/appointment.action";
import { formatDateTime } from "@/lib/utils";
import { getUser } from "@/lib/actions/patient.actions";
import * as Sentry from "@sentry/nextjs";
import { getDoctors } from "@/lib/actions/doctor.action";
import { Doctor } from "@/types/appwrite.types";

const RequestSuccess = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  const user = await getUser(userId);

  Sentry.metrics.set("user_view_appointment_success", user.name);
  const doctors = await getDoctors();
  const doctor = doctors.find(
    (doctor: Doctor) => doctor.$id === appointment?.doctor
  );

  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href={`/patients/${userId}/dashboard`}>
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image || "/assets/images/dr-green.png"}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointment?.schedule).dateTime}</p>
          </div>
        </section>
        <div className="flex gap-4">
          <Button variant="outline" className="shad-primary-btn" asChild>
            <Link href={`/patients/${userId}/new-appointment`}>
              New Appointment
            </Link>
          </Button>

          <Button variant="outline" className="shad-gray-btn" asChild>
            <Link href={`/patients/${userId}/dashboard`}>Dashboard</Link>
          </Button>
        </div>

        <p className="copyright">© 2024 CareTake</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
