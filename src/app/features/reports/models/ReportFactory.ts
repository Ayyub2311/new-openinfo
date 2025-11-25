import { BankAnnualReport } from "./annual/Bank";
import { InsuranceAnnualReport } from "./annual/Insurance";
import { JSCAnnualReport } from "./annual/JSC";
import { ReportBase } from "./base/ReportBase";
import { BankQuarterlyReport } from "./quarterly/Bank";
import { InsuranceQuarterlyReport } from "./quarterly/Insurance";
import { JSCQuarterlyReport } from "./quarterly/JSC";
import { LLCQuarterlyReport } from "./quarterly/LLC";
import { MicroQuarterlyReport } from "./quarterly/Micro";

const validReportTypes = ["quarter", "annual"];
const validCategories = ["bank", "insurance", "llc", "jsc", "micro"];

const reportMap: Record<string, Record<string, typeof ReportBase>> = {
  quarter: {
    bank: BankQuarterlyReport,
    insurance: InsuranceQuarterlyReport,
    llc: LLCQuarterlyReport,
    jsc: JSCQuarterlyReport,
    micro: MicroQuarterlyReport,
  },
  annual: {
    bank: BankAnnualReport,
    insurance: InsuranceAnnualReport,
    jsc: JSCAnnualReport,
  },
};

export class ReportFactory {
  static createReport(data: { category: string; type: string; id: number } & Record<string, unknown>): ReportBase {
    const { category, type } = data;

    if (!this.isValidReportTypeCategory(category, type)) {
      throw new Error(`Invalid report type or category: ${category}/${type}`);
    }

    const ReportClass = reportMap[type]?.[category]; // Corrected the order of type and category

    if (!ReportClass) {
      throw new Error(`No report found for type: ${type}, category: ${category}`);
    }

    return ReportClass.create(data);
  }

  static isValidReportTypeCategory(category: string, type: string): boolean {
    return validCategories.includes(category) && validReportTypes.includes(type) && !!reportMap[type]?.[category];
  }
}
