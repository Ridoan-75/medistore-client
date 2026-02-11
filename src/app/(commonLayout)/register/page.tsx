import { RegisterForm } from "@/src/components/authentication/register-form";
import React from "react";

export default function Signup() {
  return (
    <div className="flex min-h-[90vh] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
