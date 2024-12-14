import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const EditProfile = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  const patient = await getPatient(userId);
  return (
    <div className=" flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
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
          <RegisterForm user={user} patient={patient} isEdit={true} />

          <p className="copyright py-12">© 2024 CareTake.</p>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.jpg"
        alt="register"
        height={1000}
        width={1000}
        className="side-img max-w-[30%]"
      />
    </div>
  );
};

export default EditProfile;
