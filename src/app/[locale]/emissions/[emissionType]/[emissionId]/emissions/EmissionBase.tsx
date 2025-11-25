import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

import { EmissionOrganizationInfo } from "./EmissionOrganizationInfo";

import type { useTranslations } from "next-intl";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";
type TFunction = ReturnType<typeof useTranslations>;

export class EmissionBase extends EmissionOrganizationInfo {
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

  get getSections(): FactBuilderProps {
    throw new Error("This method is not implemented, it must be implemented in the inherited classes.");
  }

  static create(data: unknown): EmissionBase {
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
          { label: this.t("Facts.factbase.organization_name"), value: this.organization.full_name_text },
          { label: this.t("Facts.factbase.organization_short_name_text"), value: this.organization.short_name_text },
          { label: this.t("Facts.factbase.org_ticket_number"), value: this.organization.exchange_ticket_name || "-" },
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
          { label: this.t("Facts.factbase.org_address"), value: this.organization.address },
          { label: this.t("Facts.factbase.org_location"), value: this.organization.location },
          { label: this.t("Facts.factbase.org_email"), value: this.organization.email || "-" },
          { label: this.t("Facts.factbase.org_website"), value: this.organization.web_site || "-" },
        ],
      },
    };
  }
}
