import { Title } from "@/app/shared/ui/components/Typography/Title";
import MarketScreenerTable from "../organizations/MarketScreenerTable";
import Container from "@/app/shared/ui/components/Container";
import { useTranslations } from "next-intl";

const MarketFilter = () => {
  const t = useTranslations("Navigation") as (key: string) => string;
  return (
    <div>
      <Container className="mb-6 mt-10">
        <Title> {t("market_filter")} </Title>
      </Container>
      <MarketScreenerTable />
    </div>
  );
};

export default MarketFilter;
