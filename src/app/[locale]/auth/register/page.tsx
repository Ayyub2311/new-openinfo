"use client";

import RegistrationModal from "@/app/features/auth/components/Register";
import React from "react";

const RegisterPage: React.FC = () => {
  const handleBackToLogin = () => {
    console.log("Navigate back to login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <RegistrationModal onClose={handleBackToLogin} />
    </div>
  );
};

export default RegisterPage;
