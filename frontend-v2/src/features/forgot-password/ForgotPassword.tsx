"use client";

import { FC } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/shared";
import { APP_PATHS } from "@/constants";

export const ForgotPassword: FC = () => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center text-center py-6 px-4"></div>
  );
};

export default ForgotPassword;
