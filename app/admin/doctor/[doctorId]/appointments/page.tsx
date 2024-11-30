import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentListByDoctorId } from "@/lib/actions/appointment.action";
import { columns } from "@/components/table/columns";
import { greetings } from "@/lib/utils";
import { getDoctor } from "@/lib/actions/doctor.action";

const DoctorAdminPage = async ({ params: { doctorId } }: SearchParamProps) => {
  const appointments = await getRecentAppointmentListByDoctorId(doctorId);
  const doctor = await getDoctor(doctorId);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <div className="flex">
          <Link href="/admin/doctor" className="cursor-pointer mr-3">
            <Image
              src="/assets/icons/back.png"
              height={32}
              width={32}
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

        <div className="flex space-x-4"></div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">
            {greetings()} <span className="text-green-500">Admin</span> 👋
          </h1>
          <p className="text-dark-700">
            Start the day with managing appointments for Dr. {doctor.name}
          </p>
        </section>

        <section className="admin-stat">
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

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default DoctorAdminPage;
