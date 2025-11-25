import { EmissionBase } from "@/app/[locale]/emissions/[emissionType]/[emissionId]/emissions/EmissionBase";
import { FactBuilder } from "@/app/features/facts/components/FactBuilder";
import { FactBase } from "@/app/features/facts/models/base/FactBase";
import { useTranslations } from "next-intl";

export const FactBuilderContainer: React.FC<{ model: EmissionBase | FactBase }> = ({ model }) => {
  const t = useTranslations();
  model.setTranslator = t;
  return <FactBuilder sections={model.getSections.sections} />;
};
