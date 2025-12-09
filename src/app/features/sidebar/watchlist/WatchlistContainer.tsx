"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import OrgLogo from "@/app/shared/default-logo";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import Num from "@/app/shared/lib/utils/Num";
import { Trash2, Loader2 } from "lucide-react";
import RequireAuth from "../../auth/RequireAuth";
import { authModal } from "@/app/shared/store/authModalStore";
type ApiList<T> = {
  count: number;
  total_pages: number;
  page_size: number;
  current: number;
  previous: string | null;
  next: string | null;
  results: T[];
};

type WatchlistItem = {
  id: number;
  stock_isin: string;
  stock_exchange_status: "OPEN" | "CLOSED" | string;
  uzse_info?: {
    ticker: string | null;
    issuer_name: string | null;
    trade_price: number | null;
    change: number | null;
    change_percent: number | null;
  } | null;
};

// const StatusDot: React.FC<{ status?: string }> = ({ status }) => {
//   const color =
//     status?.toUpperCase() === "OPEN"
//       ? "bg-emerald-500"
//       : status?.toUpperCase() === "CLOSED"
//         ? "bg-gray-400"
//         : "bg-amber-500";
//   const label = status?.toUpperCase() === "OPEN" ? "Открыт" : status?.toUpperCase() === "CLOSED" ? "Закрыт" : "—";
//   return (
//     <span
//       className="inline-flex items-center gap-1 rounded-full bg-muted/40 px-2 py-0.5 text-[10px] leading-none"
//       aria-label={`Статус рынка: ${label}`}
//       title={`Статус рынка: ${label}`}
//     >
//       <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
//       {label}
//     </span>
//   );
// };

const RowSkeleton: React.FC = () => (
  <li className="flex items-center justify-between rounded-xl border border-default bg-white/60 p-3 shadow-sm shadow-black/[0.02] ring-1 ring-black/[0.02] transition-colors md:p-3.5">
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 animate-pulse rounded-xl bg-gray-200" />
      <div className="space-y-1">
        <div className="h-3 w-16 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-2.5 w-28 animate-pulse rounded-xl bg-gray-100" />
      </div>
    </div>
    <div className="text-right">
      <div className="mb-0.5 h-3 w-12 animate-pulse rounded-xl bg-gray-200" />
      <div className="h-2.5 w-20 animate-pulse rounded-xl bg-gray-100" />
    </div>
  </li>
);

const ChangeBadge: React.FC<{ change?: number | null; percent?: number | null }> = ({ change, percent }) => {
  const isNeg = (change ?? 0) < 0 || (percent ?? 0) < 0;
  const isZero = (change ?? 0) === 0 && (percent ?? 0) === 0;

  if (isZero) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
        <Minus className="h-3.5 w-3.5" aria-hidden />
        <span className="tabular-nums">
          <Num value={0} decimals={2} /> <Num value={0} decimals={2} suffix="%" />
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] ${isNeg ? "text-red-600" : "text-emerald-600"}`}>
      {isNeg ? (
        <ArrowDownRight className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      )}
      <span className="tabular-nums">
        <Num value={change ?? 0} decimals={2} /> <Num value={percent ?? 0} decimals={2} suffix="%" />
      </span>
    </span>
  );
};

const WatchlistSidebar: React.FC = () => {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const removeItem = async (id: number) => {
    // optimistic update
    const prev = items;
    setDeletingIds(s => new Set(s).add(id));
    setItems(list => list.filter(x => x.id !== id));

    try {
      await FetchService.fetch(`/api/v2/organizations/watchlist/${id}/`, {
        method: "DELETE",
      });
      // success: nothing else to do
    } catch (e) {
      console.error("Не удалось удалить из списка:", e);
      // rollback UI
      setItems(prev);
    } finally {
      setDeletingIds(s => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await FetchService.fetch<ApiList<WatchlistItem>>("/api/v2/organizations/watchlist/");
        setItems(data.results ?? []);
      } catch (err) {
        console.error("Ошибка загрузки списка:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hasItems = useMemo(() => !loading && items.length > 0, [loading, items]);

  return (
    <RequireAuth
      fallback={
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-600">
          <p className="mb-2">Требуется вход, чтобы увидеть список наблюдения.</p>
          <button
            type="button"
            onClick={() => authModal.open("required")}
            className="inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
          >
            Войти
          </button>
        </div>
      }
    >
      <aside className="">
        <div className="mb-3 flex items-center justify-between">
          <Text className="text-sm font-semibold">Мои списки</Text>
        </div>

        {loading && (
          <ul className="space-y-2">
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </ul>
        )}

        {!loading && items.length === 0 && (
          <div className="rounded-xl border border-dashed border-default bg-gray-50/60 p-5 text-center">
            <div className="mx-auto mb-2 h-8 w-8 rounded-xl bg-gray-200" />
            <Text className="text-[13px] text-gray-500">Список наблюдения пуст</Text>
            <Text className="mt-1 text-[12px] text-gray-400">
              Добавляйте эмитентов из карточки компании или таблицы котировок.
            </Text>
          </div>
        )}

        {hasItems && (
          <ul className="space-y-2 overflow-auto">
            {items.map(it => {
              const t = it.uzse_info ?? null;
              const price = t?.trade_price ?? 0;
              const change = t?.change ?? 0;
              const percent = t?.change_percent ?? 0;
              const ticker = t?.ticker ?? it.stock_isin;
              const issuer = t?.issuer_name ?? "—";

              return (
                <li
                  key={it.id}
                  className="grid grid-cols-[auto,1fr,auto] items-center gap-3 md:gap-4
                         rounded-xl border border-default bg-white/70 p-3 md:p-3.5
                         shadow-sm shadow-black/[0.02] ring-1 ring-black/[0.02] hover:bg-white min-w-[288px]"
                >
                  {/* Left: logo + texts */}
                  <div className="flex items-center gap-3 min-w-0">
                    <OrgLogo id={it.id} shortName={issuer || "-"} logoFile={null} size={40} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[13px] md:text-sm tracking-tight tabular-nums whitespace-nowrap">
                          {ticker}
                        </span>
                        {/* <StatusDot status={it.stock_exchange_status} /> */}
                      </div>
                      <span className="block text-[11px] text-gray-500 truncate">{issuer}</span>
                    </div>
                  </div>

                  {/* Middle: price + change (no wrap) */}
                  <div className="justify-self-end text-right leading-tight">
                    <span className="block font-semibold text-[18px] md:text-[20px] tabular-nums whitespace-nowrap">
                      <Num value={price} decimals={2} />
                    </span>
                    <div className="whitespace-nowrap">
                      <ChangeBadge change={change} percent={percent} />
                    </div>
                  </div>

                  {/* Right: action (fixed width, no wrap) */}
                  <div className="justify-self-end shrink-0">
                    <button
                      aria-label="Удалить из списка"
                      onClick={() => removeItem(it.id)}
                      disabled={deletingIds.has(it.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border
                             border-default bg-white/70 text-gray-500 hover:text-red-600 hover:border-red-200
                             transition disabled:opacity-60"
                      title="Удалить"
                    >
                      {deletingIds.has(it.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </RequireAuth>
  );
};

export default WatchlistSidebar;
