import { FactBuilderProps, FactBuilderSectionTable } from "@/app/features/facts/components/FactBuilder";
import { ReportBase } from "../base/ReportBase";
import { IsArray } from "class-validator";

import { Quarterreportresp } from "../nested/Quarterreportresp";
import { QuarterBalanceSheetBankResp } from "../nested/Quarterbalancesheetbank";
import { QuarterFinancialResultsBankResp } from "../nested/Quarterfinancialresultsbank";

export class BankQuarterlyReport extends ReportBase {
  @IsArray()
  quarter_balance_sheet_report: QuarterBalanceSheetBankResp[];

  @IsArray()
  quarter_financial_results_report: QuarterFinancialResultsBankResp[];

  @IsArray()
  quarter_report_resp: Quarterreportresp[];

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        super.getSectionBankRequisites,
        super.getSectionRegistrationNumbers,
        this.getQuarterBalanceSheetBankSection,
        this.getQuarterFinancialResultsBankSection,
        this.getQuarterreportresp,
      ],
    };
  }

  get getQuarterBalanceSheetBankSection(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.balance_sheet"),
        tableProps: {
          columns: QuarterBalanceSheetBankResp.getColumns,
          data: this.quarter_balance_sheet_report,
        },
      },
    };
  }

  get getQuarterFinancialResultsBankSection(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.financial_results"),
        tableProps: {
          columns: QuarterFinancialResultsBankResp.getColumns,
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
