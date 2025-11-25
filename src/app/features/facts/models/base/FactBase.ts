import { IsNumber, IsString, validate } from "class-validator";
import { OrganizationInfo } from "./OrganizationInfo";
import { plainToClass } from "class-transformer";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../../components/FactBuilder";

import type { useTranslations } from "next-intl";
type TFunction = ReturnType<typeof useTranslations>;

export class FactBase extends OrganizationInfo {
  private translator: TFunction | null = null;

  set setTranslator(t: TFunction) {
    this.translator = t;
  }

  protected get t(): TFunction {
    if (!this.translator) {
      throw new Error("Translator not set in FactBase");
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

  get getSections(): FactBuilderProps {
    throw new Error("This method is not implemented, it must be implemented in the inherited classes.");
  }

  static create(data: unknown): FactBase {
    const instance = new this();
    Object.assign(instance, data);
    return instance;
  }

  static async validate(factData: unknown): Promise<{ isValid: boolean; errors: unknown[] }> {
    const fact = plainToClass(this, factData);

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
        title: this.t("Facts.factbase.title"),
        items: [
          { label: this.t("Facts.factbase.organization_name"), value: this.organization_name },
          { label: this.t("Facts.factbase.organization_short_name_text"), value: this.organization_short_name_text },
          { label: this.t("Facts.factbase.org_ticket_number"), value: this.org_ticket_number || "-" },
        ],
      },
    };
  }

  get getSectionContactDetails(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.factbase.contact_details"),
        items: [
          { label: this.t("Facts.factbase.org_address"), value: this.org_address },
          { label: this.t("Facts.factbase.org_location"), value: this.org_location },
          { label: this.t("Facts.factbase.org_email"), value: this.org_email || "-" },
          { label: this.t("Facts.factbase.org_website"), value: this.org_website || "-" },
        ],
      },
    };
  }

  get getSectionOrganizationLeadership(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.factbase.organization_leadership"),
        items: [
          { label: this.t("Facts.factbase.head_person_name"), value: this.head_person_name },
          { label: this.t("Facts.factbase.accountant_person_name"), value: this.accountant_person_name },
          { label: this.t("Facts.factbase.responsible_person_name"), value: this.responsible_person_name || "-" },
        ],
      },
    };
  }
}
