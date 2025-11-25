"use client";
import Divider from "@/app/shared/ui/components/Divider";
import { Title } from "@/app/shared/ui/components/Typography/Title";
import React from "react";

interface FactTitleProps {
  number: string;
  title: string;
  className?: string;
}

export const FactTitle: React.FC<FactTitleProps> = ({ number, title }) => {
  return (
    <div>
      <Title level={1} className="mt-5 mb-5 text-[1.5rem] text-center">
        {number}. {title}
      </Title>
      <Divider />
    </div>
  );
};
