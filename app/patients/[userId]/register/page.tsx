import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  return (
    <div className=" flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <div className="cursor-pointer mb-12">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            />
          </div>
          <RegisterForm user={user} />

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

export default Register;
