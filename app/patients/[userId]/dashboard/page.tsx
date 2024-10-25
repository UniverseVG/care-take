import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentListByPatientId } from "@/lib/actions/appointment.action";
import { patientColumns } from "@/components/table/patientColumns";
import { getUser } from "@/lib/actions/patient.actions";
import { greetings } from "@/lib/utils";
import Dropdown, { MenuItem } from "@/components/Dropdown";
import { FaUserEdit } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiCalendarScheduleFill } from "react-icons/ri";

export const dynamic = "force-dynamic";
const PatientDashboard = async ({ params: { userId } }: SearchParamProps) => {
  const appointments = await getRecentAppointmentListByPatientId(userId);
  const user = await getUser(userId);
  const menuItems: MenuItem[] = [
    {
      title: "Settings",
      children: [
        {
          title: "Schedule Appointment",
          route: `/patients/${userId}/new-appointment`,
          icon: <RiCalendarScheduleFill />,
        },
        {
          title: "Edit Profile",
          route: `/patients/${userId}/edit-profile`,
          icon: <FaUserEdit />,
        },
        {
          title: "Logout",
          icon: <FiLogOut />,
          route: "/logout",
        },
      ],
    },
  ];
  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href={`/patients/${userId}/dashboard`} className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <div className="flex gap-8 items-center text-white">
          {menuItems.map((item) => {
            return item.hasOwnProperty("children") ? (
              <Dropdown item={item} />
            ) : (
              <Link
                className="hover:text-green-500 text-16-semibold"
                href={item?.route || ""}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">
            {greetings()} <span className="text-green-500">{user.name}</span> 👋
          </h1>
          <p className="text-dark-700">
            This is your dashboard. Here you can view your appointments.
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

        <DataTable
          columns={patientColumns}
          data={appointments.documents}
          adminMode={false}
        />
      </main>
    </div>
  );
};

export default PatientDashboard;
