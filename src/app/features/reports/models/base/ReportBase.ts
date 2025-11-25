import { IsNumber, IsString, validate } from "class-validator";
import { plainToClass } from "class-transformer";
import type { useTranslations } from "next-intl";
import { OrganizationInfo } from "@/app/features/facts/models/base/OrganizationInfo";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";
type TFunction = ReturnType<typeof useTranslations>;

export class ReportBase extends OrganizationInfo {
  private translator: TFunction | null = null;

  set setTranslator(t: TFunction) {
    this.translator = t;
  }

  protected get t(): TFunction {
    if (!this.translator) {
      throw new Error("Translator not set in ReportBase");
    }
    return this.translator;
  }

  @IsNumber()
  id: number;

  @IsString()
  fact_title: string;

  @IsString()
  fact_number: string;

  @IsString()
  full_name_text: string;

  @IsString()
  short_name_text: string;

  @IsString()
  exchange_ticket_name: string;

  @IsString()
  @IsString()
  location: string;

  @IsString()
  address: string;
  @IsString()
  email: string;
  @IsString()
  web_site: string;
  @IsString()
  status: string;

  @IsString()
  head_person_name: string;

  @IsString()
  accountant_person_name: string;

  @IsString()
  responsible_person_name: string;

  @IsString()
  pub_date: string;

  @IsString()
  fact_own_link: string;

  @IsString()
  approved_date: string;

  @IsNumber()
  type: number;

  // Annual Report Fields

  @IsString()
  approval_date: string;

  @IsString()
  emitent_body: string;

  get getSections(): FactBuilderProps {
    throw new Error("This method is not implemented, it must be implemented in the inherited classes.");
  }

  static create(data: unknown): ReportBase {
    const instance = new this();
    Object.assign(instance, data);
    return instance;
  }

  static async validate(reportData: unknown): Promise<{ isValid: boolean; errors: unknown[] }> {
    const fact = plainToClass(this, reportData);

    const errors = await validate(fact, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  get getSectionNameOfTheIssuer(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Reports.name_of_the_issuer"),
        items: [
          { label: this.t("Reports.full_name_text"), value: this.organization.full_name_text },
          { label: this.t("Reports.short_name_text"), value: this.organization.short_name_text || "-" },
          { label: this.t("Reports.exchange_ticket_name"), value: this.organization.exchange_ticket_name || "-" },
        ],
      },
    };
  }

  get getSectionContactDetails(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Reports.contact_details"),
        items: [
          { label: this.t("Reports.location"), value: this.organization.location },
          { label: this.t("Reports.address"), value: this.organization.address },
          { label: this.t("Reports.email"), value: this.organization.email || "-" },
          { label: this.t("Reports.web_site"), value: this.organization.web_site || "-" },
        ],
      },
    };
  }
  get getSectionBankRequisites(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Reports.bank_requisites"),
        items: [
          { label: this.t("Reports.serving_bank"), value: this.organization.serving_bank },
          { label: this.t("Reports.account_number"), value: this.organization.account_number },
          { label: this.t("Reports.mfo"), value: this.organization.mfo || "-" },
        ],
      },
    };
  }

  get getSectionRegistrationNumbers(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Reports.registration_numbers"),
        items: [
          { label: this.t("Reports.gov_reg_number"), value: this.organization.gov_reg_number },
          { label: this.t("Reports.inn"), value: this.organization.inn },
          { label: this.t("Reports.kfs"), value: this.organization.kfs || "-" },
          { label: this.t("Reports.okpo"), value: this.organization.okpo || "-" },
          { label: this.t("Reports.okonx"), value: this.organization.okonx || "-" },
          { label: this.t("Reports.soato"), value: this.organization.soato || "-" },
        ],
      },
    };
  }

  get getReportApproval(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Reports.report_approval"),
        items: [
          { label: this.t("Reports.emitent_body"), value: this.emitent_body },

          { label: this.t("Reports.approval_date"), value: this.approval_date || "-" },
        ],
      },
    };
  }
}
