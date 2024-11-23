/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import "react-phone-number-input/style.css";
import SubmitButton from "../SubmitButton";
import { useEffect, useState } from "react";
import { LoginFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createJwt, loginUser } from "@/lib/actions/patient.actions";
import { toast } from "react-toastify";

export enum FormFieldType {
  INPUT = "input",
  SELECT = "select",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SKELETON = "skeleton",
}

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  const { control, clearErrors } = form;
  const email = useWatch({ control, name: "email" });
  const phone = useWatch({ control, name: "phone" });

  useEffect(() => {
    if (email) clearErrors("phone");
    if (phone) clearErrors("email");
  }, [email, phone, clearErrors]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof LoginFormValidation>) {
    setIsLoading(true);
    try {
      let userData;
      if ("email" in values) {
        userData = {
          email: values.email,
        };
      } else if ("phone" in values) {
        userData = {
          phone: values.phone,
        };
      } else if ("email" in values && "phone" in values) {
        userData = {
          email: values.email,
          phone: values.phone,
        };
      }

      const user = await loginUser(userData!);

      if (user) {
        const jwt = await createJwt(user.$id);

        localStorage.setItem("accessToken", jwt.jwt);
        if (jwt) {
          router.push(`/patients/${user.$id}/dashboard`);
          toast.success(`${user.name}, welcome back!`);
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong, please try again");
    }
    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header"> Hi there 👋</h1>
          <p className="text-dark-700">Login to your account to schedule your first appointment</p>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="john.doe@me.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <p className="text-2xl font-bold text-center">OR</p>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name="phone"
          label="Phone number"
          placeholder="(+91) 1234567890"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        <p className="text-14-regular text-center">
          Don&apos;t have an account?{" "}
          <Link href="/" className="text-green-500 ml-1 hover:text-dark-700">
            Register here
          </Link>
        </p>
      </form>
    </Form>
  );
};
export default LoginForm;
