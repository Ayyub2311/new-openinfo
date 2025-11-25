import RequireAuth from "@/app/features/auth/RequireAuth";
import { PortfolioTicker } from "@/app/features/portfolio/components/PortfolioTable";

const Portfolio = () => {
  return (
    <RequireAuth
      fallback={
        <div className="rounded-xl border border-dashed p-5 text-center text-sm text-gray-600">
          Требуется вход, чтобы увидеть список наблюдения
        </div>
      }
    >
      <PortfolioTicker />
    </RequireAuth>
  );
};

export default Portfolio;
