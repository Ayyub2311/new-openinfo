"use client";

import Container from "@/app/shared/ui/components/Container";
import Tabs from "@/app/shared/ui/components/Tabs";
import { Tab } from "@/app/shared/ui/components/Tabs/types";
import { useTranslations } from "next-intl";
import LicenseTable from "./license";
import AttestationTable from "./attestation";
import MaterialFiles from "./material-table";

const Attestation = () => {
  const t = useTranslations();

  const tabs: Tab[] = [
    {
      id: "license",
      label: t("AttestationTabs.license"),
      content: <LicenseTable />,
    },

    {
      id: "attestation",
      label: t("AttestationTabs.attestation"),
      content: <AttestationTable />,
    },
    {
      id: "test-process",
      label: t("AttestationTabs.certification"),
      content: <MaterialFiles />,
    },
  ];

  const handleTabChange = (tabId: string) => {
    console.log("Active tab:", tabId);
  };

  return (
    <Container className="mt-10 mb-14">
      <Tabs tabs={tabs} defaultActiveTab="license" onChange={handleTabChange} />
    </Container>
  );
};

export default Attestation;
