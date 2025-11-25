import { IsString, IsNumber } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";

export class Fact19 extends FactBase {
  @IsString()
  name_counterparty: string;

  @IsString()
  location_counterparty: string;

  @IsString()
  decision_transaction: string;

  @IsString()
  date_decision: string;

  @IsNumber()
  carrying_value: number;

  @IsString()
  date_transaction: string;

  @IsNumber()
  transaction_amount: number;

  @IsString()
  type_transaction: string;

  @IsString()
  subject_matter: string;

  @IsString()
  issuer_transaction: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getSectionInformationOnMaterialFact,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getSectionInformationOnMaterialFact(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact19.title"),
        items: [
          { label: this.t("Facts.fact19.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact19.factTitleTitle"), value: this.fact_title },
          { label: this.t("Facts.fact19.nameCounterpartyTitle"), value: this.name_counterparty },
          { label: this.t("Facts.fact19.locationCounterpartyTitle"), value: this.location_counterparty },
          { label: this.t("Facts.fact19.decisionTransactionTitle"), value: this.decision_transaction },
          { label: this.t("Facts.fact19.dateDecisionTitle"), value: this.date_decision },
          {
            label: this.t("Facts.fact19.carryingValueTitle"),
            value: new Intl.NumberFormat("ru-RU").format(this.carrying_value),
          },
          { label: this.t("Facts.fact19.dateTransactionTitle"), value: this.date_transaction },
          {
            label: this.t("Facts.fact19.transactionAmountTitle"),
            value: new Intl.NumberFormat("ru-RU").format(this.transaction_amount),
          },
          { label: this.t("Facts.fact19.typeTransactionTitle"), value: this.type_transaction },
          { label: this.t("Facts.fact19.subjectMatterTitle"), value: this.subject_matter },
          { label: this.t("Facts.fact19.issuerTransactionTitle"), value: this.issuer_transaction },
        ],
      },
    };
  }
}
