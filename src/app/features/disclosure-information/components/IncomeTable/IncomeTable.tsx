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
import { useTranslations } from "next-intl";

type IncomeTableType = Array<{
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

export const IncomeTable = ({ organizationId }: { organizationId: string }) => {
  const t = useTranslations();
  const [incomeList, setIncomeList] = useState<IncomeTableType>([]);
  const [columns, setColumns] = useState<TableColumn<{ tnum?: string; title: string; title_id: number } & any>[]>([]);
  const [hideNested, setHideNested] = useState(true);
  const [reportType, setReportType] = useState<{
    label: string;
    value: "annual" | "quarter";
  }>({ label: t("IncomeTable.Year"), value: "annual" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await FetchService.fetch<IncomeTableType>(
          `/api/v2/reports/accounting-report/${organizationId}/?accounting_type=form2&report_type=${reportType.value}`
        );
        let d = convertData(response);

        const other_cols: TableColumn<{ tnum?: string; title: string; title_id: number } & any>[] = response.map(
          (item, index) => {
            return {
              title: item.period,
              dataIndex: `value_${item.reporting_year}_${index}`,
              align: "right",
            };
          }
        );
        const key = getKeyFilterReport(d);
        if (key === "title_id") {
          d = allowedTitleIds.map(item => d.find(r => r.title_id === item));
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
            className: "min-w-100 w-[500px]",
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
          d.filter(i => {
            if (key === "title_id") return allowedTitleIds.includes(i.title_id);
            return allowedReportTitleTnums.includes(i.tnum);
          })
        );
      } catch (err) {
        console.error("Error fetching financial data:", err);
      }
    };

    fetchData();
  }, [organizationId, reportType]);

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
