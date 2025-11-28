"use client";
import React from "react";
import { X } from "lucide-react";
import { Link } from "@/i18n/routing";

export interface ForgotPasswordProps {
  onSubmit: (email: string) => Promise<boolean>;
  onBackToLogin: () => void;
  onClose?: () => void;
}

const SuccessState: React.FC<{
  email: string;
  onBackToLogin: () => void;
  onClose?: () => void;
  onResend: () => void;
}> = ({ email, onBackToLogin, onClose, onResend }) => (
  <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden borderborder-default dark:border-slate-700">
    {onClose && <CloseButton onClick={onClose} className="absolute top-4 right-4 z-10" />}

    <div className="relative p-8 text-center">
      <SuccessIcon />

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Check your email</h2>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        We&apos;ve sent a password reset link to <span className="font-medium">{email}</span>
      </p>

      <button
        onClick={onBackToLogin}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
      >
        Back to login
      </button>

      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Didn&apos;t receive the email?{" "}
        <button
          onClick={onResend}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          Resend
        </button>
      </p>
    </div>
  </div>
);

const FormState: React.FC<{
  email: string;
  isSubmitting: boolean;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
  onClose?: () => void;
}> = ({ email, isSubmitting, setEmail, onSubmit, onBackToLogin, onClose }) => (
  <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-default">
    {onClose && <CloseButton onClick={onClose} className="absolute top-4 right-4 z-10" />}

    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full opacity-30"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-100 rounded-full opacity-30"></div>
    </div>

    <div className="relative p-8">
      <div className="text-center mb-6">
        <PasswordResetIcon />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset your password</h2>
        <p className="text-gray-500">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <EmailInput email={email} setEmail={setEmail} />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <BackToLoginButton onClick={onBackToLogin} />
          <SubmitButton isSubmitting={isSubmitting} />
        </div>
      </form>

      <ResendLink onSubmit={onSubmit} />
    </div>
  </div>
);

const CloseButton: React.FC<{ onClick: () => void; className?: string }> = ({ onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${className}`}
  >
    <X className="w-5 h-5" />
  </button>
);

const SuccessIcon: React.FC = () => (
  <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-50 dark:bg-green-900 rounded-full mb-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-green-600 dark:text-green-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const PasswordResetIcon: React.FC = () => (
  <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  </div>
);

const EmailInput: React.FC<{
  email: string;
  setEmail: (email: string) => void;
}> = ({ email, setEmail }) => (
  <div className="relative">
    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
      Email address
    </label>
    <div className="relative">
      <input
        id="email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-4 py-3 border border-default rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        placeholder="your@email.com"
        required
      />
      <EmailIcon />
    </div>
  </div>
);

const EmailIcon: React.FC = () => (
  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  </div>
);

const BackToLoginButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <Link href="/">Back to login</Link>
  </button>
);

const SubmitButton: React.FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => (
  <button
    type="submit"
    disabled={isSubmitting}
    className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""
      }`}
  >
    {isSubmitting ? <Spinner /> : "Send reset link"}
  </button>
);

const Spinner: React.FC = () => (
  <span className="flex items-center justify-center">
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    Sending...
  </span>
);

const ResendLink: React.FC<{ onSubmit: (e: React.FormEvent) => void }> = ({ onSubmit }) => (
  <div className="mt-8 text-center text-sm text-gray-500">
    <p>
      Didn&apos;t receive an email?{" "}
      <button
        type="button"
        onClick={onSubmit}
        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        Resend
      </button>
    </p>
  </div>
);

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSubmit, onBackToLogin, onClose }) => {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit(email);
      if (success) {
        setIsSuccess(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {isSuccess ? (
        <SuccessState
          email={email}
          onBackToLogin={onBackToLogin}
          onClose={onClose}
          onResend={() => {
            setIsSuccess(false);
            handleSubmit({ preventDefault: () => { } } as React.FormEvent);
          }}
        />
      ) : (
        <FormState
          email={email}
          isSubmitting={isSubmitting}
          setEmail={setEmail}
          onSubmit={handleSubmit}
          onBackToLogin={onBackToLogin}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
