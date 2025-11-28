"use client";

import { useState, useMemo } from "react";
import { Star } from "lucide-react";

type Props = {
  stockIsin: string;
  is_in_watchlist: boolean;
  watchlist_id?: number | null;
  stockExchangeStatus?: "listing" | "otc" | string;
  size?: number; // px, icon is square
  className?: string;
  onChange?: (next: boolean, id: number | null) => void;
};

const API = process.env.NEXT_PUBLIC_API_URL; // e.g. https://api.example.com

export const WatchlistStar: React.FC<Props> = ({
  stockIsin,
  is_in_watchlist,
  watchlist_id = null,
  stockExchangeStatus = "listing",
  size = 18,
  className,
  onChange,
}) => {
  const [inList, setInList] = useState(!!is_in_watchlist);
  const [id, setId] = useState<number | null>(watchlist_id);
  const [busy, setBusy] = useState(false);

  const box = useMemo(() => ({ width: size + 8, height: size + 8 }), [size]);

  const toggle = async () => {
    if (busy) return;
    const wasIn = inList;
    const wasId = id;

    // optimistic UI
    setInList(!wasIn);
    setBusy(true);

    try {
      if (!wasIn) {
        // OFF -> ON
        const res = await fetch(`${API}/v2/organizations/watchlist/`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stock_isin: stockIsin,
            stock_exchange_status: stockExchangeStatus,
          }),
        });
        if (!res.ok) throw new Error("POST failed");
        const data = await res.json();
        const newId = data?.id ?? null;
        setId(newId);
        onChange?.(true, newId);
      } else {
        // ON -> OFF
        if (id != null) {
          const res = await fetch(`${API}/v2/organizations/watchlist/${id}/`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res.ok) throw new Error("DELETE failed");
        }
        setId(null);
        onChange?.(false, null);
      }
    } catch (e) {
      // rollback
      setInList(wasIn);
      setId(wasId);
      console.error("Watchlist toggle error:", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center justify-center rounded-xl ${busy ? "opacity-60" : ""} ${className ?? ""}`}
      style={box}
    >
      <Star
        width={size}
        height={size}
        className="text-yellow-500"
        strokeWidth={1.6}
        // outline when off, filled when on
        fill={inList ? "currentColor" : "none"}
      />
    </button>
  );
};
