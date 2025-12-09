import RequireAuth from "@/app/features/auth/RequireAuth";
import { PortfolioTicker } from "@/app/features/portfolio/components/PortfolioTable";

const Portfolio = () => {
  return (
    <RequireAuth>
      <PortfolioTicker />
    </RequireAuth>
  );
};

export default Portfolio;
