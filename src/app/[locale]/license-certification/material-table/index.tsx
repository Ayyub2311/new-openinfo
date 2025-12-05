"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Table } from "@/app/shared/ui/components/Table";
import type { TableColumn } from "@/app/shared/ui/components/Table/types";
import Link from "next/link";
import Image from "next/image";

import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { useTranslations } from "next-intl";

interface MaterialFile {
  id: number;
  academic_year: string;
  description: string;
  file_type: string;
  file: string;
}

const MaterialFiles = () => {
  const pathname = usePathname();
  const language = pathname?.split("/")[1] || "ru";
  const [data, setData] = useState<MaterialFile[]>([]);

  const t = useTranslations();

  useEffect(() => {
    const fetchData = async () => {
      const res = await FetchService.fetch<MaterialFile[]>(`/api/v2/reestr/material-files/?language=${language}`);
      setData(res);
    };
    fetchData();
  }, [language]);

  const columns: TableColumn<MaterialFile>[] = [
    {
      title: "№",
      dataIndex: "id",
      render: (_, __, index) => <span className="text-sm">{index + 1}</span>,
    },
    {
      title: t("AttestationTabs.questions_list"),
      dataIndex: "description",
      render: (value: string) => <span className="text-sm">{value}</span>,
      width: "80%",
    },
    {
      title: t("AttestationTabs.download"),
      dataIndex: "file",
      align: "center",
      render: value => (
        <Link href={value} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 flex justify-center">
          <Image src="/assets/general-icons/download.svg" alt="Download" width={24} height={24} className="w-6 h-6" />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <Table
        data={data}
        columns={columns}
        bordered={false}
        className="bg-white -xl shadow-sm"
        rowClassName="hover:bg-gray-50"
      />

      <div className="mt-6">
        <button className="px-6 py-3 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium flex items-center gap-2">
          <span>✔</span>
          {t("AttestationTabs.testProcess")}
        </button>
      </div>
    </div>
  );
};

export default MaterialFiles;
