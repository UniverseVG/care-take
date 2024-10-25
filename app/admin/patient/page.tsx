import Image from "next/image";
import Link from "next/link";
import { DataTable } from "@/components/table/DataTable";

import { greetings } from "@/lib/utils";
import { patientAdminColumns } from "@/components/table/patientAdminCloumns";
import { getPatients } from "@/lib/actions/patient.actions";
import { StatCard } from "@/components/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.action";

const PatientAdmissionPage = async () => {
  const patients = await getPatients();
  const appointments = await getRecentAppointmentList();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <div className="flex">
          <Link href="/admin" className="cursor-pointer mr-3">
            <Image
              src="/assets/icons/back.png"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            />
          </Link>
          <Link href="/admin" className="cursor-pointer">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            />
          </Link>
        </div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">
            {greetings()} <span className="text-green-500">Admin</span> 👋
          </h1>
          <p className="text-dark-700">Welcome to your patients dashboard.</p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={patients.length}
            label="Total patients"
            icon={"/assets/icons/patients.png"}
          />
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <DataTable columns={patientAdminColumns} data={patients} />
      </main>
    </div>
  );
};

export default PatientAdmissionPage;
