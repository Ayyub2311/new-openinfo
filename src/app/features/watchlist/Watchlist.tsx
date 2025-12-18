"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Star } from "lucide-react";
import { FetchService } from "@/app/shared/lib/api/fetch.service";

type Props = {
  stockIsin: string;
  is_in_watchlist: boolean;
  watchlist_id?: number | null;
  hasShare: boolean;
  stockExchangeStatus?: "listing" | "otc" | string;
  size?: number;
  className?: string;
  onChange?: (next: boolean, id: number | null) => void;
  notify?: (msg: string) => void;
};

export const WatchlistStar: React.FC<Props> = ({
  stockIsin,
  is_in_watchlist,
  watchlist_id = null,
  hasShare,
  stockExchangeStatus = "listing",
  size = 18,
  className,
  onChange,
  notify,
}) => {
  const [inList, setInList] = useState<boolean>(!!is_in_watchlist);
  const [id, setId] = useState<number | null>(watchlist_id ?? null);
  const [busy, setBusy] = useState(false);
  const [_visible, setVisible] = useState<boolean>(true);

  // ✅ keep local state in sync when parent changes selected instrument
  useEffect(() => {
    setInList(!!is_in_watchlist);
    setId(watchlist_id ?? null);
  }, [is_in_watchlist, watchlist_id, stockIsin]);

  useEffect(() => {
    let mounted = true;

    const checkAvailability = async () => {
      try {
        const res = await FetchService.fetch<{ allowed?: boolean }>(
          `/api/v2/organizations/watchlist/check/?stock_isin=${stockIsin}&market=${stockExchangeStatus}`
        );
        if (mounted) setVisible(!!res?.allowed);
      } catch {
        if (mounted) setVisible(false);
      }
    };
    checkAvailability();

    return () => {
      mounted = false;
    };
  }, [stockIsin, stockExchangeStatus]);

  const box = useMemo(() => ({ width: size + 8, height: size + 8 }), [size]);

  const toggle = useCallback(async () => {
    if (busy) return;

    const prevIn = inList;
    const prevId = id;

    // optimistic
    setInList(!prevIn);
    setBusy(true);

    try {
      if (!prevIn) {
        // OFF -> ON
        const data = await FetchService.fetch<{ id?: number }>("/api/v2/organizations/watchlist/", {
          method: "POST",
          body: JSON.stringify({
            stock_isin: stockIsin,
            stock_exchange_status: stockExchangeStatus,
          }),
        });
        const newId = typeof data?.id === "number" ? data.id : null;
        setId(newId);
        onChange?.(true, newId);
      } else {
        // ON -> OFF
        if (id != null) {
          await FetchService.fetch<void>(`/api/v2/organizations/watchlist/${id}/`, { method: "DELETE" });
        }
        setId(null);
        onChange?.(false, null);
      }
    } catch (e: any) {
      // rollback
      setInList(prevIn);
      setId(prevId);

      const msg = e?.response?.status === 401 ? "Не удалось обновить список наблюдения. Выполните вход и попробуйте снова." : "Не удалось обновить список наблюдения.";
      (notify ?? ((m: string) => alert(m)))(msg);
      if (process.env.NODE_ENV !== "production") console.error("Watchlist toggle error:", e);
    } finally {
      setBusy(false);
    }
  }, [busy, id, inList, notify, onChange, stockExchangeStatus, stockIsin]);

  if (!hasShare) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center justify-center rounded-xl ${busy ? "opacity-60" : ""} ${className ?? ""}`}
      style={box}
      aria-pressed={inList}
      aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Star
        width={size}
        height={size}
        className="text-yellow-500"
        strokeWidth={1.6}
        fill={inList ? "currentColor" : "none"}
      />
    </button>
  );
};
