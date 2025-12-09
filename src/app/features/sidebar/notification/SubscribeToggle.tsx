"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { FetchService } from "@/app/shared/lib/api/fetch.service";

export const SubscribeToggle = ({
  organizationId,
  isSubscribed,
  subscriptionId = null,
  size = 18,
  className,
  onChange,
  notify,
}: {
  organizationId: number;
  isSubscribed: boolean;
  subscriptionId?: number | null;
  size?: number;
  className?: string;
  onChange?: (next: boolean, subscriptionId: number | null) => void;
  notify?: (msg: string) => void;
}) => {
  const [sub, setSub] = useState(!!isSubscribed);
  const [id, setId] = useState<number | null>(subscriptionId);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSub(!!isSubscribed);
    setId(subscriptionId ?? null);
  }, [organizationId, isSubscribed, subscriptionId]);

  const box = useMemo(() => ({ width: size + 8, height: size + 8 }), [size]);

  const toggle = async () => {
    if (busy) return;
    const prev = sub,
      prevId = id;
    setSub(!prev);
    setBusy(true);
    try {
      if (!prev) {
        const data = await FetchService.fetch<{ id: number }>("/api/v2/organizations/subscriptions/", {
          method: "POST",
          body: JSON.stringify({ organization_id: organizationId }),
        });
        const newId = data?.id ?? null;
        setId(newId);
        onChange?.(true, newId);
      } else {
        if (id != null) {
          await FetchService.fetch<void>(`/api/v2/organizations/subscriptions/${id}/`, { method: "DELETE" });
        }
        setId(null);
        onChange?.(false, null);
      }
    } catch (e: any) {
      setSub(prev);
      setId(prevId);
      (notify ?? ((m: string) => alert(m)))(
        e?.response?.status === 401
          ? "Не удалось обновить подписку. Выполните вход и попробуйте снова."
          : "Не удалось обновить подписку."
      );
      console.error(e);
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
      <Bell
        width={size}
        height={size}
        strokeWidth={1.8}
        className={sub ? "text-amber-500" : "text-gray-400"}
        fill={sub ? "currentColor" : "none"}
      />
    </button>
  );
};
