import { FactBuilderProps, FactBuilderSectionTable } from "@/app/features/facts/components/FactBuilder";
import { ReportBase } from "../base/ReportBase";
import { IsArray } from "class-validator";
import { QuarterBalanceSheetResp } from "../nested/Quarterbalancesheet";
import { QuarterFinancialResultsResp } from "../nested/Quarterfinancialresultsresp";
import { Quarterreportresp } from "../nested/Quarterreportresp";

export class JSCQuarterlyReport extends ReportBase {
  @IsArray()
  quarter_balance_sheet_report: QuarterBalanceSheetResp[];

  @IsArray()
  quarter_financial_results_report: QuarterFinancialResultsResp[];

  @IsArray()
  quarter_report_resp: Quarterreportresp[];

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        super.getSectionBankRequisites,
        super.getSectionRegistrationNumbers,
        this.getQuarterBalanceSheetSection,
        this.getQuarterFinancialResultsSection,
        this.getQuarterreportresp,
      ],
    };
  }

  get getQuarterBalanceSheetSection(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.balance_sheet"),
        tableProps: {
          columns: QuarterBalanceSheetResp.getColumns,
          data: this.quarter_balance_sheet_report,
        },
      },
    };
  }

  get getQuarterFinancialResultsSection(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.financial_results"),
        tableProps: {
          columns: QuarterFinancialResultsResp.getColumns,
          data: this.quarter_financial_results_report,
        },
      },
    };
  }

  get getQuarterreportresp(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.responsible_persons"),
        tableProps: {
          columns: Quarterreportresp.getColumns,
          data: this.quarter_report_resp,
        },
      },
    };
  }
}
