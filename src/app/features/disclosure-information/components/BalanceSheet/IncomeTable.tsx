import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { useEffect, useState } from "react";
import { convertData } from "../IncomeTable/convertData";
import { nestedTnums } from "./nestedTnums";
import { allowedReportTitleTnums } from "./allowedReportTitleTnums";
import { Table } from "@/app/shared/ui/components/Table";
import { Switch } from "@/app/shared/ui/components/Switch";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import Select from "@/app/shared/ui/components/Select/Select";
import Box from "@/app/shared/ui/components/Box";
import { getKeyFilterReport } from "../IncomeTable/getKeyFilterReport";
import { nestedTitleIds } from "./nestedTitleIds";
import { allowedTitleIds } from "./allowedTitleIds";
import DownloadCSV from "../IncomeTable/DownloadCSV";
import { convertReportsToReportArr } from "../IncomeTable/convertReportsToReportArr";
import { useTranslations, useLocale } from "next-intl";
import { Tooltip } from "antd";

type BalanceSheetTableType = Array<{
  id: number;
  reporting_year: number;
  accounting_report: Array<{
    id: number;
    main_report: number;
    title_id: number;
    title: string;
    tnum?: string;
    value1: number;
    value2: number;
    value3: number;
    value4: number;
    is_title: boolean;
    is_highlight: boolean;
    is_automated: boolean;
    value: number;
  }>;
  period: string;
}>;

export const BalanceSheetTable = ({ organizationId }: { organizationId: number }) => {
  const t = useTranslations();
  const locale = useLocale() || "en-US";
  const [incomeList, setIncomeList] = useState<BalanceSheetTableType>([]);
  const [columns, setColumns] = useState<TableColumn<{ tnum?: string; title: string; title_id: number } & any>[]>([]);
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

    const formattedValue = value.toLocaleString(locale, {
      minimumFractionDigits: value % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1,
    });

    return `${formattedValue}${suffix}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await FetchService.fetch<BalanceSheetTableType>(
          `/api/v2/reports/accounting-report/${organizationId}/?accounting_type=form1&report_type=${reportType.value}`
        );
        let d = convertData(response);

        const allTitleIds = Array.from(
          new Set(response.flatMap(p => p.accounting_report.map(r => r.title_id)))
        );

        const flatData = allTitleIds.map(title_id => {
          const row: any = { title_id };
          response.forEach((period, idx) => {
            const reportItem = period.accounting_report.find(r => r.title_id === title_id);
            row[`__period_${idx}`] = reportItem ? reportItem.value : null;
            if (reportItem && !row.title) row.title = reportItem.title;
            if (reportItem && !row.tnum) row.tnum = reportItem.tnum;
          });
          return row;
        });

        const other_cols: TableColumn<any>[] = response.map((item, index) => ({
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
        if (key === "title_id") {
          d = allowedTitleIds.map(item => flatData.find(r => r.title_id === item));
        }
        setColumns([
          {
            title: t("IncomeTable.PageCode"),
            dataIndex: key,
            render: (_, r: any) => {
              if (key === "title_id") {
                if (nestedTitleIds.includes(r.title_id)) {
                  return (
                    <div className="flex items-center">
                      <div className="w-4"></div>
                      <span>{r.title_id}</span>
                    </div>
                  );
                }
                return r.title_id;
              }
              if (nestedTnums.includes(r.tnum)) {
                return (
                  <div className="flex items-center">
                    <div className="w-4"></div>
                    <span>{r.tnum}</span>
                  </div>
                );
              }
              return r.tnum;
            },
          },
          {
            title: t("IncomeTable.IndicatorName"),
            dataIndex: "title",
            render: (_, r: any) => {
              if (key === "title_id") {
                if (nestedTitleIds.includes(r.title_id)) {
                  return (
                    <div className="flex items-center">
                      <div className="w-4"></div>
                      <span>{r.title}</span>
                    </div>
                  );
                }
                return r.title;
              }
              if (nestedTnums.includes(r.tnum)) {
                return (
                  <div className="flex items-center">
                    <div className="w-4"></div>
                    <span>{r.title}</span>
                  </div>
                );
              }
              return r.title;
            },
          },
          ...other_cols,
        ]);

        setIncomeList(
          flatData.filter(i => {
            if (key === "title_id") return allowedTitleIds.includes(i.title_id);
            return allowedReportTitleTnums.includes(i.tnum);
          })
        );
      } catch (err) {
        console.error("Error fetching financial data:", err);
      }
    };

    fetchData();
  }, [organizationId, reportType, t, locale]);

  return (
    <Box>
      <div className="mb-3 flex flex-wrap items-center  gap-2 justify-between">
        <Text>{t("IncomeTable.Group")}</Text>
        <Select
          onChange={option => setReportType(option as any)}
          options={[
            { label: t("IncomeTable.Year"), value: "annual" },
            { label: t("IncomeTable.Quarter"), value: "quarter" },
          ]}
          placeholder={t("IncomeTable.Option")}
          value={reportType}
        />
        <Switch label={t("IncomeTable.Detail")} onChange={c => setHideNested(!c)} checked={!hideNested} />
        <Text>{t("IncomeTable.ThousandSum")}</Text>
        <DownloadCSV
          reports={convertReportsToReportArr(
            columns as any[],
            hideNested
              ? incomeList.filter((i: any) => {
                const key = getKeyFilterReport(incomeList as any[]);
                if (key === "title_id") return !nestedTitleIds.includes(i.title_id);
                return !nestedTnums.includes(i.tnum);
              })
              : incomeList
          )}
        />
      </div>

      <Table
        bordered={false}
        columns={columns}
        data={
          hideNested
            ? incomeList.filter((i: any) => {
              const key = getKeyFilterReport(incomeList as any[]);
              if (key === "title_id") return !nestedTitleIds.includes(i.title_id);
              return !nestedTnums.includes(i.tnum);
            })
            : incomeList
        }
      />
    </Box>
  );
};
