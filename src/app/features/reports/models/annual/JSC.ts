import { FactBuilderProps, FactBuilderSectionTable } from "@/app/features/facts/components/FactBuilder";
import { ReportBase } from "../base/ReportBase";
import { IsArray } from "class-validator";
import { AnnualActivityReportResp } from "../nested/AnnualActivityReport";
import { AccruedIncomeReportResp } from "../nested/AccruedIncomeReport";
import { ExistingDebtReportResp } from "../nested/ExistingDebtReport";
import { PersonnelChangeReportResp } from "../nested/PersonnelChangeReport";
import { AdditionalStockSubmissionResp } from "../nested/AdditionalStockSubmissionReport";
import { FactsReport } from "../nested/FactsReport";
import { QuarterFinancialResultsResp } from "../nested/Quarterfinancialresultsresp";
import { AuditionResultReport } from "../nested/AuditionResultReport";
import { AffiliatesListReport } from "../nested/AffiliatesListReport";
import { QuarterBalanceSheetResp } from "../nested/Quarterbalancesheet";

export class JSCAnnualReport extends ReportBase {
  @IsArray()
  accrued_income_report: AccruedIncomeReportResp[];

  @IsArray()
  facts_report: FactsReport[];

  @IsArray()
  existing_debt_report: ExistingDebtReportResp[];

  @IsArray()
  annual_activity_report: AnnualActivityReportResp[];

  @IsArray()
  personnel_change_report: PersonnelChangeReportResp[];

  @IsArray()
  additional_stock_submission_report: AdditionalStockSubmissionResp[];

  @IsArray()
  balance_sheet_report: QuarterBalanceSheetResp[];

  @IsArray()
  financial_results_report: QuarterFinancialResultsResp[];

  @IsArray()
  audition_result_report: AuditionResultReport[];

  @IsArray()
  affiliates_list_report: AffiliatesListReport[];

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getReportApproval,
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        super.getSectionBankRequisites,
        super.getSectionRegistrationNumbers,
        this.getAnnualActivityReport,
        this.getAccruedIncomeReport,
        this.getExistingDebtReport,
        this.getPersonnelChangeReport,
        this.getAdditionalStockSubmission,
        this.getFactsReport,
        this.getBalanceSheetSection,
        this.getFinancialResultsSection,
        this.getAuditionResultReport,
        this.getAffiliatesListReport,
      ],
    };
  }

  get getAnnualActivityReport(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.annual_activity_report"),
        tableProps: {
          columns: AnnualActivityReportResp.getColumns,
          data: this.annual_activity_report,
        },
      },
    };
  }
  get getAccruedIncomeReport(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.accrued_income_report"),
        tableProps: {
          columns: AccruedIncomeReportResp.getColumns,
          data: this.accrued_income_report,
        },
      },
    };
  }

  get getExistingDebtReport(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.existing_debt_report"),
        tableProps: {
          columns: ExistingDebtReportResp.getColumns,
          data: this.existing_debt_report,
        },
      },
    };
  }

  get getPersonnelChangeReport(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.personnel_change_report"),
        tableProps: {
          columns: PersonnelChangeReportResp.getColumns,
          data: this.personnel_change_report,
        },
      },
    };
  }
  get getAdditionalStockSubmission(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.additional_stock_submission"),
        tableProps: {
          columns: AdditionalStockSubmissionResp.getColumns,
          data: this.additional_stock_submission_report,
        },
      },
    };
  }

  get getFactsReport(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.facts_report"),
        tableProps: {
          columns: FactsReport.getColumns,
          data: this.facts_report,
        },
      },
    };
  }

  get getBalanceSheetSection(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.balance_sheet"),
        tableProps: {
          columns: QuarterBalanceSheetResp.getColumns,
          data: this.balance_sheet_report,
        },
      },
    };
  }

  get getFinancialResultsSection(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.financial_results"),
        tableProps: {
          columns: QuarterFinancialResultsResp.getColumns,
          data: this.financial_results_report,
        },
      },
    };
  }

  get getAuditionResultReport(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.audition_result_report"),
        tableProps: {
          columns: AuditionResultReport.getColumns,
          data: this.audition_result_report,
        },
      },
    };
  }

  get getAffiliatesListReport(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Reports.affiliates_list_report"),
        tableProps: {
          columns: AffiliatesListReport.getColumns,
          data: this.affiliates_list_report,
        },
      },
    };
  }
}
