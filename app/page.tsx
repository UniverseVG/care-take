import PatientForm from "@/components/forms/PatientForm";
import PassKeyModal from "@/components/PassKeyModal";
import Image from "next/image";
import Link from "next/link";

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true";

  return (
    <div className=" flex h-screen max-h-screen overflow-x-hidden">
      {isAdmin && <PassKeyModal />}
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[496px]">
          <div className="cursor-pointer mb-12">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            />
          </div>

          <PatientForm />
          <p className="text-14-regular text-center mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-500 ml-1 hover:text-dark-700"
            >
              Sign in
            </Link>
          </p>
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CareTake.
            </p>

            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/onboarding-img.png"
        alt="onboarding"
        height={1000}
        width={1000}
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
