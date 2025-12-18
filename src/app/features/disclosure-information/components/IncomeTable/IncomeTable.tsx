import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { useEffect, useState } from "react";
import { convertData } from "./convertData";
import { nestedTnums } from "./nestedTnums";
import { allowedReportTitleTnums } from "./allowedReportTitleTnums";
import { Table } from "@/app/shared/ui/components/Table";
import { Switch } from "@/app/shared/ui/components/Switch";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import Select from "@/app/shared/ui/components/Select/Select";
import Box from "@/app/shared/ui/components/Box";
import { getKeyFilterReport } from "./getKeyFilterReport";
import { nestedTitleIds } from "./nestedTitleIds";
import { allowedTitleIds } from "./allowedTitleIds";
import DownloadCSV from "./DownloadCSV";
import { convertReportsToReportArr } from "./convertReportsToReportArr";
import { useTranslations, useLocale } from "next-intl";
import { Tooltip } from "antd";

type FlatIncomeRow = {
  title_id: number;
  title: string;
  tnum?: string;
  [key: string]: any;
};

// type IncomeTableType = Array<{
//   id: number;
//   reporting_year: number;
//   accounting_report: Array<{
//     id: number;
//     main_report: number;
//     title_id: number;
//     title: string;
//     tnum?: string;
//     value1: number;
//     value2: number;
//     value3: number;
//     value4: number;
//     is_title: boolean;
//     is_highlight: boolean;
//     is_automated: boolean;
//     value: number;
//   }>;
//   period: string;
// }>;

export const IncomeTable = ({ organizationId }: { organizationId: string }) => {
  const t = useTranslations();
  const locale = useLocale() || "en-US";

  const [incomeList, setIncomeList] = useState<FlatIncomeRow[]>([]);
  const [columns, setColumns] = useState<TableColumn<FlatIncomeRow>[]>([]);
  const [hideNested, setHideNested] = useState(true);
  const [reportType, setReportType] = useState<{
    label: string;
    value: "annual" | "quarter";
  }>({ label: t("IncomeTable.Year"), value: "annual" });

  const formatLargeNumber = (num: number) => {
    const absNum = Math.abs(num);
    let value: any;
    let suffix = "";

    if (absNum >= 1_000_000_000_000) {
      value = num / 1_000_000_000_000;
      suffix = t("IncomeTable.trillion");
    } else if (absNum >= 1_000_000_000) {
      value = num / 1_000_000_000;
      suffix = t("IncomeTable.billion");
    } else if (absNum >= 1_000_000) {
      value = num / 1_000_000;
      suffix = t("IncomeTable.million");
    } else if (absNum >= 1_000) {
      value = num / 1_000;
      suffix = t("IncomeTable.thousand");
    } else {
      return num.toLocaleString(locale);
    }

    return `${value.toLocaleString(locale, {
      minimumFractionDigits: value % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1,
    })}${suffix}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await FetchService.fetch<any[]>(
          `/api/v2/reports/accounting-report/${organizationId}/?accounting_type=form2&report_type=${reportType.value}`
        );

        const allTitleIds = Array.from(
          new Set(response.flatMap(p => p.accounting_report.map(r => r.title_id)))
        );

        const flatData: FlatIncomeRow[] = allTitleIds.map(title_id => {
          const row: FlatIncomeRow = { title_id, title: "" };

          response.forEach((period, idx) => {
            const reportItem = period.accounting_report.find(r => r.title_id === title_id);
            row[`__period_${idx}`] = reportItem ? reportItem.value : null;
            if (reportItem && !row.title) row.title = reportItem.title;
            if (reportItem && !row.tnum) row.tnum = reportItem.tnum;
          });

          return row;
        });

        const other_cols: TableColumn<FlatIncomeRow>[] = response.map((item, index) => ({
          title: item.period,
          dataIndex: `__period_${index}`,
          align: "right",
          render: (val: number) =>
            typeof val === "number" ? (
              <Tooltip title={val.toLocaleString(locale)}>
                <span className="whitespace-nowrap">{formatLargeNumber(val)}</span>
              </Tooltip>
            ) : (
              "-"
            ),
        }));


        const key = getKeyFilterReport(flatData);

        const filteredData =
          key === "title_id"
            ? flatData.filter(i => allowedTitleIds.includes(i.title_id))
            : flatData.filter(i => allowedReportTitleTnums.includes(i.tnum));

        setColumns([
          {
            title: t("IncomeTable.PageCode"),
            dataIndex: key,
            render: (_, r) => {
              const isNested =
                key === "title_id"
                  ? nestedTitleIds.includes(r.title_id)
                  : nestedTnums.includes(r.tnum);

              return (
                <div className="flex items-center">
                  {isNested && <div className="w-4" />}
                  <span>{key === "title_id" ? r.title_id : r.tnum}</span>
                </div>
              );
            },
          },
          {
            title: t("IncomeTable.IndicatorName"),
            dataIndex: "title",
            className: "min-w-100 w-[500px]",
            render: (_, r) => {
              const isNested =
                key === "title_id"
                  ? nestedTitleIds.includes(r.title_id)
                  : nestedTnums.includes(r.tnum);

              return (
                <div className="flex items-center">
                  {isNested && <div className="w-4" />}
                  <span>{r.title}</span>
                </div>
              );
            },
          },
          ...other_cols,
        ]);

        setIncomeList(filteredData); // ✨ CHANGED
      } catch (err) {
        console.error("Error fetching financial data:", err);
      }
    };

    fetchData();
  }, [organizationId, reportType, t, locale]); // ✨ locale added

  return (
    <Box>
      <div className="mb-3 flex flex-wrap items-center gap-2 justify-between">
        <Text>{t("IncomeTable.Group")}</Text>

        <Select
          onChange={option => setReportType(option as any)}
          options={[
            { label: t("IncomeTable.Year"), value: "annual" },
            { label: t("IncomeTable.Quarter"), value: "quarter" },
          ]}
          value={reportType}
        />

        <Switch
          label={t("IncomeTable.Detail")}
          onChange={c => setHideNested(!c)}
          checked={!hideNested}
        />

        <Text>{t("IncomeTable.ThousandSum")}</Text>

        <DownloadCSV
          reports={convertReportsToReportArr(
            columns as any[],
            hideNested
              ? incomeList.filter(i =>
                getKeyFilterReport(incomeList) === "title_id"
                  ? !nestedTitleIds.includes(i.title_id)
                  : !nestedTnums.includes(i.tnum)
              )
              : incomeList
          )}
        />
      </div>

      <Table
        bordered={false}
        columns={columns}
        data={
          hideNested
            ? incomeList.filter(i =>
              getKeyFilterReport(incomeList) === "title_id"
                ? !nestedTitleIds.includes(i.title_id)
                : !nestedTnums.includes(i.tnum)
            )
            : incomeList
        }
      />
    </Box>
  );
};
