/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { logoutUser } from "@/lib/actions/patient.actions";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = () => {
      setTimeout(async () => {
        await logoutUser();
        router.push("/login");
      }, 3000);
    };
    logout();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
      <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Logging you out...
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for visiting! You’ll be redirected to the login page
          shortly.
        </p>
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default Logout;
