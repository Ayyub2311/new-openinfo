"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OrgLogo from "@/app/shared/default-logo";
import { Button } from "@/app/shared/ui/components/Button";
import { Table } from "@/app/shared/ui/components/Table";
import { Edit2, Trash2, Plus, ArrowUpDown, ChevronDown, X, Loader2, Search } from "lucide-react";
import { PortfolioService } from "../services/portfolioService";
import Container from "@/app/shared/ui/components/Container";
import FormatNumbers from "@/app/shared/format-number";
import { useTranslations } from "next-intl";

/* ---------- Minimal translations (non-intrusive) ---------- */
/** Replace this with your real i18n hook when ready.
 *  Current behavior: returns the default text (so UI stays identical).
 */
// function useTranslations(ns?: string) {
//   return (key: string, defaultText?: string) => defaultText ?? key;
// }

/* ---------- Types ---------- */
type Position = {
  id: number;
  stock_isin: string;
  ticker: string;
  short_name_text: string;
  number_of_shares: number;
  initial_price: number;
  current_price: number;
  total_value: number;
  performance: number; // %
};

type StockOption = {
  isin_code: string;
  short_name_text: string;
  ticker: string;
  current_price: number;
  stock_exchange_status: string; // e.g., "listing"
};

type AddForm = {
  selectedIsin: string; // we store the selected stock by ISIN
  number_of_shares: string;
  initial_price: string;
};

type EditForm = {
  number_of_shares: string;
  initial_price: string;
};

const currency = (v: number | null | undefined) =>
  v == null ? "—" : new Intl.NumberFormat("ru-RU").format(v) + " UZS";

/* ---------- Reusable Modal Shell ---------- */
function Modal({
  title,
  open,
  onClose,
  children,
  footer,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} aria-hidden />
      <div className="relative z-[61] w-[92vw] max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? <div className="border-t px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}

/* ---------- Tiny Searchable Select (headless) ---------- */
function SearchableStockSelect({
  options,
  valueIsin,
  onChange,
  loading,
  placeholder,
}: {
  options: StockOption[];
  valueIsin: string;
  onChange: (stock: StockOption | null) => void;
  loading?: boolean;
  placeholder?: string;
}) {
  const t = useTranslations("portfolio.search");

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selected = useMemo(() => options.find(o => o.isin_code === valueIsin) || null, [options, valueIsin]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 200); // cap initial list
    return options
      .filter(o => {
        const text = `${o.ticker} ${o.short_name_text}`.toLowerCase();
        return text.includes(q);
      })
      .slice(0, 100); // cap results for performance
  }, [options, query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(s => !s)}
        className="flex w-full items-center justify-between rounded-xl border border-default px-3 py-2 text-left outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Search size={16} className="shrink-0 text-gray-400" />
          <span className={`truncate ${selected ? "text-gray-900" : "text-gray-400"}`}>
            {selected
              ? `${selected.ticker} — ${selected.short_name_text}`
              : loading
                ? t("loading", "Загрузка…")
                : t("selectSecurity", "Выберите ценную бумагу")}
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-[62] mt-1 w-full overflow-hidden rounded-xl border border-default bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setHover(0);
              }}
              onKeyDown={e => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHover(h => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHover(h => Math.max(h - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const pick = filtered[hover];
                  if (pick) {
                    onChange(pick);
                    setOpen(false);
                    setQuery("");
                  }
                } else if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
              className="w-full border-none p-0 outline-none placeholder:text-gray-400"
              placeholder={placeholder ?? t("placeholder", "Найдите по тикеру или названию…")}
            />
          </div>
          <ul role="listbox" className="max-h-72 overflow-auto">
            {loading ? (
              <li className="px-3 py-2 text-sm text-gray-500">{t("loading", "Загрузка…")}</li>
            ) : filtered.length ? (
              filtered.map((o, idx) => (
                <li
                  key={`${o.ticker}-${o.isin_code}-${idx}`}
                  role="option"
                  aria-selected={o.ticker === valueIsin}
                  onMouseEnter={() => setHover(idx)}
                  onMouseDown={e => {
                    // mousedown to select before blur
                    e.preventDefault();
                    onChange(o);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`cursor-pointer px-3 py-2 text-sm ${idx === hover ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {o.ticker} — {o.short_name_text}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        {o.isin_code} · {o.stock_exchange_status}
                      </div>
                    </div>
                    <div className="shrink-0 text-xs text-gray-600">{currency(o.current_price)}</div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500">{t("nothingFound", "Ничего не найдено")}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export const PortfolioTicker = () => {
  const t = useTranslations("portfolio");
  const [positions, setPositions] = useState<Position[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [initialValue, setInitialValue] = useState(0);
  const [performance, setPerformance] = useState(0);
  const [totalPerformanceSoums, setTotalPerformanceSoums] = useState(0);
  const [loading, setLoading] = useState(false);

  // Add/Edit modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Position | null>(null);

  // Stock options for Add
  const [stockOptions, setStockOptions] = useState<StockOption[]>([]);
  const [stocksLoading, setStocksLoading] = useState(false);

  // Forms
  const [addForm, setAddForm] = useState<AddForm>({
    selectedIsin: "",
    number_of_shares: "",
    initial_price: "",
  });
  const [editForm, setEditForm] = useState<EditForm>({
    number_of_shares: "",
    initial_price: "",
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await PortfolioService.getPortfolio();
      setPositions(res.positions || []);
      setTotalValue(res.total_value || 0);
      setInitialValue(res.initial_value || 0);
      setPerformance(res.performance || 0);
      setTotalPerformanceSoums(res.total_performance_soums || 0);
    } catch (e) {
      console.error("Failed to fetch portfolio:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStocks = async () => {
    setStocksLoading(true);
    try {
      const res = await PortfolioService.getAllStocks();
      // res is expected to be StockOption[]
      setStockOptions(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error("Failed to load stocks:", e);
    } finally {
      setStocksLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  /* ---------- Actions ---------- */
  const handleOpenAdd = () => {
    setFormError(null);
    setAddForm({ selectedIsin: "", number_of_shares: "", initial_price: "" });
    if (!stockOptions.length) fetchStocks();
    setAddOpen(true);
  };

  const handleEdit = (record: Position) => {
    setFormError(null);
    setEditRecord(record);
    setEditForm({
      number_of_shares: String(record.number_of_shares ?? ""),
      initial_price: String(record.initial_price ?? ""),
    });
    setEditOpen(true);
  };

  const handleDelete = useCallback(async (id: number) => {
    try {
      await PortfolioService.deletePosition(id);
      await fetchPortfolio();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }, []);

  /* ---------- Helpers ---------- */
  const asPositiveNumber = (s: string) => {
    const n = Number(s);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const selectedStock = useMemo(
    () => stockOptions.find(s => s.isin_code === addForm.selectedIsin) || null,
    [stockOptions, addForm.selectedIsin]
  );

  /* ---------- Submit (Add) ---------- */
  const submitAdd = async () => {
    setFormError(null);
    if (!selectedStock) {
      setFormError(t("errors.selectSecurity", "Выберите ценную бумагу."));
      return;
    }
    const shares = asPositiveNumber(addForm.number_of_shares);
    const price = asPositiveNumber(addForm.initial_price);
    if (!shares) {
      setFormError(t("errors.invalidShares", "Укажите корректное количество (> 0)."));
      return;
    }
    if (!price) {
      setFormError(t("errors.invalidInitialPrice", "Укажите корректную начальную цену (> 0)."));
      return;
    }

    setSubmitLoading(true);
    try {
      await PortfolioService.addPosition({
        stock_isin: selectedStock.isin_code,
        stock_exchange_status: selectedStock.stock_exchange_status || "listing",
        number_of_shares: shares,
        initial_price: price,
      });
      setAddOpen(false);
      await fetchPortfolio();
    } catch (e) {
      console.error("Add error:", e);
      setFormError(t("errors.addFailed", "Не удалось добавить позицию. Проверьте данные и попробуйте снова."));
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ---------- Submit (Edit) ---------- */
  const submitEdit = async () => {
    if (!editRecord) return;
    setFormError(null);
    const shares = asPositiveNumber(editForm.number_of_shares);
    const price = asPositiveNumber(editForm.initial_price);
    if (!shares) {
      setFormError(t("errors.invalidShares", "Укажите корректное количество (> 0)."));
      return;
    }
    if (!price) {
      setFormError(t("errors.invalidInitialPrice", "Укажите корректную начальную цену (> 0)."));
      return;
    }

    setSubmitLoading(true);
    try {
      await PortfolioService.updatePosition(editRecord.id, {
        number_of_shares: shares,
        initial_price: price,
      });
      setEditOpen(false);
      setEditRecord(null);
      await fetchPortfolio();
    } catch (e) {
      console.error("Update error:", e);
      setFormError(t("errors.updateFailed", "Не удалось обновить позицию. Попробуйте снова."));
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ---------- Columns ---------- */
  const columns = useMemo(
    () => [
      {
        dataIndex: "ticker",
        title: (
          <div className="flex items-center gap-1">
            <span>{t("table.ticker", "Тикер")}</span>
            <ArrowUpDown size={14} className="text-gray-400" />
          </div>
        ),
        align: "left" as const,
        render: (_: any, record: Position) => (
          <div className="flex items-center gap-3">
            <OrgLogo id={record.id} shortName={record.ticker || "-"} logoFile={null} size={32} />
            <div className="flex flex-col">
              <span className="font-medium">{record.ticker || "—"}</span>
              <span className="text-xs text-gray-500">{record.short_name_text || "—"}</span>
            </div>
          </div>
        ),
      },
      {
        dataIndex: "number_of_shares",
        title: (
          <div className="flex items-center justify-end gap-1">
            <span>{t("table.shares", "Кол-во")}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        ),
        align: "right" as const,
        width: 90,
        render: (v: number) => <FormatNumbers value={v} showCurrency={false} colorByValue={false} />,
      },
      {
        dataIndex: "initial_price",
        title: t("table.initialPrice", "Начальная цена"),
        align: "right" as const,
        render: (v: number) => <FormatNumbers value={v} colorByValue={false} />,
      },
      {
        dataIndex: "current_price",
        title: t("table.currentPrice", "Текущая цена"),
        align: "right" as const,
        render: (v: number) => <FormatNumbers value={v} colorByValue={false} />,
      },
      {
        dataIndex: "performance",
        title: t("table.change", "Изменение"),
        align: "right" as const,
        render: (val: number) =>
          val == null ? (
            "—"
          ) : (
            <>
              <FormatNumbers value={val} showCurrency={false} colorByValue={true} decimals={2} suffix="%" />
            </>
          ),
      },
      {
        dataIndex: "performance_soums",
        title: t("table.changeInSoums", "Изменения в сумах"),
        align: "right" as const,
        render: (val: number) =>
          val == null ? (
            "—"
          ) : (
            <>
              <FormatNumbers value={val} showCurrency={false} colorByValue={true} decimals={0} />
            </>
          ),
      },
      {
        dataIndex: "total_value",
        title: t("table.value", "Стоимость"),
        align: "right" as const,
        render: (v: number) => <FormatNumbers value={v} colorByValue={false} />,
      },
      {
        dataIndex: "actions",
        title: "",
        align: "center" as const,
        width: 120,
        render: (_: any, record: Position) => (
          <div className="flex justify-center gap-1">
            <Button
              variant="ghost"
              color="primary"
              size="sm"
              shape="circle"
              onClick={() => handleEdit(record)}
              aria-label="Edit"
            >
              <Edit2 size={16} className="text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              color="danger"
              size="sm"
              shape="circle"
              onClick={() => handleDelete(record.id)}
              aria-label="Delete"
            >
              <Trash2 size={16} className="text-red-600" />
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete, t]
  );

  return (
    <Container className="mt-5 mb-5">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("header.title", "Портфель")}</h1>
          <p className="mt-1 text-gray-500">{t("header.subtitle", "Обзор ваших инвестиций")}</p>
        </div>
        <div className="flex gap-3">
          {/* <Button variant="outline" color="primary" size="md">
            <Download size={18} className="mr-2" />
            {t("actions.export", "Экспорт")}
          </Button> */}
          <Button variant="filled" color="primary" size="md" onClick={handleOpenAdd}>
            <Plus size={18} className="mr-2" />
            {t("actions.add", "Добавить")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table
        loading={loading}
        columns={columns}
        data={positions}
        bordered={false}
        rowClassName={(_, index) =>
          `transition-colors border-b border-default hover:bg-gray-50/70 ${index % 2 === 0 ? "bg-gray-50/30" : ""}`
        }
        className="mb-8 overflow-hidden rounded-xl"
      />

      {/* Summary (compact) */}
      <div className=" max-w-xl rounded-xl border border-default/70 bg-white/80 p-5 shadow-sm">
        <h2 className="text-sm font-medium text-gray-600">{t("summary.title")}</h2>

        <div className="mt-2 flex items-end justify-between gap-4">
          {/* Left: total + from */}
          <div className="min-w-0">
            <FormatNumbers
              colorByValue={false}
              value={totalValue}
              className="truncate text-4xl font-bold leading-tight text-gray-900"
            />
            <div className="text-md text-gray-500">
              {t("summary.from")}{" "}
              <FormatNumbers value={initialValue} showCurrency colorByValue={false} className="text-gray-500" />
            </div>
          </div>

          {/* Right: performance pill */}
          <div
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1",
              performance >= 0 ? "bg-green-50 text-green-700 ring-green-200" : "bg-red-50 text-red-700 ring-red-200",
            ].join(" ")}
          >
            <span className="select-none">{performance >= 0 ? "↑" : "↓"}</span>
            <FormatNumbers value={performance} suffix="%" showCurrency={false} />
          </div>
        </div>

        {/* Absolute P/L (subtle) */}
        <div className="mt-2 text-sm text-gray-600">
          {t("summary.pnl")}:{" "}
          <span className={["font-medium", performance >= 0 ? "text-green-700" : "text-red-700"].join(" ")}>
            <FormatNumbers value={totalPerformanceSoums} showCurrency />
          </span>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        title={t("addModal.title", "Добавить позицию")}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              {t("common.cancel", "Отмена")}
            </Button>
            <Button variant="filled" color="primary" onClick={submitAdd} disabled={submitLoading}>
              {submitLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> {t("common.saving", "Сохраняю…")}
                </span>
              ) : (
                t("common.save", "Сохранить")
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Searchable stock select */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              {t("fields.security", "Ценная бумага")}
            </span>
            <SearchableStockSelect
              options={stockOptions}
              valueIsin={addForm.selectedIsin}
              loading={stocksLoading}
              onChange={stock => setAddForm(s => ({ ...s, selectedIsin: stock?.isin_code ?? "" }))}
              placeholder={t("search.placeholder", "Найдите по тикеру или названию…")}
            />
          </label>

          {/* Shares */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">{t("fields.quantity", "Количество")}</span>
            <input
              type="number"
              min={0}
              step="1"
              inputMode="decimal"
              className="w-full rounded-xl border border-default px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder={t("placeholders.example100", "Например: 100")}
              value={addForm.number_of_shares}
              onChange={e => setAddForm(s => ({ ...s, number_of_shares: e.target.value }))}
            />
          </label>

          {/* Initial price */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              {t("fields.initialPriceUZS", "Начальная цена (UZS)")}
            </span>
            <input
              type="number"
              min={0}
              step="0.0001"
              inputMode="decimal"
              className="w-full rounded-xl border border-default px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder={t("placeholders.example12500", "Например: 12500")}
              value={addForm.initial_price}
              onChange={e => setAddForm(s => ({ ...s, initial_price: e.target.value }))}
            />
          </label>

          {selectedStock ? (
            <div className="rounded-xl border border-default bg-gray-50 p-3 text-xs text-gray-600">
              {t("selected.youChose", "Вы выбрали:")} <span className="font-medium">{selectedStock.ticker}</span> —{" "}
              {selectedStock.short_name_text}
              <span className="mx-2">•</span> ISIN: {selectedStock.isin_code}
              <span className="mx-2">•</span> {t("selected.status", "Статус")}: {selectedStock.stock_exchange_status}
            </div>
          ) : null}

          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={
          editRecord
            ? `${t("editModal.title", "Редактировать позицию")} — ${editRecord.ticker}`
            : t("editModal.title", "Редактировать позицию")
        }
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditRecord(null);
        }}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditOpen(false);
                setEditRecord(null);
              }}
            >
              {t("common.cancel", "Отмена")}
            </Button>
            <Button variant="filled" color="primary" onClick={submitEdit} disabled={submitLoading}>
              {submitLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> {t("common.saving", "Сохраняю…")}
                </span>
              ) : (
                t("common.save", "Сохранить")
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Read-only context */}
          {editRecord ? (
            <div className="rounded-xl border border-default bg-gray-50 p-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <OrgLogo id={editRecord.id} shortName={editRecord.ticker || "-"} logoFile={null} size={28} />
                <div>
                  <div className="font-medium">{editRecord.ticker}</div>
                  <div className="text-gray-500">{editRecord.short_name_text}</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Shares */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">{t("fields.quantity", "Количество")}</span>
            <input
              type="number"
              min={0}
              step="1"
              inputMode="decimal"
              className="w-full rounded-xl border border-default px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder={t("placeholders.example100", "Например: 100")}
              value={editForm.number_of_shares}
              onChange={e => setEditForm(s => ({ ...s, number_of_shares: e.target.value }))}
            />
          </label>

          {/* Initial price */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              {t("fields.initialPriceUZS", "Начальная цена (UZS)")}
            </span>
            <input
              type="number"
              min={0}
              step="0.0001"
              inputMode="decimal"
              className="w-full rounded-xl border border-default px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder={t("placeholders.example12500", "Например: 12500")}
              value={editForm.initial_price}
              onChange={e => setEditForm(s => ({ ...s, initial_price: e.target.value }))}
            />
          </label>

          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
        </div>
      </Modal>
    </Container>
  );
};
