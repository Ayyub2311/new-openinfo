import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";

export class Fact20 extends FactBase {
  @IsString()
  name_counterparty: string;

  @IsString()
  location_counterparty: string;

  @IsString()
  decision_transaction: string;

  @IsString()
  date_decision: string;

  @IsString()
  carrying_value: string;

  @IsString()
  transaction_amount: string;

  @IsString()
  assets_issuer: string;

  @IsString()
  date_transaction: string;

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
        title: this.t("Facts.fact20.title"),
        items: [
          { label: this.t("Facts.fact20.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact20.factTitleTitle"), value: this.fact_title },
          { label: this.t("Facts.fact20.nameCounterpartyTitle"), value: this.name_counterparty },
          { label: this.t("Facts.fact20.locationCounterpartyTitle"), value: this.location_counterparty },
          { label: this.t("Facts.fact20.decisionTransactionTitle"), value: this.decision_transaction },
          { label: this.t("Facts.fact20.dateDecisionTitle"), value: this.date_decision },
          { label: this.t("Facts.fact20.carryingValueTitle"), value: this.carrying_value },
          { label: this.t("Facts.fact20.dateTransactionTitle"), value: this.date_transaction },
          { label: this.t("Facts.fact20.transactionAmountTitle"), value: this.transaction_amount },
          { label: this.t("Facts.fact20.assetsIssuerTitle"), value: this.assets_issuer },
          { label: this.t("Facts.fact20.typeTransactionTitle"), value: this.type_transaction },
          { label: this.t("Facts.fact20.subjectMatterTitle"), value: this.subject_matter },
          { label: this.t("Facts.fact20.issuerTransactionTitle"), value: this.issuer_transaction },
        ],
      },
    };
  }
}
