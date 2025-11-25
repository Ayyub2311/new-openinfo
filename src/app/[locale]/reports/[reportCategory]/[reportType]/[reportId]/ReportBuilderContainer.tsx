import { FactBuilder } from "@/app/features/facts/components/FactBuilder";
import { ReportBase } from "@/app/features/reports/models/base/ReportBase";
import { useTranslations } from "next-intl";

export const ReportBuilderContainer: React.FC<{ model: ReportBase }> = ({ model }) => {
  const t = useTranslations();
  model.setTranslator = t;
  return <FactBuilder sections={model.getSections.sections} />;
};
