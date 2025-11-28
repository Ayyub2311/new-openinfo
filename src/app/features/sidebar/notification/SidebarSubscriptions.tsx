"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Link, useRouter } from "@/i18n/routing";
import { Text } from "@/app/shared/ui/components/Typography/Text";

import OrgLogo from "@/app/shared/default-logo";
import { SubscribeToggle } from "./SubscribeToggle";
import { FetchService } from "@/app/shared/lib/api/fetch.service";

type OrgWithSub = {
  id: number;
  full_name_text: string;
  logo: string | null;
  is_subscribed: boolean;
  subscription_id: number | null;
};

type ApiList<T> = {
  count: number;
  total_pages: number;
  page_size: number;
  current: number;
  previous: string | null;
  next: string | null;
  results: T[];
};

const dedupeById = <T extends { id: number }>(arr: T[]) => {
  const m = new Map<number, T>();
  for (const it of arr) m.set(it.id, it);
  return Array.from(m.values());
};

export default function SidebarSubscriptions({
  pageSize = 10,
  title = "Подписки",
  showToggle = true, // set false if you want read-only
}: {
  pageSize?: number;
  title?: string;
  showToggle?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<OrgWithSub[]>([]);
  // const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>(""); // input text
  const [query, setQuery] = useState<string>(""); // applied search

  const toRelative = (u: string | null) => {
    if (!u) return null;
    try {
      const url = new URL(u);
      return `${url.pathname}${url.search}`; // -> "/api/v2/organizations/....?page=2"
    } catch {
      return u; // already relative
    }
  };

  const fetchPage = useCallback(
    async (url?: string) => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = url
          ? toRelative(url)!
          : `/api/v2/organizations/organizations-with-subscription/?page_size=${pageSize}${query ? `&search=${encodeURIComponent(query)}` : ""}`;

        const data = await FetchService.fetch<ApiList<OrgWithSub>>(endpoint);
        setItems(prev => dedupeById([...(prev ?? []), ...(data.results ?? [])]));
      } catch (e) {
        setError("Не удалось загрузить организации.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, query]
  );

  // initial + whenever query changes
  useEffect(() => {
    setItems([]);
    // setNextUrl(null);
    fetchPage();
  }, [fetchPage]);

  const onToggle = (orgId: number, next: boolean, subId: number | null) => {
    setItems(cur => cur.map(x => (x.id === orgId ? { ...x, is_subscribed: next, subscription_id: subId } : x)));
  };

  const rows = useMemo(() => items, [items]);

  const router = useRouter();

  const handleClick = () => {
    router.push("/organizations");
  };

  return (
    <div>
      <Text className="text-sm font-semibold mb-2">{title}</Text>

      {/* tiny search bar */}
      <div className="flex items-center gap-2 mb-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск организации"
          className="h-8 w-full rounded-xl border border-default px-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="h-8 px-3 rounded-xl bg-blue-600 text-white text-xs disabled:opacity-60"
          onClick={() => setQuery(search.trim())}
          disabled={loading && rows.length === 0}
        >
          Поиск
        </button>
      </div>

      {error && <div className="mb-2 text-xs text-red-600">{error}</div>}

      {loading && rows.length === 0 ? (
        <Text className="text-xs text-gray-500">Загрузка…</Text>
      ) : rows.length === 0 ? (
        <Text className="text-xs text-gray-400">Ничего не найдено</Text>
      ) : (
        <ul className="space-y-2">
          {rows.map(it => (
            <li
              key={it.id}
              className="group flex items-center justify-between rounded-xl border border-default bg-white/60 p-3 shadow-sm shadow-black/[0.02] ring-1 ring-black/[0.02] transition-colors hover:bg-white md:p-3.5"
            >
              <Link href={`/ru/organizations/${it.id}`} className="flex items-center gap-2 min-w-0">
                <OrgLogo id={it.id} shortName={it.full_name_text} />
                <span className="text-xs ">{it.full_name_text}</span>
              </Link>

              {showToggle && (
                <SubscribeToggle
                  organizationId={it.id}
                  isSubscribed={it.is_subscribed}
                  subscriptionId={it.subscription_id}
                  size={18}
                  onChange={(next, subId) => onToggle(it.id, next, subId)}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {/* {nextUrl && (
        <button
          className="mt-3 w-full h-7 rounded-md bg-gray-100 text-xs hover:bg-gray-200"
          onClick={() => fetchPage(nextUrl)}
          disabled={loading}
        >
          {loading ? "Загрузка…" : "Показать ещё"}

        </button>
      )} */}

      <button
        className="mt-3 w-full h-7 rounded-xl bg-gray-100 text-xs hover:bg-gray-200"
        onClick={handleClick}
        disabled={loading}
      >
        Показать все
      </button>
    </div>
  );
}
